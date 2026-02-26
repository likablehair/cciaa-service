import { AIWSClient } from 'src/main';
import { expect, test, describe, beforeAll } from 'vitest';

describe('CCIAA Integration - Dati Aziendali', () => {
  let client: AIWSClient;

  beforeAll(() => {
    client = new AIWSClient({
      username: process.env.VITE_CCIAA_USERNAME || 'test_user',
      password: process.env.VITE_CCIAA_PASSWORD || 'test_pwd',
      environment: process.env.VITE_CCIAA_ENVIRONMENT || 'sandbox', // Obbligatorio per i test [cite: 74, 115]
    });
  });

  test('Recupero Ragione Sociale per P.IVA 13619250965', async () => {
    const piva = '13619250965';
    const info = await client.companyService.getCompanySummaryByVatNumber(piva);

    console.log(info);
    expect(info.companyName).toBe('TRENDAFIL S.R.L.');
    expect(info.companyStatusCode).toBe('R');

    expect(info.companyCciaaCode).toBe('MI');
    expect(info.companyReaNumber).toBeDefined();
  });

  test('Recupero Ragione Sociale per P.IVA 02650200203', async () => {
    const piva = '02650200203';
    const info = await client.companyService.getCompanySummaryByVatNumber(piva);

    console.log(info);
    expect(info.companyName).toBe('LH S.R.L.');
    expect(info.companyStatusCode).toBe('R');

    expect(info.companyCciaaCode).toBe('MN');
    expect(info.companyReaNumber).toBeDefined();
  });
});
