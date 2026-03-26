import { AxiosInstance } from 'axios';
import { CompanyManager } from 'src/managers/company.manager';
import { FinancialManager } from 'src/managers/financial.manager';
import { SharesManager } from 'src/managers/shares.manager';
import { ParsedAIWSResponse } from 'src/types/aiws.types';
import type {
  CompanyFinancials,
  CompanyShare,
  CompanySummary,
} from 'src/types/company.types';
import {
  AIWS_ERROR_MESSAGES,
  AIWSError,
  AIWS_ERROR_CODE,
  pushAIWSError,
} from 'src/types/aiwsError.type';
import { CompanyAdministrativeDataSummary } from 'src/types/administrativeDataCompany.types';
import { parseUnknownDate } from 'src/helpers/date.helper';
import { BaseService } from './base.service';

export class CompanyService extends BaseService {
  constructor(private client: AxiosInstance) {
    super();
  }

  /** Estrae il riepilogo anagrafico di una società tramite P.IVA */
  public async getCompanySummaryByVatNumber(
    vatNumber: string,
    errors: AIWSError,
  ): Promise<CompanySummary | null> {
    try {
      const response = await this.client.get(
        '/registroimprese/imprese/ricerca/partitaiva',
        {
          params: {
            partitaIva: vatNumber,
            fSoloSedi: 'S',
            responseType: 'text',
          },
        },
      );

      if (
        !this.checkResponseStatus({
          status: response.status,
          data: response.data,
          errors,
        })
      ) {
        return null;
      }

      const json = this.parseXml<ParsedAIWSResponse>(response.data, errors);
      if (!json) return null;

      const anagrafica =
        json.Risposta?.ListaImpreseRI?.Impresa?.AnagraficaImpresa;

      if (!anagrafica) {
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.COMPANY_NOT_FOUND,
          ['vatNumber'],
          AIWS_ERROR_MESSAGES.COMPANY_NOT_FOUND,
        );
        return null;
      }

      const manager = new CompanyManager();
      return manager.mapAnagraficaImpresaToCompanySummary(anagrafica);
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED,
        ['vatNumber'],
        AIWS_ERROR_MESSAGES.COMPANY_SUMMARY_FETCH_FAILED,
      );
      return null;
    }
  }

  public async getFinancialsByVatNumber(
    vatNumber: string,
    errors: AIWSError,
  ): Promise<CompanyFinancials | null> {
    try {
      const response = await this.client.get(
        '/registroimprese/bilanci/xbrl/codicefiscale',
        {
          params: {
            codiceFiscale: vatNumber,
            allXbrl: 'S',
            responseType: 'text',
          },
        },
      );

      if (
        !this.checkResponseStatus({
          status: response.status,
          data: response.data,
          errors,
        })
      ) {
        return null;
      }

      const json = this.parseXml<ParsedAIWSResponse>(response.data, errors);
      if (!json) return null;

      const manager = new FinancialManager();
      return await manager.getFinancialValues(json, errors);
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.FINANCIALS_FETCH_FAILED,
        ['vatNumber'],
        AIWS_ERROR_MESSAGES.FINANCIALS_FETCH_FAILED,
      );
      return null;
    }
  }

  /** Estrae soci e quote societarie tramite CCIAA e N. REA */
  public async getSharesByRea(
    cciaa: string,
    nRea: number,
    errors: AIWSError,
  ): Promise<CompanyShare[]> {
    try {
      const response = await this.client.get(
        '/registroimprese/output/impresa/soci/nrea/xml',
        { params: { cciaa, nRea }, responseType: 'text' },
      );

      if (
        !this.checkResponseStatus({
          status: response.status,
          data: response.data,
          errors,
        })
      ) {
        return [];
      }

      const json = this.parseXml<ParsedAIWSResponse>(response.data, errors);
      if (!json) return [];

      const manager = new SharesManager();

      const totalCapital = manager.parseCapital(
        json.Risposta.dati['blocchi-impresa']['sintesi-cifre-impresa'][
          'capitale-sociale'
        ]['sottoscritto']['ammontare'],
      );

      const structures =
        json.Risposta.dati['blocchi-impresa']['elenco-soci']['riquadri'][
          'riquadro'
        ];

      return manager.getShares(structures, totalCapital);
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.SHARES_FETCH_FAILED,
        ['companyShares'],
        AIWS_ERROR_MESSAGES.SHARES_FETCH_FAILED,
      );
      return [];
    }
  }

  /** Extracts the AMM block via CCIAA and REA number */
  public async getCompanyByRea(
    cciaa: string,
    nRea: number,
    blocco: string,
    errors: AIWSError,
  ): Promise<CompanyAdministrativeDataSummary | undefined> {
    try {
      const response = await this.client.get(
        '/registroimprese/output/impresa/blocchi/nrea/xml',
        { params: { cciaa, nRea, blocco }, responseType: 'text' },
      );

      if (
        !this.checkResponseStatus({
          status: response.status,
          data: response.data,
          errors,
        })
      ) {
        return;
      }

      const rawJson = this.parseXml<ParsedAIWSResponse>(response.data, errors);
      if (!rawJson) return;

      const manager = new CompanyManager();
      if (blocco === 'AMM')
        return await manager.mapRegistroImpresaToCompanyAdministrativeSummary(
          rawJson,
        );
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.HTTP_ERROR,
        ['companyIncorporationDate'],
        AIWS_ERROR_MESSAGES.HTTP_ERROR,
      );
    }
  }

  public async getCompany(vatNumber: string): Promise<CompanySummary | null> {
    const errors: AIWSError = [];

    const summary = await this.getCompanySummaryByVatNumber(vatNumber, errors);
    if (!summary) return null;

    const financials = (await this.getFinancialsByVatNumber(
      vatNumber,
      errors,
    )) ?? {
      companyRevenue: 0,
      companyProfit: 0,
    };

    let shares: CompanyShare[] = [];

    if (summary.companyCciaaCode && summary.companyReaNumber) {
      shares = await this.getSharesByRea(
        summary.companyCciaaCode,
        summary.companyReaNumber,
        errors,
      );
    } else {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.MISSING_CCIAA_OR_REA,
        [],
        AIWS_ERROR_MESSAGES.MISSING_CCIAA_OR_REA,
      );
    }

    let administrativeSummary: CompanyAdministrativeDataSummary | undefined;

    if (summary.companyCciaaCode && summary.companyReaNumber) {
      administrativeSummary = await this.getCompanyByRea(
        summary.companyCciaaCode,
        summary.companyReaNumber,
        'AMM',
        errors,
      );
    } else {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.MISSING_CCIAA_OR_REA,
        [],
        AIWS_ERROR_MESSAGES.MISSING_CCIAA_OR_REA,
      );
    }

    const constitutionDate =
      administrativeSummary?.identification.constitutionDate;
    return {
      ...summary,
      ...financials,
      companyShares: shares,
      companyIncorporationDate: parseUnknownDate(constitutionDate),
      aiwsError: errors,
    };
  }
}
