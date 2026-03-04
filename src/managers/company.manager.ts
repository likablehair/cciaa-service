import { XMLParser } from 'fast-xml-parser';
import { AnagraficaImpresa } from 'src/types/aiws.types';
import { CompanySummary, CompanyFinancials as FinancialValue } from 'src/types/company.types';

export class CompnayManager {

  
  public async mapAnagraficaImpresaToCompanySummary(
    impresa: AnagraficaImpresa,
  ): Promise<CompanySummary> {


    return await {
      /* === Identità === */
      companyName: impresa.Denominazione,
      companyFiscalCode: impresa.CodFisc,
      companyVatNumber: impresa.PIva,
      companyLegalFormCode: impresa.NatGiu,
      companyLegalFormDescription: impresa.DescNatGiu,
  
      /* === CCIAA === */
      companyCciaaCode: impresa.Cciaa,
      companyCciaaDescription: impresa.DescCciaa,
      companyReaNumber: impresa.NRea,
  
      /* === Stato === */
      companyStatusCode: impresa.StatoAttivita,
      companyStatusDescription: impresa.DescStatoAttivita,
      companyRegistryStatusCode: impresa.StatoAttivitaReg,
      companyRegistryStatusDescription: impresa.DescStatoAttivitaReg,
      companySourceCode: impresa.Fonte,
      companySourceDescription: impresa.DescFonte,
  
      /* === Attività === */
      companyDeclaredActivity: impresa.AttivitaDichiarata,
      companyAtecoCode: impresa.ClassificazioneAteco.CodAttivita,
      companyAtecoDescription: impresa.ClassificazioneAteco.DescAttivita,
      companyAtecoClassificationCode: impresa.ClassificazioneAteco.CodCodifica,
      companyAtecoClassificationDescription:
        impresa.ClassificazioneAteco.DescCodifica,
  
      /* === Sede === */
      companyProvinceCode: impresa.IndirizzoSede.SglPrvSede,
      companyProvinceDescription: impresa.IndirizzoSede.DescPrvSede,
      companyMunicipalityCode: impresa.IndirizzoSede.CodComSede,
      companyMunicipalityDescription: impresa.IndirizzoSede.DescComSede,
      companyToponymCode: impresa.IndirizzoSede.CodToponSede,
      companyToponymDescription: impresa.IndirizzoSede.DescToponSede,
      companyStreet: impresa.IndirizzoSede.ViaSede,
      companyStreetNumber: String(impresa.IndirizzoSede.NCivicoSede),
      companyPostalCode: impresa.IndirizzoSede.CapSede,
  
      /* === Contatti === */
      companyPec: impresa.IndirizzoPostaCertificata,
  
      /* === Economici === */
      companyProfit:  null,
      companyRevenue: null,
  
      /* === Societari === */
      companyIncorporationDate: null,
      companyShares: null,

      /* === AIWSError === */
      aiwsError: []
    };
  }
}
