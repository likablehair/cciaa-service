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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ParsedAIWSResponse<DataType = any> {
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
    ListaImpreseRI?: ImpresaResponse;
    ListaAnagrafiche?: ListaAnagraficheResponse;
    VisuraEffetto?: VisuraEffettoResponse;
    dati?: DataType;
  };
}

export interface ListaAnagraficheResponse {
  AnagraficaNominativo: AnagraficaNominativo | AnagraficaNominativo[];
}

export interface AnagraficaNominativo {
  ProgressivoAnagrafica?: number;
  KAnagrafica: string;
  Fonte: string;
  Nominativo: string;
  CodFisc: string;
  SglPrvRes: string;
  DescPrvRes: string;
  CodComRes: string;
  DescComRes: string;
  IndirizzoRes: string;
}

export interface VisuraEffettoResponse {
  AnagraficaNominativo: AnagraficaNominativo;
  RegistroProtesti: RegistroProtesti | RegistroProtesti[];
}

export interface RegistroProtesti {
  DatiRegistroProtesti: DatiRegistroProtesti;
  InformazioniEffetto: InformazioniEffetto;
}

export interface DatiRegistroProtesti {
  CciaaPubblicazione: string;
  DtIscrRegistro: string;
}

export interface InformazioniEffetto {
  DtLevata: string;
  SglPrvLevata: string;
  DescPrvLevata: string;
  CodComLevata: string;
  DescComLevata: string;
  DtEmissioneEffetto: string;
  DtScadenzaEffetto: string;
  CodTipoEffetto: string;
  DescTipoEffetto: string;
  ImportoValutaLevata: number;
  CodValutaLevata: string;
  DescValutaLevata: string;
  CodMancatoPagRepr: string;
  DescMancatoPagRepr: string;
  CodStatoEffetto: string;
  DescStatoEffetto: string;
  NRepertorio: number;
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

export interface Riconoscimento {
  IdentificativoPosizione: string | number;
  OutputRestituiti: string;
}

export interface PersonaData {
  Riconoscimento: Riconoscimento;
  'blocchi-persona': BlocchiPersona;
}

export interface BlocchiPersona {
  'imprese-persona': {
    'impresa-persona': ImpresaPersona | ImpresaPersona[];
  };
  'info-blocco-attuale'?: {
    'n-imprese': string;
  };
  'dati-identificativi-persona'?: DatiIdentificativiPersona;
}

export interface ImpresaPersona {
  'chiave-impresa': string;
  'dati-identificativi-impresa': DatiIdentificativiImpresa;
  'info-attivita'?: InfoAttivitaImpresa;
  persona?: PersonaImpresa;
}

export interface DatiIdentificativiImpresa {
  'c-fonte'?: string;
  fonte?: string;
  denominazione: string;
  'c-fiscale': string;
  cciaa: string;
  'n-rea': string;
  'forma-giuridica'?: FormaGiuridica;
  'indirizzo-localizzazione'?: IndirizzoXml;
  'indirizzo-posta-certificata'?: string;
}

export interface FormaGiuridica {
  c: string;
  '#text'?: string;
}

export interface InfoAttivitaImpresa {
  'dt-inizio-attivita-impresa'?: string;
  'classificazioni-ateco'?: ClassificazioniAteco;
}

export interface ClassificazioniAteco {
  'c-codifica': string;
  codifica: string;
  'classificazione-ateco': ClassificazioneAteco | ClassificazioneAteco[];
}

export interface ClassificazioneAteco {
  'c-attivita': string;
  attivita: string;
}

export interface PersonaImpresa {
  'indirizzo-posta-certificata'?: string;
  indirizzo?: IndirizzoXml;
  cariche?: {
    carica: CaricaPersona | CaricaPersona[];
  };
}

export interface CaricaPersona {
  'p-carica'?: string;
  'c-carica'?: string;
  'dt-atto-nomina'?: string;
  'c-durata'?: string;
  'descrizione-durata'?: string;
  'dt-riferimento-bilancio'?: string;
  '#text'?: string;
}

export interface DatiIdentificativiPersona {
  cognome: string;
  nome: string;
  sesso: string;
  'c-fiscale': string;
  'estremi-nascita'?: EstremiNascita;
  indirizzo?: IndirizzoXml;
  'estremi-impresa-dati-persona'?:
    | EstremiImpresaDatiPersona
    | EstremiImpresaDatiPersona[];
}

export interface EstremiNascita {
  dt: string;
  comune: string;
  provincia: string;
}

export interface EstremiImpresaDatiPersona {
  cciaa: string;
  'n-rea': string;
  denominazione: string;
}

export interface IndirizzoXml {
  'c-comune'?: string;
  comune: string;
  provincia: string;
  'c-toponimo'?: string;
  toponimo: string;
  via: string;
  'n-civico': string;
  cap: string;
}

type ParsedAIWSResponseBase = ParsedAIWSResponse<never>;
type ParsedAIWSResponseBaseRisposta = ParsedAIWSResponseBase['Risposta'];

export type ParsedListaAnagraficheResponse = Omit<
  ParsedAIWSResponseBase,
  'Risposta'
> & {
  Risposta: Omit<
    ParsedAIWSResponseBaseRisposta,
    'dati' | 'VisuraEffetto' | 'ListaAnagrafiche' | 'ListaImpreseRI'
  > & {
    ListaAnagrafiche: ListaAnagraficheResponse;
  };
};

export type ParsedVisuraEffettoResponse = Omit<
  ParsedAIWSResponseBase,
  'Risposta'
> & {
  Risposta: Omit<
    ParsedAIWSResponseBaseRisposta,
    'dati' | 'ListaAnagrafiche' | 'VisuraEffetto' | 'ListaImpreseRI'
  > & {
    VisuraEffetto: VisuraEffettoResponse;
  };
};
