import { AxiosInstance } from 'axios';
import { BaseService } from '../base.service';
import {
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  AIWSError,
  pushAIWSError,
} from 'src/types/aiws-error.type';
import {
  ParsedListaAnagraficheResponse,
  ParsedVisuraEffettoResponse,
} from 'src/types/aiws.types';
import { ProtestReport } from 'src/types/protests-register/protest.type';
import { ProtestManager } from 'src/managers/protests-register/protest.manager';

export class ProtestService extends BaseService {
  constructor(private client: AxiosInstance) {
    super();
  }

  /** Recupera i protesti di una persona */
  public async getPersonProtests(params: {
    fiscalCode: string;
    errors: AIWSError;
  }): Promise<
    | {
        protestReport: ProtestReport;
        htmlBuffer?: Buffer;
      }[]
    | null
  > {
    const { fiscalCode, errors } = params;
    try {
      const responseSearch = await this.client.get(
        '/registroprotesti/protesti/ricerca/nazionale',
        { params: { nominativo: fiscalCode, responseType: 'text' } },
      );

      if (
        !this.checkResponseStatus({
          status: responseSearch.status,
          data: responseSearch.data,
          errors,
        })
      ) {
        return null;
      }

      const jsonSearch = this.parseXml<ParsedListaAnagraficheResponse>(
        responseSearch.data,
        errors,
      );

      if (!jsonSearch) return null;

      const numProtests = jsonSearch.Risposta.Testata.Riepilogo.NumeroPosizioni;
      if (numProtests === 0) {
        return [];
      }

      const personalDataList = jsonSearch.Risposta.ListaAnagrafiche
        ?.AnagraficaNominativo
        ? Array.isArray(
            jsonSearch.Risposta.ListaAnagrafiche.AnagraficaNominativo,
          )
          ? jsonSearch.Risposta.ListaAnagrafiche.AnagraficaNominativo
          : [jsonSearch.Risposta.ListaAnagrafiche.AnagraficaNominativo]
        : [];

      const protestManager = new ProtestManager();
      const protestDataList: {
        protestReport: ProtestReport;
        htmlBuffer?: Buffer;
      }[] = [];
      for (const personalData of personalDataList) {
        const kAnagrafica = personalData.KAnagrafica;
        const protestReportResponse = await this.client.get(
          '/registroprotesti/protesti/visura/effetto/anagrafica/xml',
          { params: { KAnagrafica: kAnagrafica, responseType: 'text' } },
        );

        const protestReportFileResponse = await this.client.get(
          '/registroprotesti/protesti/visura/effetto/anagrafica/html',
          { params: { KAnagrafica: kAnagrafica, responseType: 'text' } },
        );

        if (
          !this.checkResponseStatus({
            status: protestReportResponse.status,
            data: protestReportResponse.data,
            errors,
          })
        ) {
          continue;
        }

        let htmlBuffer: Buffer | undefined = undefined;
        if (
          this.checkResponseStatus({
            status: protestReportFileResponse.status,
            data: protestReportFileResponse.data,
            errors,
          })
        ) {
          htmlBuffer = Buffer.from(protestReportFileResponse.data, 'utf8');
        }

        const jsonProtestReport = this.parseXml<ParsedVisuraEffettoResponse>(
          protestReportResponse.data,
          errors,
        );

        if (!jsonProtestReport) continue;

        const mappedProtestData =
          await protestManager.mapVisuraEffettoResponseToProtestReport({
            visuraEffettoResponse: jsonProtestReport.Risposta.VisuraEffetto,
            fiscalCode,
            errors,
          });

        if (!mappedProtestData) {
          continue;
        }

        protestDataList.push({
          protestReport: mappedProtestData,
          htmlBuffer,
        });
      }

      return protestDataList;
    } catch (error) {
      console.error('Error fetching protest data:', error);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.PROTESTS_FETCH_FAILED,
        [],
        AIWS_ERROR_MESSAGES.PROTESTS_FETCH_FAILED,
      );
      return null;
    }
  }
}
