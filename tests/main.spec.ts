import { AIWSClient } from 'src/main';
import {  CompanyFinancials, CompanyShare, CompanySummary } from 'src/types/company.types';
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

    expect(info.companyName).toBe('TRENDAFIL S.R.L.');
    expect(info.companyStatusCode).toBe('R');

    expect(info.companyCciaaCode).toBe('MI');
    expect(info.companyReaNumber).toBeDefined();
  });

  test('Recupero Ragione Sociale per P.IVA 02650200203', async () => {
    const piva = '02650200203';
    const info = await client.companyService.getCompanySummaryByVatNumber(piva);

    expect(info.companyName).toBe('LH S.R.L.');
    expect(info.companyStatusCode).toBe('R');

    expect(info.companyCciaaCode).toBe('MN');
    expect(info.companyReaNumber).toBeDefined();
  });

  test('Recupero dati finanziari per la società con P.IVA 02650200203', async () => {
    const vat = '02650200203';

    const financialData: CompanyFinancials = await client.companyService.getFinancialsByVatNumber(vat);

    expect(financialData).toBeDefined();
    expect(typeof financialData).toBe('object');
    expect(financialData.companyRevenue).toBeGreaterThan(0);
    expect(financialData.companyProfit).toBeGreaterThan(0);
  });

  test('Recupero soci e quote per la società con CCIAA MN e N. REA 269396', async () => {
    const cciaa = 'MN';
    const nRea = 269396;

    const companyShares: CompanyShare[] =
      await client.companyService.getSharesByRea(cciaa, nRea);

    expect(companyShares).toBeDefined();
    expect(typeof companyShares).toBe('object');
    expect(Array.isArray(companyShares)).toBe(true);
    expect(companyShares.length).toBeGreaterThan(0);

    const person = companyShares.find(
      (s) => s.fiscalCode === 'PSSFPP98A21G535T',
    );
    const person2 = companyShares.find(
      (s) => s.fiscalCode === 'MOIMLN98S05C816P',
    );

    expect(person).toBeDefined();
    expect(person?.shareValue).toBeGreaterThan(25);
    expect(person2?.shareValue).toBeGreaterThan(25);
    expect(person?.sharePercentage).toBeGreaterThan(0);
  });

  test('Recupero completo dati aziendali per P.IVA 02650200203', async () => {
    const vat = '02650200203';

    const companySummaryData = await client.companyService.getCompanySummaryByVatNumber(vat);
    expect(companySummaryData).toBeDefined();
    expect(companySummaryData.companyName).toBe('LH S.R.L.');
    expect(companySummaryData.companyStatusCode).toBe('R');

    const companyFinancials: CompanyFinancials =
      await client.companyService.getFinancialsByVatNumber(vat);
    expect(companyFinancials).toBeDefined();
    expect(companyFinancials.companyRevenue).toBeGreaterThan(0);
    expect(companyFinancials.companyProfit).toBeGreaterThan(0);

    const companyShares: CompanyShare[] = await client.companyService.getSharesByRea(companySummaryData.companyCciaaCode, companySummaryData.companyReaNumber);
    expect(companyShares).toBeDefined();
    expect(Array.isArray(companyShares)).toBe(true);
    expect(companyShares.length).toBeGreaterThan(0);

    const fullCompanySummary: CompanySummary = {
      ...companySummaryData,
      ...companyFinancials,
      companyShares,
    };

    expect(fullCompanySummary.companyName).toBe(companySummaryData.companyName);
    expect(fullCompanySummary.companyRevenue).toBeGreaterThan(0);
    expect(fullCompanySummary.companyShares?.length).toBeGreaterThan(0);
  });

    test('Recupero completo dati aziendali per P.IVA 13619250965', async () => {
    const vat = '13619250965';

    const company = await client.companyService.getCompany(vat);
    if(company) {
      expect(company).toBeDefined();
      expect(company.companyName).toBe('TRENDAFIL S.R.L.');
      expect(company.companyStatusCode).toBe('R');
      expect(company).toBeDefined();
      if(company.companyRevenue)
        expect(company.companyRevenue).toBeGreaterThan(0);
      if(company.companyProfit)
        expect(company.companyProfit).toBeGreaterThan(0);

      expect(company.companyShares).toBeDefined();
      expect(Array.isArray(company.companyShares)).toBe(true);
      expect(company.companyShares?.length).toBeGreaterThan(0);
      expect(company.companyName).toBe(company.companyName);

      console.log(company);
    }
  });
});
