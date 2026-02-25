import { expect, test, describe, beforeAll } from 'vitest';
import { AIWSService } from '../src/clients/AIWSService';

describe('CCIAA Integration - Dati Aziendali', () => {
  let service: AIWSService;

  beforeAll(() => {
    service = new AIWSService({
      username: process.env.VITE_CCIAA_USERNAME || 'test_user',
      password: process.env.VITE_CCIAA_PASSWORD || 'test_pwd',
      environment: process.env.VITE_CCIAA_ENVIRONMENT || 'sandbox' // Obbligatorio per i test [cite: 74, 115]
    });
  });

  test('Recupero Ragione Sociale per P.IVA 02650200203', async () => {

    const piva = '02650200203';
    const info = await service.imprese.ricercaPerPartitaIva(piva);

    expect(info.Denominazione).toBe('LH S.R.L.');
    expect(info.StatoAttivita).toBe('R');
    
    expect(info.Cciaa).toBe('MN');
    expect(info.NRea).toBeDefined();
  });
});