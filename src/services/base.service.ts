import { XMLParser } from 'fast-xml-parser';
import { AIWS_ERROR_CODE, AIWS_ERROR_MESSAGES, AIWSError, pushAIWSError } from 'src/types/aiwsError.type';

export abstract class BaseService {
  protected parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  constructor() {}

  protected checkResponseStatus(status: number, errors: AIWSError) {
    if (status >= 200 && status < 300) {
      return true;
    }

    switch (status) {
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
          AIWS_ERROR_MESSAGES.HTTP_ERROR,
        );
        return false;

      default:
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.HTTP_ERROR,
          [],
          AIWS_ERROR_MESSAGES.HTTP_ERROR,
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
}