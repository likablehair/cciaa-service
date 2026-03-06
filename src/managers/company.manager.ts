import { AnagraficaImpresa } from 'src/types/aiws.types';
import { CompanySummary } from 'src/types/company.types';
import { AIWSError, AIWS_ERROR_CODE, pushAIWSError } from 'src/types/aiwsError.type';

export class CompnayManager {
  public async mapAnagraficaImpresaToCompanySummary(
    impresa: AnagraficaImpresa,
    errors: AIWSError = [],
  ): Promise<CompanySummary> {
    if (!impresa) {
      pushAIWSError(errors, AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED, { impresa }, AIWS_ERROR_CODE['COMPANY_SUMMARY_FETCH_FAILED']);
      return {
        companyName: '',
        companyFiscalCode: '',
        companyVatNumber: '',
        companyLegalFormCode: '',
        companyLegalFormDescription: '',
        companyCciaaCode: '',
        companyCciaaDescription: '',
        companyReaNumber: 0,
        companyStatusCode: '',
        companyStatusDescription: '',
        companyRegistryStatusCode: '',
        companyRegistryStatusDescription: '',
        companySourceCode: '',
        companySourceDescription: '',
        companyDeclaredActivity: '',
        companyAtecoCode: '',
        companyAtecoDescription: '',
        companyAtecoClassificationCode: 0,
        companyAtecoClassificationDescription: '',
        companyProvinceCode: '',
        companyProvinceDescription: '',
        companyMunicipalityCode: '',
        companyMunicipalityDescription: '',
        companyToponymCode: '',
        companyToponymDescription: '',
        companyStreet: '',
        companyStreetNumber: '',
        companyPostalCode: 0,
        companyPec: '',
        companyProfit: null,
        companyRevenue: null,
        companyIncorporationDate: null,
        companyShares: null,
        aiwsError: errors,
      };
    }

    // Validate required fields
    if (!impresa.Denominazione) {
      pushAIWSError(errors, AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED, { field: 'Denominazione' }, AIWS_ERROR_CODE['COMPANY_SUMMARY_FETCH_FAILED']);
    }
    if (!impresa.PIva) {
      pushAIWSError(errors, AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED, { field: 'PIva' }, AIWS_ERROR_CODE['COMPANY_SUMMARY_FETCH_FAILED']);
    }
    if (!impresa.Cciaa) {
      pushAIWSError(errors, AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED, { field: 'Cciaa' }, AIWS_ERROR_CODE['COMPANY_SUMMARY_FETCH_FAILED']);
    }

    return {
      /* === Identità === */
      companyName: impresa.Denominazione || '',
      companyFiscalCode: impresa.CodFisc || '',
      companyVatNumber: impresa.PIva || '',
      companyLegalFormCode: impresa.NatGiu || '',
      companyLegalFormDescription: impresa.DescNatGiu || '',

      /* === CCIAA === */
      companyCciaaCode: impresa.Cciaa || '',
      companyCciaaDescription: impresa.DescCciaa || '',
      companyReaNumber: impresa.NRea || 0,

      /* === Stato === */
      companyStatusCode: impresa.StatoAttivita || '',
      companyStatusDescription: impresa.DescStatoAttivita || '',
      companyRegistryStatusCode: impresa.StatoAttivitaReg || '',
      companyRegistryStatusDescription: impresa.DescStatoAttivitaReg || '',
      companySourceCode: impresa.Fonte || '',
      companySourceDescription: impresa.DescFonte || '',

      /* === Attività === */
      companyDeclaredActivity: impresa.AttivitaDichiarata || '',
      companyAtecoCode: impresa.ClassificazioneAteco?.CodAttivita || '',
      companyAtecoDescription: impresa.ClassificazioneAteco?.DescAttivita || '',
      companyAtecoClassificationCode: impresa.ClassificazioneAteco?.CodCodifica || 0,
      companyAtecoClassificationDescription: impresa.ClassificazioneAteco?.DescCodifica || '',

      /* === Sede === */
      companyProvinceCode: impresa.IndirizzoSede?.SglPrvSede || '',
      companyProvinceDescription: impresa.IndirizzoSede?.DescPrvSede || '',
      companyMunicipalityCode: impresa.IndirizzoSede?.CodComSede || '',
      companyMunicipalityDescription: impresa.IndirizzoSede?.DescComSede || '',
      companyToponymCode: impresa.IndirizzoSede?.CodToponSede || '',
      companyToponymDescription: impresa.IndirizzoSede?.DescToponSede || '',
      companyStreet: impresa.IndirizzoSede?.ViaSede || '',
      companyStreetNumber: String(impresa.IndirizzoSede?.NCivicoSede || ''),
      companyPostalCode: impresa.IndirizzoSede?.CapSede || 0,

      /* === Contatti === */
      companyPec: impresa.IndirizzoPostaCertificata || '',

      /* === Economici === */
      companyProfit: null,
      companyRevenue: null,

      /* === Societari === */
      companyIncorporationDate: null,
      companyShares: null,

      /* === AIWSError === */
      aiwsError: errors,
    };
  }
}