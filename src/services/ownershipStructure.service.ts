import { AxiosInstance } from "axios";
import { BaseService } from "./base.service";
import { AIWSError } from "src/main";
import { CorporateHoldingStructure } from "src/types/ownershipStructure.types";
import { AIWS_ERROR_CODE, AIWS_ERROR_MESSAGES, pushAIWSError } from "src/types/aiwsError.type";
import { ParsedPartecipazioniResponse } from "src/types/aiws.types";
import { OwnershipStructureManager } from "src/managers/ownershipStructure.manager";

export class OwnershipStructureService extends BaseService {
  constructor(private client: AxiosInstance) {
    super();
  }

  /** Recupera la struttura proprietaria di una società */
  public async getPersonCorporateHoldings(params: {
    fiscalCode: string;
    errors: AIWSError
  }): Promise<{
    personCorporateHoldings: CorporateHoldingStructure,
    htmlBuffer?: Buffer;
  } | null> {
    const { fiscalCode, errors } = params;
    try {
      const response = await this.client.get(
        'registroimprese/assettiproprietari/partecipazioni/codicefiscale/xml',
        { params: { codiceFiscale: fiscalCode, responseType: 'text' } },
      );

      const fileResponse = await this.client.get(
        'registroimprese/assettiproprietari/partecipazioni/codicefiscale/html',
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

      const json = this.parseXml<ParsedPartecipazioniResponse>(
        response.data,
        errors,
      );

      if (!json) return null;

      const numHoldings = json.Risposta.Testata.Riepilogo.NumeroPosizioni;
      if (numHoldings === 0) {
        return null
      }

      const partecipazioniData = json.Risposta?.dati;
      if (!partecipazioniData) {
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.CORPORATE_HOLDINGS_NOT_FOUND,
          ['fiscalCode'],
          AIWS_ERROR_MESSAGES.CORPORATE_HOLDINGS_NOT_FOUND,
        );
        return null;
      }

      const ownershipStructureManager = new OwnershipStructureManager();
      const corporateHoldings = await ownershipStructureManager.mapPartecipazioniDataToCorporateHoldingStructure({
        partecipazioniData: partecipazioniData,
        errors,
      });

      if (!corporateHoldings) {
        pushAIWSError(
          errors,
          AIWS_ERROR_CODE.CORPORATE_HOLDINGS_NOT_FOUND,
          ['fiscalCode'],
          AIWS_ERROR_MESSAGES.CORPORATE_HOLDINGS_NOT_FOUND,
        );
        return null;
      }

      return {
        personCorporateHoldings: corporateHoldings,
        htmlBuffer,
      };

    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.PERSON_CORPORATE_HOLDINGS_FETCH_FAILED,
        ['fiscalCode'],
        AIWS_ERROR_MESSAGES.PERSON_CORPORATE_HOLDINGS_FETCH_FAILED,
      );
      return null; 
    }
  }
}