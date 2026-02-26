// src/clients/CCIAAService.ts
import { AIWSConfig } from '../types/aiws.types';
import { ImpresaService } from '../services/ImpresaService';
import axios, { AxiosInstance } from 'axios';

export default class AIWSService {
  private axiosInstance: AxiosInstance;
  public imprese: ImpresaService;

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

    this.imprese = new ImpresaService(this.axiosInstance);
  }
}
