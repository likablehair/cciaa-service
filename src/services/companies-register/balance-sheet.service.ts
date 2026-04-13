import { AxiosInstance } from 'axios';
import { BaseService } from '../base.service';
import { CompanyBalanceSheet } from 'src/types/companies-register/company.types';
import {
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  AIWSError,
  pushAIWSError,
} from 'src/types/aiws-error.type';
import { ParsedAIWSResponse } from 'src/types/aiws.types';
import { BalanceSheetManager } from 'src/managers/companies-register/balance-sheet.manager';

export class BalanceSheetService extends BaseService {
  constructor(private client: AxiosInstance) {
    super();
  }

  public async getBalanceSheetByVatNumber(
    vatNumber: string,
    errors: AIWSError,
  ): Promise<CompanyBalanceSheet | null> {
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

      const manager = new BalanceSheetManager();
      return await manager.getBalanceSheetValues(json, errors);
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.BALANCE_SHEET_FETCH_FAILED,
        ['vatNumber'],
        AIWS_ERROR_MESSAGES.BALANCE_SHEET_FETCH_FAILED,
      );
      return null;
    }
  }
}
