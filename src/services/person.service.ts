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
  }): Promise<PersonCorporateRole[] | null> {
    try {
      const response = await this.client.get(
        'registroimprese/persone/scheda/codicefiscale/xml',
        { params: { codiceFiscale: params.fiscalCode } },
      );

      if (!this.checkResponseStatus(response.status, params.errors))
        return null;

      const json = this.parseXml<ParsedAIWSResponse<PersonaData>>(
        response.data,
        params.errors,
      );
      if (!json) return null;

      const personaData = json.Risposta?.dati;
      if (!personaData) {
        pushAIWSError(
          params.errors,
          AIWS_ERROR_CODE.PERSONA_DATA_NOT_FOUND,
          ['fiscalCode'],
          AIWS_ERROR_MESSAGES.PERSONA_DATA_NOT_FOUND,
        );
        return null;
      }

      const manager = new PersonManager();
      return manager.mapPersonaDataToCorporateRoles({
        personaData,
        errors: params.errors,
      });
    } catch (err) {
      console.log(err);
      pushAIWSError(
        params.errors,
        AIWS_ERROR_CODE.PERSONA_DATA_FETCH_FAILED,
        ['fiscalCode'],
        AIWS_ERROR_MESSAGES.PERSONA_DATA_FETCH_FAILED,
      );
      return null;
    }
  }
}
