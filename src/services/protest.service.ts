import { AxiosInstance } from 'axios';
import { BaseService } from './base.service';
import {
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  AIWSError,
  pushAIWSError,
} from 'src/types/aiwsError.type';
import {
  ParsedListaAnagraficheResponse,
  ParsedVisuraEffettoResponse,
} from 'src/types/aiws.types';
import { ProtestData } from 'src/types/protest.type';
import { ProtestManager } from 'src/managers/protest.manager';

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
        protestData: ProtestData[];
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
        return [{ protestData: [], htmlBuffer: undefined }];
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
        protestData: ProtestData[];
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

        const protestData = jsonProtestReport.Risposta.VisuraEffetto
          ?.RegistroProtesti
          ? Array.isArray(
              jsonProtestReport.Risposta.VisuraEffetto.RegistroProtesti,
            )
            ? jsonProtestReport.Risposta.VisuraEffetto.RegistroProtesti
            : [jsonProtestReport.Risposta.VisuraEffetto.RegistroProtesti]
          : [];

        const mappedProtestData =
          await protestManager.mapRegistroProtestiToProtestData({
            kAnagrafica,
            fiscalCode,
            registroProtestiData: protestData,
            errors,
          });

        protestDataList.push({
          protestData: mappedProtestData,
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
