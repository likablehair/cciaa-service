export interface AIWSConfig {
  username: string;
  password: string;
  environment: string | 'production' | 'sandbox';
}

export interface RicercaImpresaMetadata {
  RichiestaInput: string;
  FormatoDocumentoAllegato: string;
  NumeroPosizioni: number;
  IdRichiesta: string;
  DtEstrazione: string; // ISO date (YYYY-MM-DD)
  OraEstrazione: string; // HH:mm:ss
}
// Struttura generica per la risposta XML parsata
export interface ParsedAIWSResponse {
  Risposta: {
    Testata: {
      Riepilogo: RicercaImpresaMetadata;
      RecordAccount: string;
      Messaggio?: {
        CodiceErrore: string;
        DescrizioneErrore: string;
        GravitaErrore: string;
      };
    };
    ListaImpreseRI: ImpresaResponse;
  };
}

export interface ImpresaResponse {
  Impresa: {
    ProgressivoImpresa: number;
    AnagraficaImpresa: AnagraficaImpresa;
  };
}

export interface AnagraficaImpresa {
  Cciaa: string;
  DescCciaa: string;
  NRea: number;
  Denominazione: string;
  SglPrvSede: string;
  DescPrvSede: string;
  CodFisc: string;
  PIva: string;
  NatGiu: string;
  DescNatGiu: string;
  Fonte: string;
  DescFonte: string;
  StatoAttivita: string;
  DescStatoAttivita: string;
  StatoAttivitaReg: string;
  DescStatoAttivitaReg: string;
  AttivitaDichiarata: string;
  ClassificazioneAteco: ClassificazioneAteco;
  IndirizzoSede: IndirizzoSede;
  IndirizzoPostaCertificata: string;
}

export interface ClassificazioneAteco {
  CodCodifica: number;
  DescCodifica: string;
  CodAttivita: string;
  DescAttivita: string;
}

export interface IndirizzoSede {
  SglPrvSede: string;
  DescPrvSede: string;
  CodComSede: string;
  DescComSede: string;
  CodToponSede: string;
  DescToponSede: string;
  ViaSede: string;
  NCivicoSede: number;
  CapSede: number;
}


export type CompanySummary = {
  /* === Identità azienda === */
  companyName: string
  companyFiscalCode: string
  companyVatNumber: string
  companyLegalFormCode: string
  companyLegalFormDescription: string

  /* === Camera di Commercio === */
  companyCciaaCode: string
  companyCciaaDescription: string
  companyReaNumber: number

  /* === Stato === */
  companyStatusCode: string
  companyStatusDescription: string
  companyRegistryStatusCode: string
  companyRegistryStatusDescription: string
  companySourceCode: string
  companySourceDescription: string

  /* === Attività === */
  companyDeclaredActivity: string
  companyAtecoCode: string
  companyAtecoDescription: string
  companyAtecoClassificationCode: number
  companyAtecoClassificationDescription: string

  /* === Sede === */
  companyProvinceCode: string
  companyProvinceDescription: string
  companyMunicipalityCode: string
  companyMunicipalityDescription: string
  companyToponymCode: string
  companyToponymDescription: string
  companyStreet: string
  companyStreetNumber: string
  companyPostalCode: number

  /* === Contatti === */
  companyPec: string

  /* === Dati economici (non presenti → null) === */
  companyShares: number | null
  companyProfit: number | null
  companyRevenue: number | null

  /* === Dati societari futuri === */
  companyIncorporationDate: string | null
}