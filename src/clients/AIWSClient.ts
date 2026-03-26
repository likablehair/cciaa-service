// src/clients/CCIAAService.ts
import { AIWSConfig } from '../types/aiws.types';
import { CompanyService as CompanyService } from '../services/company.service';
import axios, { AxiosInstance } from 'axios';
import { PersonService } from 'src/services/person.service';
import { ProtestService } from 'src/services/protest.service';
import { OwnershipStructureService } from 'src/services/ownershipStructure.service';

export default class AIWSClient {
  private axiosInstance: AxiosInstance;
  public companyService: CompanyService;
  public personService: PersonService;
  public protestService: ProtestService;
  public ownershipStructureService: OwnershipStructureService;

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
    this.ownershipStructureService = new OwnershipStructureService(this.axiosInstance);
  }
}
