// src/clients/CCIAAService.ts
import { AIWSConfig } from '../types/aiws.types';
import { CompanyService as CompanyService } from '../services/company.service';
import axios, { AxiosInstance } from 'axios';

export default class AIWSClient {
  private axiosInstance: AxiosInstance;
  public companyService: CompanyService;

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
  }
}
