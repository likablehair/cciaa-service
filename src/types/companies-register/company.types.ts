import { AIWSError } from 'src/types/aiws-error.type';
import { DateTime } from 'luxon';

export type CompanySummary = {
  /* === Identità azienda === */
  companyName: string;
  companyFiscalCode: string;
  companyVatNumber: string;
  companyLegalFormCode: string;
  companyLegalFormDescription: string;

  /* === Camera di Commercio === */
  companyCciaaCode: string;
  companyCciaaDescription: string;
  companyReaNumber: number;

  /* === Stato === */
  companyStatusCode: string;
  companyStatusDescription: string;
  companyRegistryStatusCode: string;
  companyRegistryStatusDescription: string;
  companySourceCode: string;
  companySourceDescription: string;

  /* === Attività === */
  companyDeclaredActivity: string | null;
  companyAtecoCode: string;
  companyAtecoDescription: string;
  companyAtecoClassificationCode: number;
  companyAtecoClassificationDescription: string;

  /* === Sede === */
  companyProvinceCode: string;
  companyProvinceDescription: string;
  companyMunicipalityCode: string;
  companyMunicipalityDescription: string;
  companyToponymCode: string;
  companyToponymDescription: string;
  companyStreet: string;
  companyStreetNumber: string;
  companyPostalCode: number;

  /* === Contatti === */
  companyPec: string;

  /* === Dati economici (non presenti → null) === */
  companyProfit: number | null;
  companyRevenue: number | null;

  /* === Dati societari futuri === */
  companyIncorporationDate: DateTime | null;

  companyShares: CompanyShare[] | null;

  aiwsError: AIWSError | null;
};

export type CompanyBalanceSheetValues = {
  personalDataDesignation: string | null;
  personalDataHeadquarters: string | null;
  personalDataShareCapital: number | null;
  personalDataFullyPaidupShareCapital: boolean | null;
  personalDataCciaa: string | null;
  personalDataVatNumber: string | null;
  personalDataFiscalCode: string | null;
  personalDataReaNumber: string | null;
  personalDataLegalForm: string | null;
  personalDataMainActivityAteco: string | null;
  personalDataCompanyLiquidation: boolean | null;
  personalDataCompanySingleShareholder: boolean | null;
  personalDataCompanySubpostedToDirectionAndCoordination: boolean | null;
  personalDataGroupAffiliation: boolean | null;
  totalFixedAssetsIntangible: number | null;
  totalFixedAssetsTangible: number | null;
  totalFixedAssetsFinancial: number | null;
  totalFixedAssets: number | null;
  totalReceivables: number | null;
  totalCashLiquid: number | null;
  totalAssetsCurrent: number | null;
  totalAssets: number | null;
  equityNetCapital: number | null;
  equityNetLegalReserves: number | null;
  equityOtherReservesSeparatelyDisclosedTotalOtherReserves: number | null;
  equityNetIncomeLoss: number | null;
  totalEquity: number | null;
  employeeSeverancePay: number | null;
  totalPayables: number | null;
  liabilitiesAccrualsAndDeferredIncome: number | null;
  totalLiabilitiesAndEquity: number | null;
  totalReceivablesFromShareholdersForUnpaidCapital: number | null;
  receivablesDueWithinNextFiscalYear: number | null;
  payablesDueWithinNextFiscalYear: number | null;
  companyRevenue: number | null;
  productionValueOtherRevenuesAndIncomeOther: number | null;
  productionValueTotalOtherRevenuesAndIncome: number | null;
  totalProductionValue: number | null;
  productionCostsRawMaterialsSubsidiaryAndGoods: number | null;
  productionCostsServices: number | null;
  productionCostsLeaseAndRentalOfThirdPartyAssets: number | null;
  productionCostsPersonnelWagesAndSalaries: number | null;
  productionCostsPersonnelSocialCharges: number | null;
  productionCostsPersonnelSeverancePay: number | null;
  productionCostsPersonnelOtherCosts: number | null;
  productionCostsTotalPersonnelCosts: number | null;
  productionCostsDepreciationAmortizationIntangibleAssets: number | null;
  productionCostsDepreciationTangibleAssets: number | null;
  productionCostsTotalDepreciationAndWritedowns: number | null;
  productionCostsMiscellaneousOperatingExpenses: number | null;
  totalProductionCosts: number | null;
  differenceBetweenProductionValueAndCosts: number | null;
  financialIncomeExpenseInterestAndOtherFinancialChargesOther: number | null;
  financialIncomeExpenseTotalInterestAndOtherFinancialCharges: number | null;
  totalFinancialIncomeAndExpense: number | null;
  resultBeforeTaxes: number | null;
  incomeTaxCurrentDeferredAndPrepaidCurrentTaxes: number | null;
  totalIncomeTaxCurrentAndDeferred: number | null;
  companyProfit: number | null;
  productionCostsPersonnelSeverancePayPensionsAndOtherPersonnelCosts:
    | number
    | null;
  productionCostsDepreciationAmortizationIntangibleTangibleAndOtherAssetWritedowns:
    | number
    | null;
};

export type CompanyBalanceSheet = {
  balanceSheetByYear: Array<{
    year: number;
    values: CompanyBalanceSheetValues;
  }>;
};

export const balanceSheetValuesXMLText = {
  'itcc-ci:DatiAnagraficiDenominazione': 'personalDataDesignation',
  'itcc-ci:DatiAnagraficiSede': 'personalDataHeadquarters',
  'itcc-ci:DatiAnagraficiCapitaleSociale': 'personalDataShareCapital',
  'itcc-ci:DatiAnagraficiCapitaleSocialeInteramenteVersato':
    'personalDataFullyPaidupShareCapital',
  'itcc-ci:DatiAnagraficiCodiceCciaa': 'personalDataCciaa',
  'itcc-ci:DatiAnagraficiPartitaIva': 'personalDataVatNumber',
  'itcc-ci:DatiAnagraficiCodiceFiscale': 'personalDataFiscalCode',
  'itcc-ci:DatiAnagraficiNumeroRea': 'personalDataReaNumber',
  'itcc-ci:DatiAnagraficiFormaGiuridica': 'personalDataLegalForm',
  'itcc-ci:DatiAnagraficiSettoreAttivitaPrevalenteAteco':
    'personalDataMainActivityAteco',
  'itcc-ci:DatiAnagraficiSocietaLiquidazione': 'personalDataCompanyLiquidation',
  'itcc-ci:DatiAnagraficiSocietaSocioUnico':
    'personalDataCompanySingleShareholder',
  'itcc-ci:DatiAnagraficiSocietaSottopostaAltruiAttivitaDirezioneCoordinamento':
    'personalDataCompanySubpostedToDirectionAndCoordination',
  'itcc-ci:DatiAnagraficiAppartenenzaGruppo': 'personalDataGroupAffiliation',
  'itcc-ci:TotaleImmobilizzazioniImmateriali': 'totalFixedAssetsIntangible',
  'itcc-ci:TotaleImmobilizzazioniMateriali': 'totalFixedAssetsTangible',
  'itcc-ci:TotaleImmobilizzazioniFinanziarie': 'totalFixedAssetsFinancial',
  'itcc-ci:TotaleImmobilizzazioni': 'totalFixedAssets',
  'itcc-ci:TotaleCrediti': 'totalReceivables',
  'itcc-ci:TotaleDisponibilitaLiquide': 'totalCashLiquid',
  'itcc-ci:TotaleAttivoCircolante': 'totalAssetsCurrent',
  'itcc-ci:TotaleAttivo': 'totalAssets',
  'itcc-ci:PatrimonioNettoCapitale': 'equityNetCapital',
  'itcc-ci:PatrimonioNettoRiservaLegale': 'equityNetLegalReserves',
  'itcc-ci:PatrimonioNettoAltreRiserveDistintamenteIndicateTotaleAltreRiserve':
    'equityOtherReservesSeparatelyDisclosedTotalOtherReserves',
  'itcc-ci:PatrimonioNettoUtilePerditaEsercizio': 'equityNetIncomeLoss',
  'itcc-ci:TotalePatrimonioNetto': 'totalEquity',
  'itcc-ci:TrattamentoFineRapportoLavoroSubordinato': 'employeeSeverancePay',
  'itcc-ci:TotaleDebiti': 'totalPayables',
  'itcc-ci:PassivoRateiRisconti': 'liabilitiesAccrualsAndDeferredIncome',
  'itcc-ci:TotalePassivo': 'totalLiabilitiesAndEquity',
  'itcc-ci:TotaleCreditiVersoSociVersamentiAncoraDovuti':
    'totalReceivablesFromShareholdersForUnpaidCapital',
  'itcc-ci:CreditiEsigibiliEntroEsercizioSuccessivo':
    'receivablesDueWithinNextFiscalYear',
  'itcc-ci:DebitiEsigibiliEntroEsercizioSuccessivo':
    'payablesDueWithinNextFiscalYear',
  'itcc-ci:ValoreProduzioneRicaviVenditePrestazioni': 'companyRevenue',
  'itcc-ci:ValoreProduzioneAltriRicaviProventiAltri':
    'productionValueOtherRevenuesAndIncomeOther',
  'itcc-ci:ValoreProduzioneAltriRicaviProventiTotaleAltriRicaviProventi':
    'productionValueTotalOtherRevenuesAndIncome',
  'itcc-ci:TotaleValoreProduzione': 'totalProductionValue',
  'itcc-ci:CostiProduzioneMateriePrimeSussidiarieConsumoMerci':
    'productionCostsRawMaterialsSubsidiaryAndGoods',
  'itcc-ci:CostiProduzioneServizi': 'productionCostsServices',
  'itcc-ci:CostiProduzioneGodimentoBeniTerzi':
    'productionCostsLeaseAndRentalOfThirdPartyAssets',
  'itcc-ci:CostiProduzionePersonaleSalariStipendi':
    'productionCostsPersonnelWagesAndSalaries',
  'itcc-ci:CostiProduzionePersonaleOneriSociali':
    'productionCostsPersonnelSocialCharges',
  'itcc-ci:CostiProduzionePersonaleTrattamentoFineRapporto':
    'productionCostsPersonnelSeverancePay',
  'itcc-ci:CostiProduzionePersonaleAltriCosti':
    'productionCostsPersonnelOtherCosts',
  'itcc-ci:CostiProduzionePersonaleTotaleCostiPersonale':
    'productionCostsTotalPersonnelCosts',
  'itcc-ci:CostiProduzioneAmmortamentiSvalutazioniAmmortamentoImmobilizzazioniImmateriali':
    'productionCostsDepreciationAmortizationIntangibleAssets',
  'itcc-ci:CostiProduzioneAmmortamentiSvalutazioniAmmortamentoImmobilizzazioniMateriali':
    'productionCostsDepreciationTangibleAssets',
  'itcc-ci:CostiProduzioneAmmortamentiSvalutazioniTotaleAmmortamentiSvalutazioni':
    'productionCostsTotalDepreciationAndWritedowns',
  'itcc-ci:CostiProduzioneOneriDiversiGestione':
    'productionCostsMiscellaneousOperatingExpenses',
  'itcc-ci:TotaleCostiProduzione': 'totalProductionCosts',
  'itcc-ci:DifferenzaValoreCostiProduzione':
    'differenceBetweenProductionValueAndCosts',
  'itcc-ci:ProventiOneriFinanziariInteressiAltriOneriFinanziariAltri':
    'financialIncomeExpenseInterestAndOtherFinancialChargesOther',
  'itcc-ci:ProventiOneriFinanziariInteressiAltriOneriFinanziariTotaleInteressiAltriOneriFinanziari':
    'financialIncomeExpenseTotalInterestAndOtherFinancialCharges',
  'itcc-ci:TotaleProventiOneriFinanziari': 'totalFinancialIncomeAndExpense',
  'itcc-ci:RisultatoPrimaImposte': 'resultBeforeTaxes',
  'itcc-ci:ImposteRedditoEsercizioCorrentiDifferiteAnticipateImposteCorrenti':
    'incomeTaxCurrentDeferredAndPrepaidCurrentTaxes',
  'itcc-ci:ImposteRedditoEsercizioCorrentiDifferiteAnticipateTotaleImposteRedditoEsercizioCorrentiDifferiteAnticipate':
    'totalIncomeTaxCurrentAndDeferred',
  'itcc-ci:UtilePerditaEsercizio': 'companyProfit',
  'itcc-ci:CostiProduzionePersonaleTrattamentoFineRapportoTrattamentoQuiescenzaAltriCostiPersonale':
    'productionCostsPersonnelSeverancePayPensionsAndOtherPersonnelCosts',
  'itcc-ci:CostiProduzioneAmmortamentiSvalutazioniAmmortamentoImmobilizzazioniImmaterialiMaterialiAltreSvalutazioniImmobilizzazioni':
    'productionCostsDepreciationAmortizationIntangibleTangibleAndOtherAssetWritedowns',
} as const;

export type BalanceSheetContextInfo = {
  entityIdentifier: string | null;
  entityIdentifierScheme: string | null;
  instant: string | null;
  startDate: string | null;
  endDate: string | null;
  scenario: string | null;
};

export type BalanceSheetFactValue = {
  contextRef: string | null;
  unitRef: string | null;
  decimals: string | null;
  valueRaw: string | null;
  valueNumber: number | null;
};

export type CompanyShareType = 'person' | 'company' | 'other';

export interface CompanyShare {
  type: CompanyShareType;
  fiscalCode: string;
  firstName: string;
  lastName?: string;
  shareValue: number;
  sharePercentage: number;
  isRepresentative: boolean;
  address?: {
    street: string;
    number: string;
    city: string;
    province: string;
    cap: string;
  };
}
