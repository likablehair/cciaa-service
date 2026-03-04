import { AxiosInstance } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { CompanySummary } from 'src/main';
import { CompnayManager } from 'src/managers/company.manager';
import { RevenueManager } from 'src/managers/financial.manager';
import { ShareholderManager } from 'src/managers/shares.manager';
import { ParsedAIWSResponse } from 'src/types/aiws.types';
import {
  AIWSError,
  CompanyFinancials,
  CompanyShare,
} from 'src/types/company.types';

export class CompanyService {
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  constructor(private client: AxiosInstance) {}

  private checkResponseStatus(status: number, data: unknown, entity = 'CCIAA') {
    switch (status) {
      case 200:
        return;
      case 404:
        throw new Error(`${entity} non trovata`);
      case 503:
        throw new Error(`${entity} temporaneamente non disponibile`);
      case 500:
        throw new Error(`Errore HTTP ${entity}: ${data}`);
      default:
        throw new Error(`Errore HTTP ${entity}: ${status}`);
    }
  }

  private parseXml<T>(xmlData: string): T {
    try {
      return this.parser.parse(xmlData) as T;
    } catch (err) {
      throw new Error(`Errore nel parsing XML: ${err}`);
    }
  }

  /** Estrae il riepilogo anagrafico di una società tramite P.IVA */
  public async getCompanySummaryByVatNumber(
    vatNumber: string,
  ): Promise<CompanySummary> {
    try {
      const response = await this.client.get(
        '/registroimprese/imprese/ricerca/partitaiva',
        { params: { partitaIva: vatNumber, fSoloSedi: 'S' } },
      );

      this.checkResponseStatus(response.status, response.data);

      const json = this.parseXml<ParsedAIWSResponse>(response.data);
      const anangraficaImpresa =
        json.Risposta.ListaImpreseRI.Impresa.AnagraficaImpresa;

      if (!anangraficaImpresa) {
        throw new Error(
          `Impresa non trovata. Risposta: ${JSON.stringify(
            json.Risposta.Testata.Riepilogo,
          )}`,
        );
      }

      const manager = new CompnayManager();
      return await manager.mapAnagraficaImpresaToCompanySummary(
        anangraficaImpresa,
      );
    } catch (err) {
      throw new Error(`Errore getCompanySummaryByVatNumber: ${err}`);
    }
  }

  /** Estrae valori finanziari tramite P.IVA */
  public async getFinancialsByVatNumber(
    vatNumber: string,
  ): Promise<CompanyFinancials> {
    try {
      const response = await this.client.get(
        '/registroimprese/bilanci/xbrl/codicefiscale',
        { params: { codiceFiscale: vatNumber, allXbrl: 'S' } },
      );

      this.checkResponseStatus(response.status, response.data);

      const json = this.parseXml<ParsedAIWSResponse>(response.data);
      const manager = new RevenueManager();
      return await manager.getFinancialValues(json);
    } catch (err) {
      throw new Error(`Errore getFinancialValueByVatNumber: ${err}`);
    }
  }

  /** Estrae soci e quote societarie tramite CCIAA e N. REA */
  public async getSharesByRea(
    cciaa: string,
    nRea: number,
  ): Promise<CompanyShare[]> {
    try {
      const response = await this.client.get(
        '/registroimprese/output/impresa/soci/nrea/xml',
        { params: { cciaa, nRea } },
      );

      this.checkResponseStatus(response.status, response.data);

      const json = this.parseXml<ParsedAIWSResponse>(response.data);
      const manager = new ShareholderManager();

      const totalCapital = manager.parseCapital(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        json.Risposta.dati['blocchi-impresa']['sintesi-cifre-impresa']['capitale-sociale']['sottoscritto']['ammontare'],
      );
      const companyStructures =
        json.Risposta.dati['blocchi-impresa']['elenco-soci']['riquadri'][
          'riquadro'
        ];

      return await manager.getShares(companyStructures, totalCapital);
    } catch (err) {
      throw new Error(`Errore getSharesByRea: ${err}`);
    }
  }

  // public async getCompany(vatNumber: string): Promise<CompanySummary> {
  //   const companySummaryData =
  //     await this.getCompanySummaryByVatNumber(vatNumber);
  //   const companyFinancials: CompanyFinancials =
  //     await this.getFinancialsByVatNumber(vatNumber);
  //   const companyShares: CompanyShare[] = await this.getSharesByRea(
  //     companySummaryData.companyCciaaCode,
  //     companySummaryData.companyReaNumber,
  //   );

  //   const fullCompanySummary: CompanySummary = {
  //     ...companySummaryData,
  //     ...companyFinancials,
  //     companyShares,
  //   };

  //   return fullCompanySummary;
  // }

  public async getCompany(
    vatNumber: string,
  ): Promise<CompanySummary | undefined> {
    // Oggetto finale parziale con valori iniziali null o vuoti
    let companySummaryData: CompanySummary | null = null;
    let companyFinancials: CompanyFinancials | null = null;
    let companyShares: CompanyShare[] = [];
    const aiwsError: AIWSError = [];

    // 1️⃣ Recupero Ragione Sociale
    try {
      companySummaryData = await this.getCompanySummaryByVatNumber(vatNumber);
    } catch (err) {
      const errorMessage = `Errore recupero dati CompanySummary: ${err}`;
      aiwsError.push(errorMessage);
    }

    // 2️⃣ Recupero dati finanziari
    try {
      companyFinancials = await this.getFinancialsByVatNumber(vatNumber);
    } catch (err) {
      const errorMessage = `Errore recupero dei dati Financials: ${err}`;
      companyFinancials = {
        companyRevenue: 0,
        companyProfit: 0,
      } as CompanyFinancials;

      aiwsError.push(errorMessage);
    }

    if (companySummaryData) {
      try {
        if (
          companySummaryData.companyCciaaCode &&
          companySummaryData.companyReaNumber
        ) {
          companyShares = await this.getSharesByRea(
            companySummaryData.companyCciaaCode,
            companySummaryData.companyReaNumber,
          );
        } else {
          const errorMessage = `Impossibile recuperare soci: CCIAA o REA mancanti`;
          companyShares = [];
          aiwsError.push(errorMessage);
        }
      } catch (err) {
        const errorMessage = `Errore recupero delle shares: ${err}`;
        companyShares = [];
        aiwsError.push(errorMessage);
      }

      const fullCompanySummary: CompanySummary = {
        ...companySummaryData,
        ...companyFinancials,
        companyShares,
        aiwsError,
      };

      return fullCompanySummary;
    }
  }
}
