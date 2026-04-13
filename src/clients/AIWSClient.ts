// src/clients/CCIAAService.ts
import { AIWSConfig } from '../types/aiws.types';

import axios, { AxiosInstance } from 'axios';
import { CompanyService } from 'src/services/companies-register/company.service';
import { BalanceSheetService } from 'src/services/companies-register/balance-sheet.service';
import { PersonService } from 'src/services/companies-register/person.service';
import { ProtestService } from 'src/services/protests-register/protest.service';
import { OwnershipStructureService } from 'src/services/companies-register/ownership-structure.service';

export default class AIWSClient {
  private axiosInstance: AxiosInstance;
  public companyService: CompanyService;
  public personService: PersonService;
  public protestService: ProtestService;
  public ownershipStructureService: OwnershipStructureService;
  public balanceSheetService: BalanceSheetService;

  constructor(config: AIWSConfig) {
    const baseURL =
      config.environment === 'production'
        ? 'https://aiws.infocamere.it/aiws/rest'
        : 'https://aiwscl.infocamere.it/aiws/rest';
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        username: config.username,
        password: config.password,
        Accept: 'application/xml',
      },
      validateStatus: () => true,
    });

    this.companyService = new CompanyService(this.axiosInstance);
    this.personService = new PersonService(this.axiosInstance);
    this.protestService = new ProtestService(this.axiosInstance);
    this.ownershipStructureService = new OwnershipStructureService(
      this.axiosInstance,
    );
    this.balanceSheetService = new BalanceSheetService(this.axiosInstance);
  }
}
