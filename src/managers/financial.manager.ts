import { XMLParser } from 'fast-xml-parser';
import { CompanyFinancials as FinancialValue } from 'src/types/company.types';

export class RevenueManager {

  public async getFinancialValues(xmlBaseResponse: any): Promise<FinancialValue> {
    const base64Xbrl = xmlBaseResponse.Risposta.dati;

    if (!base64Xbrl) {
      throw new Error('XBRL empty in response');
    }

    const xbrlXml = Buffer.from(base64Xbrl, 'base64').toString('utf-8');

    const xbrlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    });

    const xbrlJson = xbrlParser.parse(xbrlXml);

    if (!xbrlJson.xbrl) {
      throw new Error('Error on XBRL structure');
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
      companyProfit: profitNode ? Number(profitNode['#text']) : 0.00,
      companyRevenue: revenueNode ? Number(revenueNode['#text']) : 0.00,
    };
  }

  private findByContext(xbrl: any, tagName: string, contextRef: string) {
    const node = xbrl[tagName];
    if (!node) return null;

    const nodes = Array.isArray(node) ? node : [node];
    return nodes.find((n) => n.contextRef === contextRef);
  }
}
