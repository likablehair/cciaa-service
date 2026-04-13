import { AIWSClient } from 'src/main';
import { AIWS_ERROR_CODE, AIWSError } from 'src/types/aiws-error.type';
import { CompanyShare, CompanySummary } from 'src/types/companies-register/company.types';
import { CompanyAdministrativeDataSummary } from 'src/types/companies-register/administrative-data-company.types';
import { expect, test, describe, beforeAll } from 'vitest';
import { DateTime } from 'luxon';
import { COMPANY_BLOCK } from 'src/services/companies-register/company.service';

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
    const balanceSheetData = await client.balanceSheetService.getBalanceSheetByVatNumber(
      vat,
      errors,
    );

    if (balanceSheetData) {
      expect(balanceSheetData).toBeDefined();
      expect(typeof balanceSheetData).toBe('object');
      expect(balanceSheetData.companyRevenue).toBeGreaterThan(0);
      expect(balanceSheetData.companyProfit).toBeGreaterThan(0);
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

    await client.companyService.getCompanyBlocks({
      rea: {
        cciaa: cciaa,
        nRea: nRea,
      },
      blocco: blocco,
      errors,
    });
  });

  test('Recupero completo blocchi amministrativi società con CCIAA MN e N. REA 269396', async () => {
    const cciaa = 'MN';
    const nRea = 269396;
    const blocco = [
      COMPANY_BLOCK.ALB,
      COMPANY_BLOCK.AMM,
      COMPANY_BLOCK.APE,
      COMPANY_BLOCK.CAP,
      COMPANY_BLOCK.CON,
      COMPANY_BLOCK.PAR,
      COMPANY_BLOCK.PCO,
      COMPANY_BLOCK.SOC,
      COMPANY_BLOCK.STA,
      COMPANY_BLOCK.STO,
      COMPANY_BLOCK.SUL,
      COMPANY_BLOCK.TFS
    ];
    const errors: AIWSError = [];
    const blockSummary = await client.companyService.getCompanyBlocks({
      rea: {
        cciaa: cciaa,
        nRea: nRea,
      },
      blocco: blocco,
      errors,
    });

    expect(blockSummary).toBeDefined();
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

    const companyBalanceSheet =
      await client.balanceSheetService.getBalanceSheetByVatNumber(vat, errors);
    if (companyBalanceSheet) {
      expect(companyBalanceSheet).toBeDefined();
      expect(companyBalanceSheet.companyRevenue).toBeGreaterThan(0);
      expect(companyBalanceSheet.companyProfit).toBeGreaterThan(0);
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
        const administrativeSummary:
          | CompanyAdministrativeDataSummary
          | undefined = await client.companyService.getCompanyBlocks({
            rea: {
              cciaa: companySummaryData.companyCciaaCode,
              nRea: companySummaryData.companyReaNumber,
            },
            blocco: 'AMM',
            errors,
          });
        
        const constitutionDate =
          administrativeSummary?.identification.constitutionDate;
        const fullCompanySummary: CompanySummary = {
          ...companySummaryData,
          ...companyBalanceSheet,
          companyShares,
          companyIncorporationDate: constitutionDate
            ? DateTime.fromFormat(constitutionDate, 'dd/MM/yyyy')
            : null,
        };

        expect(fullCompanySummary.companyName).toBe(
          companySummaryData.companyName,
        );
        if (fullCompanySummary.companyRevenue)
          expect(fullCompanySummary.companyRevenue).toBeGreaterThan(0);

        expect(fullCompanySummary.companyShares?.length).toBeGreaterThan(0);
        expect(fullCompanySummary.companyIncorporationDate?.toISODate()).toBe(
          '2021-07-13',
        );
      }
    }
  });

  test('Recupero completo dati aziendali per P.IVA 02650200203', async () => {
    const vat = '02650200203';

    const company = await client.companyService.getCompany(vat);

    console.log('Company data retrieved for VAT number', vat, ':', JSON.stringify(company, null, 2));

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
      expect(company.companyIncorporationDate?.toISODate()).toBe('2021-07-13');
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

  test('Recupero ruoli aziendali di una persona', async () => {
    const fiscalCode = import.meta.env.VITE_PERSON_WITH_ROLES_FISCAL_CODE;
    const errors: AIWSError = [];
    const roles = await client.personService.getPersonCorporateRoles({
      fiscalCode,
      errors,
    });

    expect(roles).toBeDefined();
    expect(roles?.personCorporateRoles).toBeDefined();
    expect(Array.isArray(roles?.personCorporateRoles)).toBe(true);
    expect(roles?.personCorporateRoles?.length).toBeGreaterThan(0);
  });

  test('Recupero ruoli aziendali di una persona con codice fiscale non esistente', async () => {
    const fiscalCode = 'AAAAAA00A00A000A';
    const errors: AIWSError = [];
    const roles = await client.personService.getPersonCorporateRoles({
      fiscalCode,
      errors,
    });

    expect(roles).toBeNull();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].code).toBe(AIWS_ERROR_CODE.BAD_REQUEST);
  });

  test('Recupero ruoli aziendali di una persona senza ruoli', async () => {
    const fiscalCode = import.meta.env.VITE_PERSON_WITHOUT_ROLES_FISCAL_CODE;
    const errors: AIWSError = [];
    const roles = await client.personService.getPersonCorporateRoles({
      fiscalCode,
      errors,
    });

    expect(roles).toBeDefined();
    expect(roles?.personCorporateRoles).toBeDefined();
    expect(Array.isArray(roles?.personCorporateRoles)).toBe(true);
    expect(roles?.personCorporateRoles?.length).toBe(0);
  });

  test('Recupero protesti di una persona', async () => {
    const fiscalCode = import.meta.env.VITE_PERSON_WITH_PROTESTS_FISCAL_CODE;
    const errors: AIWSError = [];
    const protests = await client.protestService.getPersonProtests({
      fiscalCode,
      errors,
    });

    expect(protests).toBeDefined();
    expect(Array.isArray(protests)).toBe(true);
    expect(protests!.length).toBeGreaterThan(0);
    expect(protests?.[0].protestReport).toBeDefined();
    expect(protests?.[0].protestReport.fiscalCode).toBe(fiscalCode);
    expect(protests?.[0].protestReport.protestEffects.length).toBeGreaterThan(
      0,
    );
  });

  test('Recupero protesti di una persona senza protesti', async () => {
    const fiscalCode = import.meta.env.VITE_PERSON_WITHOUT_PROTESTS_FISCAL_CODE;
    const errors: AIWSError = [];
    const protests = await client.protestService.getPersonProtests({
      fiscalCode,
      errors,
    });

    expect(protests).toBeDefined();
    expect(Array.isArray(protests)).toBe(true);
    expect(protests!.length).toBe(0);
  });

  test('Recupero partecipazioni societarie di una persona giuridica', async () => {
    const fiscalCode = import.meta.env.VITE_PERSON_WITH_HOLDINGS_FISCAL_CODE;
    const errors: AIWSError = [];
    const holdings =
      await client.ownershipStructureService.getPersonCorporateHoldings({
        fiscalCode,
        errors,
      });

    expect(holdings).toBeDefined();
    expect(holdings?.personCorporateHoldings).toBeDefined();
    expect(
      Array.isArray(holdings?.personCorporateHoldings.holderIdentity),
    ).toBe(false);
    expect(holdings?.personCorporateHoldings.holderIdentity).toBeDefined();
  });
});
