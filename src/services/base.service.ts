import { XMLParser } from 'fast-xml-parser';
import { decode } from 'html-entities';
import { ParsedAIWSResponse } from 'src/types/aiws.types';
import {
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  AIWSError,
  pushAIWSError,
} from 'src/types/aiws-error.type';

export abstract class BaseService {
  protected parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    tagValueProcessor: (_, tagValue) => {
      if (typeof tagValue === 'string') {
        return decode(tagValue);
      }
      return tagValue;
    },
    attributeValueProcessor: (_, attrValue) => {
      if (typeof attrValue === 'string') {
        return decode(attrValue);
      }
      return attrValue;
    },
  });

  constructor() {}

  protected checkResponseStatus(params: {
    status: number;
    data?: unknown;
    errors: AIWSError;
  }): boolean {
    const { status, data, errors } = params;
    if (status >= 200 && status < 300) {
      return true;
    }

    let jsonData: ParsedAIWSResponse<null> | undefined = undefined;
    const xmlData = this.extractXmlData(data);
    if (xmlData) {
      try {
        jsonData =
          this.parseXml<ParsedAIWSResponse<null>>(xmlData, errors) || undefined;
      } catch (err) {
        console.log('Error parsing error response XML:', err);
      }
    }

    const errorDescription =
      jsonData?.Risposta?.Testata?.Messaggio?.DescrizioneErrore;

    switch (status) {
      case 400:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.BAD_REQUEST,
          [],
          AIWS_ERROR_MESSAGES.BAD_REQUEST +
            (errorDescription ? `: ${errorDescription}` : ''),
        );
        return false;
      case 402:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.INSUFFICIENT_CREDIT,
          [],
          AIWS_ERROR_MESSAGES.INSUFFICIENT_CREDIT,
        );
        return false;
      case 404:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.COMPANY_NOT_FOUND,
          [],
          AIWS_ERROR_MESSAGES.COMPANY_NOT_FOUND,
        );
        return false;

      case 503:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.SERVICE_UNAVAILABLE,
          [],
          AIWS_ERROR_MESSAGES.SERVICE_UNAVAILABLE,
        );
        return false;

      case 500:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.HTTP_ERROR,
          [],
          AIWS_ERROR_MESSAGES.HTTP_ERROR +
            (errorDescription ? `: ${errorDescription}` : ''),
        );
        return false;

      default:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.HTTP_ERROR,
          [],
          AIWS_ERROR_MESSAGES.HTTP_ERROR +
            (errorDescription ? `: ${errorDescription}` : ''),
        );
        return false;
    }
  }

  protected parseXml<T>(xmlData: string, errors: AIWSError): T | null {
    try {
      return this.parser.parse(xmlData) as T;
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XML_PARSE_ERROR,
        [],
        AIWS_ERROR_MESSAGES.XML_PARSE_ERROR,
      );
      return null;
    }
  }

  private extractXmlData(data: unknown): string | null {
    if (typeof data === 'string') {
      return data;
    }

    if (data instanceof ArrayBuffer) {
      return new TextDecoder().decode(new Uint8Array(data));
    }

    if (ArrayBuffer.isView(data)) {
      return new TextDecoder().decode(data);
    }

    return null;
  }
}
