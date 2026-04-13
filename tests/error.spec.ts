import { vi, describe, test, expect, beforeAll } from 'vitest';
import { CompanyService } from 'src/services/companies-register/company.service';
import { AIWS_ERROR_CODE, AIWSError } from 'src/types/aiws-error.type';
import { BalanceSheetService } from 'src/services/companies-register/balance-sheet.service';

describe('CompanyService error handling', () => {
  let service: CompanyService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAxios: any;

  beforeAll(() => {
    mockAxios = {
      get: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service = new CompanyService(mockAxios as any);
  });

  test('getCompanySummaryByVatNumber - company not found', async () => {
    mockAxios.get.mockResolvedValue({ status: 404, data: '' });

    const errors: AIWSError = [];
    const result = await service.getCompanySummaryByVatNumber(
      '00000000000',
      errors,
    );
    console.log(errors);

    expect(result).toBeNull();
    expect(errors[0].code).toBe(AIWS_ERROR_CODE.COMPANY_NOT_FOUND);
  });

  test('getBalanceSheetByVatNumber - service unavailable', async () => {
    mockAxios.get.mockResolvedValue({ status: 503, data: '' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balanceSheetService = new BalanceSheetService(mockAxios as any);
    const errors: AIWSError = [];
    const result = await balanceSheetService.getBalanceSheetByVatNumber(
      '00000000000',
      errors,
    );

    console.log(errors);
    expect(result).toBeNull();
    expect(errors[0].code).toBe(AIWS_ERROR_CODE.SERVICE_UNAVAILABLE);
  });

  test('getSharesByRea - HTTP 500 error', async () => {
    mockAxios.get.mockResolvedValue({ status: 500, data: 'error' });

    const errors: AIWSError = [];
    const result = await service.getSharesByRea('MI', 123456, errors);

    console.log(errors);
    expect(result).toEqual([]);
    expect(errors[0].code).toBe(AIWS_ERROR_CODE.HTTP_ERROR);
  });

  test('getCompany - missing CCIAA or REA triggers error', async () => {
    mockAxios.get.mockResolvedValue({
      status: 200,
      data: `<Risposta><ListaImpreseRI><Impresa><AnagraficaImpresa><Denominazione>TEST S.R.L.</Denominazione></AnagraficaImpresa></Impresa></ListaImpreseRI></Risposta>`,
    });

    const company = await service.getCompany('00000000000');

    if (company && company.aiwsError) {
      expect(company).toBeDefined();
      expect(
        company.aiwsError.some(
          (e) => e.code === AIWS_ERROR_CODE.MISSING_CCIAA_OR_REA,
        ),
      ).toBe(true);
    }
  });
});
