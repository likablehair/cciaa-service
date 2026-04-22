import { XMLParser } from 'fast-xml-parser';
import {
  BalanceSheetContextInfo,
  BalanceSheetFactValue,
  balanceSheetValuesXMLText,
  CompanyBalanceSheet,
  CompanyBalanceSheetValues,
} from 'src/types/companies-register/company.types';
import {
  AIWSError,
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  pushAIWSError,
} from 'src/types/aiws-error.type';
import {
  BilancioXbrlData,
  ParsedAIWSResponse,
  XbrlDocument,
  XbrlFact,
} from 'src/types/aiws.types';

type NumericBalanceSheetMetric = {
  [K in keyof CompanyBalanceSheetValues]: CompanyBalanceSheetValues[K] extends
    | number
    | null
    ? K
    : never;
}[keyof CompanyBalanceSheetValues];

export class BalanceSheetManager {
  private readonly preferredCurrentYearContexts = ['cntxCorr_d', 'cntxCorr'];

  private readonly numericBalanceSheetMetrics =
    new Set<NumericBalanceSheetMetric>([
      'personalDataShareCapital',
      'totalFixedAssetsIntangible',
      'totalFixedAssetsTangible',
      'totalFixedAssetsFinancial',
      'totalFixedAssets',
      'totalReceivables',
      'totalCashLiquid',
      'totalAssetsCurrent',
      'totalAssets',
      'equityNetCapital',
      'equityNetLegalReserves',
      'equityOtherReservesSeparatelyDisclosedTotalOtherReserves',
      'equityNetIncomeLoss',
      'totalEquity',
      'employeeSeverancePay',
      'totalPayables',
      'liabilitiesAccrualsAndDeferredIncome',
      'totalLiabilitiesAndEquity',
      'totalReceivablesFromShareholdersForUnpaidCapital',
      'receivablesDueWithinNextFiscalYear',
      'payablesDueWithinNextFiscalYear',
      'companyRevenue',
      'productionValueOtherRevenuesAndIncomeOther',
      'productionValueTotalOtherRevenuesAndIncome',
      'totalProductionValue',
      'productionCostsRawMaterialsSubsidiaryAndGoods',
      'productionCostsServices',
      'productionCostsLeaseAndRentalOfThirdPartyAssets',
      'productionCostsPersonnelWagesAndSalaries',
      'productionCostsPersonnelSocialCharges',
      'productionCostsPersonnelSeverancePay',
      'productionCostsPersonnelOtherCosts',
      'productionCostsTotalPersonnelCosts',
      'productionCostsDepreciationAmortizationIntangibleAssets',
      'productionCostsDepreciationTangibleAssets',
      'productionCostsTotalDepreciationAndWritedowns',
      'productionCostsMiscellaneousOperatingExpenses',
      'totalProductionCosts',
      'differenceBetweenProductionValueAndCosts',
      'financialIncomeExpenseInterestAndOtherFinancialChargesOther',
      'financialIncomeExpenseTotalInterestAndOtherFinancialCharges',
      'totalFinancialIncomeAndExpense',
      'resultBeforeTaxes',
      'incomeTaxCurrentDeferredAndPrepaidCurrentTaxes',
      'totalIncomeTaxCurrentAndDeferred',
      'companyProfit',
      'productionCostsPersonnelSeverancePayPensionsAndOtherPersonnelCosts',
      'productionCostsDepreciationAmortizationIntangibleTangibleAndOtherAssetWritedowns',
    ]);

  private toArray<T>(value: T | T[] | undefined): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  private toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const normalized = value
      .trim()
      .replace(/\s+/g, '')
      // Remove thousand separators in formats like 1.234.567,89.
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');

    if (!normalized) return null;

    const numeric = Number(normalized);
    return Number.isNaN(numeric) ? null : numeric;
  }

  private getXmlTextValue(value: XbrlFact | string | undefined): string | null {
    if (typeof value === 'string') return value;
    if (!value) return null;
    return value['#text'] ?? null;
  }

  private isLikelyFactQName(key: string): key is `${string}:${string}` {
    if (!key.includes(':')) return false;
    if (key === 'link:schemaRef') return false;
    if (key.startsWith('xmlns:')) return false;
    if (key.startsWith('xlink:')) return false;
    if (key.startsWith('xml:')) return false;
    return true;
  }

  private hasFactPayload(value: unknown): boolean {
    const first = Array.isArray(value) ? value[0] : value;
    if (!first) return false;

    if (typeof first === 'string') return true;
    if (typeof first !== 'object') return false;

    const candidate = first as Record<string, unknown>;
    return (
      typeof candidate['#text'] === 'string' ||
      typeof candidate._text === 'string' ||
      typeof candidate.contextRef === 'string' ||
      typeof candidate.unitRef === 'string'
    );
  }

  private mapFactValue(node: XbrlFact | string): BalanceSheetFactValue {
    if (typeof node === 'string') {
      return {
        contextRef: null,
        unitRef: null,
        decimals: null,
        valueRaw: node,
        valueNumber: this.toNumber(node),
      };
    }

    const valueRaw = this.getXmlTextValue(node);

    return {
      contextRef: node.contextRef ?? null,
      unitRef: node.unitRef ?? null,
      decimals: node.decimals ?? null,
      valueRaw,
      valueNumber: this.toNumber(valueRaw),
    };
  }

  private mapContexts(
    xbrl: XbrlDocument,
  ): Record<string, BalanceSheetContextInfo> {
    const contexts = this.toArray(xbrl.context);

    return contexts.reduce<Record<string, BalanceSheetContextInfo>>(
      (acc, context) => {
        const contextId = context?.id;
        if (!contextId) return acc;

        const entityIdentifier = context.entity?.identifier;

        acc[contextId] = {
          entityIdentifier: entityIdentifier?.['#text'] ?? null,
          entityIdentifierScheme: entityIdentifier?.scheme ?? null,
          instant: context.period?.instant ?? null,
          startDate: context.period?.startDate ?? null,
          endDate: context.period?.endDate ?? null,
          scenario: context.scenario?.['itcc-ci-abb:scen'] ?? null,
        };

        return acc;
      },
      {},
    );
  }

  private mapAllFacts(
    xbrl: XbrlDocument,
  ): Record<string, BalanceSheetFactValue[]> {
    const factsByQName: Record<string, BalanceSheetFactValue[]> = {};

    for (const [key, rawValue] of Object.entries(xbrl)) {
      if (!this.isLikelyFactQName(key)) continue;
      if (!this.hasFactPayload(rawValue)) continue;

      const factNodes = this.toArray(
        rawValue as XbrlFact | XbrlFact[] | string | string[],
      );
      factsByQName[key] = factNodes.map((node) =>
        this.mapFactValue(node as XbrlFact | string),
      );
    }

    return factsByQName;
  }

  private normalizeContextYear(
    contextInfo?: BalanceSheetContextInfo,
  ): string | null {
    if (!contextInfo) return null;

    const periodCandidate =
      contextInfo.instant ?? contextInfo.endDate ?? contextInfo.startDate;
    if (!periodCandidate) return null;

    const yearMatch = periodCandidate.match(/(\d{4})/);
    return yearMatch?.[1] ?? null;
  }

  private getEntryPriority(entry: BalanceSheetFactValue): number {
    let score = 0;

    if (
      entry.contextRef &&
      this.preferredCurrentYearContexts.includes(entry.contextRef)
    ) {
      score += 100;
    }

    if (entry.valueNumber !== null) score += 20;
    if (entry.decimals !== null) score += 5;

    return score;
  }

  private mapFactNameMap(
    factsByQName: Record<string, BalanceSheetFactValue[]>,
  ): Record<string, keyof CompanyBalanceSheetValues> {
    return Object.keys(factsByQName).reduce<
      Record<string, keyof CompanyBalanceSheetValues>
    >((acc, factQName) => {
      const mappedName =
        balanceSheetValuesXMLText[
          factQName as keyof typeof balanceSheetValuesXMLText
        ];

      if (mappedName) {
        acc[factQName] = mappedName;
      }

      return acc;
    }, {});
  }

  private createEmptyBalanceSheetValues(): CompanyBalanceSheetValues {
    return {
      personalDataDesignation: null,
      personalDataHeadquarters: null,
      personalDataShareCapital: null,
      personalDataFullyPaidupShareCapital: null,
      personalDataCciaa: null,
      personalDataVatNumber: null,
      personalDataFiscalCode: null,
      personalDataReaNumber: null,
      personalDataLegalForm: null,
      personalDataMainActivityAteco: null,
      personalDataCompanyLiquidation: null,
      personalDataCompanySingleShareholder: null,
      personalDataCompanySubpostedToDirectionAndCoordination: null,
      personalDataGroupAffiliation: null,
      totalFixedAssetsIntangible: null,
      totalFixedAssetsTangible: null,
      totalFixedAssetsFinancial: null,
      totalFixedAssets: null,
      totalReceivables: null,
      totalCashLiquid: null,
      totalAssetsCurrent: null,
      totalAssets: null,
      equityNetCapital: null,
      equityNetLegalReserves: null,
      equityOtherReservesSeparatelyDisclosedTotalOtherReserves: null,
      equityNetIncomeLoss: null,
      totalEquity: null,
      employeeSeverancePay: null,
      totalPayables: null,
      liabilitiesAccrualsAndDeferredIncome: null,
      totalLiabilitiesAndEquity: null,
      totalReceivablesFromShareholdersForUnpaidCapital: null,
      receivablesDueWithinNextFiscalYear: null,
      payablesDueWithinNextFiscalYear: null,
      companyRevenue: null,
      productionValueOtherRevenuesAndIncomeOther: null,
      productionValueTotalOtherRevenuesAndIncome: null,
      totalProductionValue: null,
      productionCostsRawMaterialsSubsidiaryAndGoods: null,
      productionCostsServices: null,
      productionCostsLeaseAndRentalOfThirdPartyAssets: null,
      productionCostsPersonnelWagesAndSalaries: null,
      productionCostsPersonnelSocialCharges: null,
      productionCostsPersonnelSeverancePay: null,
      productionCostsPersonnelOtherCosts: null,
      productionCostsTotalPersonnelCosts: null,
      productionCostsDepreciationAmortizationIntangibleAssets: null,
      productionCostsDepreciationTangibleAssets: null,
      productionCostsTotalDepreciationAndWritedowns: null,
      productionCostsMiscellaneousOperatingExpenses: null,
      totalProductionCosts: null,
      differenceBetweenProductionValueAndCosts: null,
      financialIncomeExpenseInterestAndOtherFinancialChargesOther: null,
      financialIncomeExpenseTotalInterestAndOtherFinancialCharges: null,
      totalFinancialIncomeAndExpense: null,
      resultBeforeTaxes: null,
      incomeTaxCurrentDeferredAndPrepaidCurrentTaxes: null,
      totalIncomeTaxCurrentAndDeferred: null,
      companyProfit: null,
      productionCostsPersonnelSeverancePayPensionsAndOtherPersonnelCosts: null,
      productionCostsDepreciationAmortizationIntangibleTangibleAndOtherAssetWritedowns:
        null,
    };
  }

  private isNumericBalanceSheetMetric(
    metric: keyof CompanyBalanceSheetValues,
  ): metric is NumericBalanceSheetMetric {
    return this.numericBalanceSheetMetrics.has(
      metric as NumericBalanceSheetMetric,
    );
  }

  private mapBalanceSheetByYear(
    factsByQName: Record<string, BalanceSheetFactValue[]>,
    contexts: Record<string, BalanceSheetContextInfo>,
    factNameMap: Record<string, keyof CompanyBalanceSheetValues>,
  ): Record<string, CompanyBalanceSheetValues> {
    const byYear: Record<string, CompanyBalanceSheetValues> = {};
    const scoreByYearAndMetric: Record<string, Record<string, number>> = {};

    for (const [factQName, entries] of Object.entries(factsByQName)) {
      const englishName =
        factNameMap[factQName] ??
        balanceSheetValuesXMLText[
          factQName as keyof typeof balanceSheetValuesXMLText
        ];

      if (!englishName) continue;
      if (!this.isNumericBalanceSheetMetric(englishName)) continue;

      for (const entry of entries) {
        if (entry.valueNumber === null) continue;
        if (!entry.contextRef) continue;

        const year = this.normalizeContextYear(contexts[entry.contextRef]);
        if (!year) continue;

        if (!byYear[year]) {
          byYear[year] = this.createEmptyBalanceSheetValues();
        }
        if (!scoreByYearAndMetric[year]) scoreByYearAndMetric[year] = {};

        const entryScore = this.getEntryPriority(entry);
        const currentScore = scoreByYearAndMetric[year][englishName] ?? -1;

        if (entryScore >= currentScore) {
          byYear[year][englishName] = entry.valueNumber;
          scoreByYearAndMetric[year][englishName] = entryScore;
        }
      }
    }

    return byYear;
  }

  private toOrderedBalanceSheetByYear(
    byYear: Record<string, CompanyBalanceSheetValues>,
    orderedYears: string[],
  ): Array<{ year: number; values: CompanyBalanceSheetValues }> {
    return orderedYears.map((year) => ({
      year: Number(year),
      values: byYear[year] ?? {},
    }));
  }

  private sortYearsDesc(years: string[]): string[] {
    return [...years].sort((left, right) => {
      const leftNumber = Number(left);
      const rightNumber = Number(right);

      const leftIsNumber = Number.isFinite(leftNumber);
      const rightIsNumber = Number.isFinite(rightNumber);

      if (leftIsNumber && rightIsNumber) return rightNumber - leftNumber;
      if (leftIsNumber) return -1;
      if (rightIsNumber) return 1;
      return right.localeCompare(left);
    });
  }

  async getBalanceSheetValues(
    xmlBaseResponse: ParsedAIWSResponse<string>,
    errors: AIWSError,
  ): Promise<CompanyBalanceSheet | null> {
    const base64Xbrl = xmlBaseResponse?.Risposta?.dati;

    if (!base64Xbrl || typeof base64Xbrl !== 'string') {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XBRL_EMPTY,
        ['companyProfit', 'companyRevenue'],
        AIWS_ERROR_MESSAGES.XBRL_EMPTY,
      );
      return null;
    }

    let xbrlXml: string;

    try {
      xbrlXml = Buffer.from(base64Xbrl, 'base64').toString('utf-8');
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XBRL_DECODE_ERROR,
        ['companyProfit', 'companyRevenue'],
        AIWS_ERROR_MESSAGES.XBRL_DECODE_ERROR,
      );
      return null;
    }

    const xbrlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseTagValue: false,
    });

    let xbrlJson: BilancioXbrlData;

    try {
      xbrlJson = xbrlParser.parse(xbrlXml) as BilancioXbrlData;
    } catch (err) {
      console.log(err);
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XML_PARSE_ERROR,
        ['companyProfit', 'companyRevenue'],
        AIWS_ERROR_MESSAGES.XML_PARSE_ERROR,
      );
      return null;
    }

    if (!xbrlJson?.xbrl) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.XBRL_MAPPING_ERROR,
        ['companyProfit', 'companyRevenue'],
        AIWS_ERROR_MESSAGES.XBRL_MAPPING_ERROR,
      );
      return null;
    }

    const xbrl = xbrlJson.xbrl;

    const contexts = this.mapContexts(xbrl);
    const factsByQName = this.mapAllFacts(xbrl);
    const factNameMap = this.mapFactNameMap(factsByQName);

    const balanceSheetByYear = this.mapBalanceSheetByYear(
      factsByQName,
      contexts,
      factNameMap,
    );
    const balanceSheetYears = this.sortYearsDesc(
      Object.keys(balanceSheetByYear),
    );
    const orderedBalanceSheetByYear = this.toOrderedBalanceSheetByYear(
      balanceSheetByYear,
      balanceSheetYears,
    );

    return {
      balanceSheetByYear: orderedBalanceSheetByYear,
    };
  }
}
