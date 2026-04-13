import { AxiosInstance } from 'axios';
import { CompanyManager } from 'src/managers/companies-register/company.manager';
import { SharesManager } from 'src/managers/companies-register/shares.manager';
import {
  ParsedAIWSResponse,
  ParsedBlocchiImpresaResponse,
} from 'src/types/aiws.types';
import type {
  CompanyShare,
  CompanySummary,
} from 'src/types/companies-register/company.types';
import {
  AIWS_ERROR_MESSAGES,
  AIWSError,
  AIWS_ERROR_CODE,
  pushAIWSError,
} from 'src/types/aiws-error.type';
import { Riquadro } from 'src/types/companies-register/share.type';
import { CompanyRegistryBlocksSummary } from 'src/types/companies-register/administrative-data-company.types';
import { parseUnknownDate } from 'src/helpers/date.helper';
import { BaseService } from '../base.service';
import { BalanceSheetService } from './balance-sheet.service';

export const COMPANY_BLOCK = {
  /** Attività, albi, ruoli e licenze */
  ALB: 'ALB',
  /** Amministratori */
  AMM: 'AMM',
  /** Titolari di altre cariche o qualifiche */
  APE: 'APE',
  /** Capitale e strumenti finanziari */
  CAP: 'CAP',
  /** Società o enti controllanti */
  CON: 'CON',
  /** Partecipazioni in altre società */
  PAR: 'PAR',
  /** Scioglimento, procedure concorsuali, cancellazione */
  PCO: 'PCO',
  /** Soci e titolari di diritti su quote o azioni */
  SOC: 'SOC',
  /** Informazioni da statuto */
  STA: 'STA',
  /** Storia delle modifiche */
  STO: 'STO',
  /** Sede e unità locali */
  SUL: 'SUL',
  /** Trasferimenti d'azienda, fusioni, scissioni, subentri */
  TFS: 'TFS',
} as const;

export type CompanyBlock = (typeof COMPANY_BLOCK)[keyof typeof COMPANY_BLOCK];

export class CompanyService extends BaseService {
  private isValidRiquadro(value: unknown): value is Riquadro {
    if (!value || typeof value !== 'object') return false;

    const riquadro = value as {
      'composizione-quote'?: { 'valore-nominale'?: string };
      titolari?: { titolare?: unknown };
    };

    return Boolean(
      riquadro['composizione-quote']?.['valore-nominale'] &&
        riquadro.titolari?.titolare,
    );
  }

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

      const json = this.parseXml<ParsedBlocchiImpresaResponse>(
        response.data,
        errors,
      );
      if (!json) return [];

      const manager = new SharesManager();

      const capitalAmount =
        json.Risposta.dati['blocchi-impresa']['sintesi-cifre-impresa']?.[
          'capitale-sociale'
        ]?.['sottoscritto']?.ammontare;

      if (!capitalAmount) {
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.SHARES_FETCH_FAILED,
          ['companyShares'],
          AIWS_ERROR_MESSAGES.SHARES_FETCH_FAILED,
        );
        return [];
      }

      const totalCapital = manager.parseCapital(capitalAmount);

      const structures =
        json.Risposta.dati['blocchi-impresa']['elenco-soci']?.['riquadri']?.[
          'riquadro'
        ];

      if (!structures) {
        return [];
      }

      const normalizedStructures = Array.isArray(structures)
        ? structures
        : [structures];
      const validStructures = normalizedStructures.filter((riquadro) =>
        this.isValidRiquadro(riquadro),
      );

      if (validStructures.length === 0) {
        return [];
      }

      return manager.getShares(validStructures, totalCapital);
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

  /** Estrae i blocchi informativi di una società tramite CCIAA e N. REA o P.IVA */
  public async getCompanyBlocks(params: {
    rea?: {
      cciaa: string,
      nRea: number,
    },
    fiscalCode?: string,
    blocco: CompanyBlock[] | CompanyBlock,
    errors: AIWSError,
  }): Promise<CompanyRegistryBlocksSummary | undefined> {
    const { rea, fiscalCode, blocco, errors } = params;

    if (!rea && !fiscalCode) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.MISSING_CCIAA_OR_REA,
        [],
        AIWS_ERROR_MESSAGES.MISSING_CCIAA_OR_REA,
      );
      return;
    }

    let blocks: string;
    if (Array.isArray(blocco)) {
      blocks = blocco.join(',');
    } else {
      blocks = blocco;
    }

    const urlByRea = '/registroimprese/output/impresa/blocchi/nrea/xml';
    const urlByFiscalCode = '/registroimprese/output/impresa/blocchi/codicefiscale/xml';

    try {
      let response;

      if (rea) {
        const { cciaa, nRea } = rea;
        response = await this.client.get(urlByRea, {
          params: { cciaa, nRea, blocco: blocks },
          responseType: 'text',
        });
      } else {
        response = await this.client.get(urlByFiscalCode, {
          params: { codiceFiscale: fiscalCode, blocco: blocks },
          responseType: 'text',
        });
      }

      if (
        !this.checkResponseStatus({
          status: response.status,
          data: response.data,
          errors,
        })
      ) {
        return;
      }
      

      const rawJson = this.parseXml<ParsedBlocchiImpresaResponse>(
        response.data,
        errors,
      );
      if (!rawJson) return;

      const manager = new CompanyManager();
      return await manager.mapBlocchiImpresaToCompanyRegistryBlocksSummary(
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

    const balanceSheetService = new BalanceSheetService(this.client);
    const balanceSheet = (await balanceSheetService.getBalanceSheetByVatNumber(
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

    let administrativeSummary: CompanyRegistryBlocksSummary | undefined;

    if (summary.companyCciaaCode && summary.companyReaNumber) {
      administrativeSummary = await this.getCompanyBlocks(
        {
          rea: {
            cciaa: summary.companyCciaaCode,
            nRea: summary.companyReaNumber,
          },
          blocco: COMPANY_BLOCK.AMM,
          errors,
        }
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
      ...balanceSheet,
      companyShares: shares,
      companyIncorporationDate: parseUnknownDate(constitutionDate),
      aiwsError: errors,
    };
  }
}
