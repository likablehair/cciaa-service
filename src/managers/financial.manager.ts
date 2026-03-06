import { XMLParser } from 'fast-xml-parser';
import { CompanyFinancials } from 'src/types/company.types';
import {
  AIWSError,
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  pushAIWSError,
} from 'src/types/aiwsError.type';

export class FinancialManager {
  async getFinancialValues(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xmlBaseResponse: any,
    errors: AIWSError,
  ): Promise<CompanyFinancials | null> {
    const base64Xbrl = xmlBaseResponse?.Risposta?.dati;

    if (!base64Xbrl) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XBRL_EMPTY,
        {},
        AIWS_ERROR_MESSAGES.XBRL_EMPTY,
      );
      return null;
    }

    let xbrlXml: string;

    try {
      xbrlXml = Buffer.from(base64Xbrl, 'base64').toString('utf-8');
    } catch (err) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XBRL_DECODE_ERROR,
        {
          error: String(err),
        },
        AIWS_ERROR_MESSAGES.XBRL_DECODE_ERROR,
      );
      return null;
    }

    const xbrlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let xbrlJson: any;

    try {
      xbrlJson = xbrlParser.parse(xbrlXml);
    } catch (err) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XML_PARSE_ERROR,
        {
          error: String(err),
        },
        AIWS_ERROR_MESSAGES.XML_PARSE_ERROR,
      );
      return null;
    }

    if (!xbrlJson?.xbrl) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XBRL_MAPPING_ERROR,
        {},
        AIWS_ERROR_MESSAGES.XBRL_MAPPING_ERROR,
      );
      return null;
    }

    const xbrl = xbrlJson.xbrl;

    const profitNode = this.findByContext(
      xbrl,
      'itcc-ci:UtilePerditaEsercizio',
      'cntxCorr_d',
    );

    const revenueNode = this.findByContext(
      xbrl,
      'itcc-ci:ValoreProduzioneRicaviVenditePrestazioni',
      'cntxCorr_d',
    );

    return {
      companyProfit: profitNode ? Number(profitNode['#text']) : 0,
      companyRevenue: revenueNode ? Number(revenueNode['#text']) : 0,
    };
  }

  private findByContext(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    xbrl: any,
    tagName: string,
    contextRef: string,
  ) {
    const node = xbrl[tagName];
    if (!node) return null;

    const nodes = Array.isArray(node) ? node : [node];

    return nodes.find((n) => n.contextRef === contextRef) ?? null;
  }
}
