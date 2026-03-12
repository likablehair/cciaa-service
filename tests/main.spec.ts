import { AIWSClient } from 'src/main';
import { AIWSError } from 'src/types/aiwsError.type';
import { CompanyShare, CompanySummary } from 'src/types/company.types';
import { CompanyAdministrativeDataSummary } from 'src/types/administrativeDataCompany.types';
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
    const errors: AIWSError = [];
    const info = await client.companyService.getCompanySummaryByVatNumber(
      piva,
      errors,
    );

    if (info) {
      expect(info.companyName).toBe('TRENDAFIL S.R.L.');
      expect(info.companyStatusCode).toBe('R');

      expect(info.companyCciaaCode).toBe('MI');
      expect(info.companyReaNumber).toBeDefined();
    }
  });

  test('Recupero Ragione Sociale per P.IVA 02650200203', async () => {
    const piva = '02650200203';
    const errors: AIWSError = [];
    const info = await client.companyService.getCompanySummaryByVatNumber(
      piva,
      errors,
    );
    if (info) {
      expect(info.companyName).toBe('LH S.R.L.');
      expect(info.companyStatusCode).toBe('R');

      expect(info.companyCciaaCode).toBe('MN');
      expect(info.companyReaNumber).toBeDefined();
    }
  });

  test('Recupero dati finanziari per la società con P.IVA 02650200203', async () => {
    const vat = '02650200203';
    const errors: AIWSError = [];
    const financialData = await client.companyService.getFinancialsByVatNumber(
      vat,
      errors,
    );

    if (financialData) {
      expect(financialData).toBeDefined();
      expect(typeof financialData).toBe('object');
      expect(financialData.companyRevenue).toBeGreaterThan(0);
      expect(financialData.companyProfit).toBeGreaterThan(0);
    }
  });

  test('Recupero soci e quote per la società con CCIAA MN e N. REA 269396', async () => {
    const cciaa = 'MN';
    const nRea = 269396;
    const errors: AIWSError = [];

    const companyShares = await client.companyService.getSharesByRea(
      cciaa,
      nRea,
      errors,
    );

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

  test('Recupero dati amminstrativi società con CCIAA MN e N. REA 269396', async () => {
    const cciaa = 'MN';
    const nRea = 269396;
    const blocco = 'AMM';
    const errors: AIWSError = [];

    await client.companyService.getCompanyByRea(
      cciaa,
      nRea,
      blocco,
      errors,
    );

  });

  test('Recupero completo dati aziendali per P.IVA 02650200203', async () => {
    const vat = '02650200203';

    const errors: AIWSError = [];
    const companySummaryData =
      await client.companyService.getCompanySummaryByVatNumber(vat, errors);

    if (companySummaryData) {
      expect(companySummaryData).toBeDefined();
      expect(companySummaryData.companyName).toBe('LH S.R.L.');
      expect(companySummaryData.companyStatusCode).toBe('R');
    }

    const companyFinancials =
      await client.companyService.getFinancialsByVatNumber(vat, errors);
    if (companyFinancials) {
      expect(companyFinancials).toBeDefined();
      expect(companyFinancials.companyRevenue).toBeGreaterThan(0);
      expect(companyFinancials.companyProfit).toBeGreaterThan(0);
    }

    if (companySummaryData) {
      const companyShares: CompanyShare[] =
        await client.companyService.getSharesByRea(
          companySummaryData.companyCciaaCode,
          companySummaryData.companyReaNumber,
          errors,
        );
      expect(companyShares).toBeDefined();
      expect(Array.isArray(companyShares)).toBe(true);
      expect(companyShares.length).toBeGreaterThan(0);

      if (companySummaryData) {
        const administrativeSumary: CompanyAdministrativeDataSummary| undefined =
          await client.companyService.getCompanyByRea(
            companySummaryData.companyCciaaCode,
            companySummaryData.companyReaNumber,
            'AMM',
            errors,
          );
        const fullCompanySummary: CompanySummary = {
          ...companySummaryData,
          ...companyFinancials,
          companyShares,
          companyIncorporationDate: administrativeSumary?.identification.constitutionDate ?? '',
        };

        expect(fullCompanySummary.companyName).toBe(
          companySummaryData.companyName,
        );
        if (fullCompanySummary.companyRevenue)
          expect(fullCompanySummary.companyRevenue).toBeGreaterThan(0);

        expect(fullCompanySummary.companyShares?.length).toBeGreaterThan(0);
        expect(fullCompanySummary.companyIncorporationDate).toBe('13/07/2021');
      }
    }
  });

  test('Recupero completo dati aziendali per P.IVA 02650200203', async () => {
    const vat = '02650200203';

    const company = await client.companyService.getCompany(vat);
    if (company) {
      expect(company).toBeDefined();
      expect(company.companyName).toBe('LH S.R.L.');
      expect(company.companyStatusCode).toBe('R');
      expect(company).toBeDefined();
      if (company.companyRevenue)
        expect(company.companyRevenue).toBeGreaterThan(0);
      if (company.companyProfit)
        expect(company.companyProfit).toBeGreaterThan(0);

      expect(company.companyShares).toBeDefined();
      expect(Array.isArray(company.companyShares)).toBe(true);
      expect(company.companyShares?.length).toBeGreaterThan(0);
      expect(company.companyName).toBe(company.companyName);
      expect(company.companyIncorporationDate).toBe('13/07/2021');

    }
  });

    test('Recupero completo dati aziendali per P.IVA 13619250965', async () => {
    const vat = '13619250965';

    const company = await client.companyService.getCompany(vat);
    if (company) {
      expect(company).toBeDefined();
      expect(company.companyName).toBe('TRENDAFIL S.R.L.');
      expect(company.companyStatusCode).toBe('R');
      expect(company).toBeDefined();
      if (company.companyRevenue)
        expect(company.companyRevenue).toBeGreaterThan(0);
      if (company.companyProfit)
        expect(company.companyProfit).toBeGreaterThan(0);

      expect(company.companyShares).toBeDefined();
      expect(Array.isArray(company.companyShares)).toBe(true);
      expect(company.companyShares?.length).toBeGreaterThan(0);
      expect(company.companyName).toBe(company.companyName);
    }
  });
});
