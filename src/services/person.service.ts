import { AxiosInstance } from 'axios';
import { BaseService } from './base.service';
import {
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  AIWSError,
  pushAIWSError,
} from 'src/types/aiwsError.type';
import { PersonCorporateRole } from 'src/types/person.type';
import { ParsedAIWSResponse, PersonaData } from 'src/types/aiws.types';
import { PersonManager } from 'src/managers/person.manager';

export class PersonService extends BaseService {
  constructor(private client: AxiosInstance) {
    super();
  }

  /** Recupera i ruoli aziendali di una persona */
  public async getPersonCorporateRoles(params: {
    fiscalCode: string;
    errors: AIWSError;
  }): Promise<{
    personCorporateRoles: PersonCorporateRole[];
    htmlBuffer?: Buffer;
  } | null> {
    const { fiscalCode, errors } = params;
    try {
      const response = await this.client.get(
        'registroimprese/persone/scheda/codicefiscale/xml',
        { params: { codiceFiscale: fiscalCode, responseType: 'text' } },
      );

      const fileResponse = await this.client.get(
        'registroimprese/persone/scheda/codicefiscale/html',
        { params: { codiceFiscale: fiscalCode, responseType: 'text' } },
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

      let htmlBuffer: Buffer | undefined = undefined;
      if (
        this.checkResponseStatus({
          status: fileResponse.status,
          data: fileResponse.data,
          errors,
        })
      ) {
        htmlBuffer = Buffer.from(fileResponse.data, 'utf8');
      }

      const json = this.parseXml<ParsedAIWSResponse<PersonaData>>(
        response.data,
        errors,
      );
      if (!json) return null;

      const numRoles = json.Risposta.Testata.Riepilogo.NumeroPosizioni;
      if (numRoles === 0) {
        return {
          personCorporateRoles: [],
          htmlBuffer: undefined,
        };
      }

      const personaData = json.Risposta?.dati;
      if (!personaData) {
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.PERSONA_DATA_NOT_FOUND,
          ['fiscalCode'],
          AIWS_ERROR_MESSAGES.PERSONA_DATA_NOT_FOUND,
        );
        return null;
      }

      const manager = new PersonManager();
      const corporateRoles = await manager.mapPersonaDataToCorporateRoles({
        personaData,
        errors: errors,
      });

      return {
        personCorporateRoles: corporateRoles,
        htmlBuffer,
      };
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.PERSONA_DATA_FETCH_FAILED,
        ['fiscalCode'],
        AIWS_ERROR_MESSAGES.PERSONA_DATA_FETCH_FAILED,
      );
      return null;
    }
  }
}
