/* ==============================
 * Shared config and XML helpers
 * ============================== */

import { DatiIdentificativi } from './companies-register/share.type';

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
  DtEstrazione: string;
  OraEstrazione: string;
}

export type XmlOneOrMany<T> = T | T[];

export interface XmlTextValue {
  '#text'?: string;
}

// Generic parsed XML envelope.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ParsedAIWSResponse<DataType = any> {
  Risposta: {
    Testata: {
      Riepilogo: RicercaImpresaMetadata;
      RecordAccount: XmlOneOrMany<string>;
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

/* ==============================
 * Protesti register
 * ============================== */

export interface ListaAnagraficheResponse {
  AnagraficaNominativo: XmlOneOrMany<AnagraficaNominativo>;
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
  RegistroProtesti: XmlOneOrMany<RegistroProtesti>;
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

/* ==============================
 * Companies register - ricerca impresa
 * ============================== */

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
  ClassificazioneAteco: ClassificazioneAtecoRicerca;
  IndirizzoSede: IndirizzoSede;
  IndirizzoPostaCertificata: string;
}

export interface ClassificazioneAtecoRicerca {
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

/* ==============================
 * Shared XML fragments (registro imprese)
 * ============================== */

export interface Riconoscimento {
  IdentificativoPosizione: string | number;
  OutputRestituiti: string;
}

export interface FormaGiuridica extends XmlTextValue {
  c: string;
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

/* ==============================
 * Companies register - persona
 * ============================== */

export interface PersonaData {
  Riconoscimento: Riconoscimento;
  'blocchi-persona': BlocchiPersona;
}

export interface BlocchiPersona {
  'imprese-persona': {
    'impresa-persona': XmlOneOrMany<ImpresaPersona>;
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

export interface InfoAttivitaImpresa {
  'dt-inizio-attivita-impresa'?: string;
  'classificazioni-ateco'?: ClassificazioniAteco;
}

export interface ClassificazioneAtecoXml {
  'c-attivita': string;
  attivita: string;
}

export interface PersonaImpresa {
  'indirizzo-posta-certificata'?: string;
  indirizzo?: IndirizzoXml;
  cariche?: {
    carica: XmlOneOrMany<CaricaPersona>;
  };
}

export interface CaricaPersona extends XmlTextValue {
  'p-carica'?: string;
  'c-carica'?: string;
  'dt-atto-nomina'?: string;
  'c-durata'?: string;
  'descrizione-durata'?: string;
  'dt-riferimento-bilancio'?: string;
}

export interface DatiIdentificativiPersona {
  cognome: string;
  nome: string;
  sesso: string;
  'c-fiscale': string;
  'estremi-nascita'?: EstremiNascita;
  indirizzo?: IndirizzoXml;
  'estremi-impresa-dati-persona'?: XmlOneOrMany<EstremiImpresaDatiPersona>;
}

export interface EstremiImpresaDatiPersona {
  cciaa: string;
  'n-rea': string;
  denominazione: string;
}

/* ==============================
 * Companies register - ownership structure
 * ============================== */

export interface PartecipazioniData {
  Riconoscimento: Riconoscimento;
  'blocchi-persona': BlocchiPersonaPartecipazioni;
}

export interface BlocchiPersonaPartecipazioni {
  'anagrafica-persona'?: {
    'dati-identificativi-persona': DatiIdentificativiPersona;
  };
  'dati-identificativi'?: DatiIdentificativiPartecipazioni;
  'partecipazioni-societa': PartecipazioniSocieta;
  'tabella-partecipate-impresa'?: XmlOneOrMany<TabellaPartecipateImpresa>;
  'info-blocco-attuale'?: InfoBloccoAttualePartecipazioni;
}

export interface DatiIdentificativiPartecipazioni {
  'c-fonte': string;
  fonte: string;
  'tipo-soggetto': string;
  'descrizione-tipo-soggetto': string;
  'tipo-impresa': string;
  'descrizione-tipo-impresa': string;
  'dt-iscrizione-ri': string;
  'dt-atto-costituzione': string;
  'dt-ultimo-protocollo': string;
  denominazione: string;
  'c-fiscale': string;
  'partita-iva': string;
  cciaa: string;
  'n-rea': string;
  'forma-giuridica': FormaGiuridica;
  'indirizzo-localizzazione': IndirizzoXml;
  'indirizzo-posta-certificata'?: string;
  'persone-rappresentanti'?: PersoneRappresentanti;
}

export interface PersoneRappresentanti {
  'persona-rappresentante': XmlOneOrMany<PersonaRappresentante>;
}

export interface PersonaRappresentante {
  cognome: string;
  nome: string;
  carica: string;
  'f-rappresentante-ri': string;
}

export interface PartecipazioniSocieta {
  'anagrafica-titolare': AnagraficaTitolare;
  partecipazioni: {
    partecipazione: XmlOneOrMany<PartecipazioneSocieta>;
  };
  trasferimenti?: Trasferimenti;
}
export interface PartecipazioneSocieta {
  'f-paragrafo-attuale': string;
  'estremi-pratica': EstremiPraticaPartecipazione;
  'f-ultimo-elenco-soci'?: string;
  'estremi-impresa': EstremiImpresaPartecipata;
  'capitale-sociale': CapitaleSocialePartecipazione;
  riquadri: RiquadriPartecipazione;
}

export interface EstremiPraticaPartecipazione {
  'c-pratica': string;
  'c-tipo-adempimento': string;
  'tipo-adempimento': string;
  'dt-atto'?: string;
  cciaa: string;
  anno: string;
  n: string;
  'dt-protocollo': string;
  'dt-deposito': string;
}

export interface EstremiImpresaPartecipata {
  'c-fiscale': string;
  denominazione: string;
  'forma-giuridica': FormaGiuridica;
}

export interface CapitaleSocialePartecipazione {
  'c-valuta': string;
  valuta: string;
  ammontare: string;
}

export interface RiquadriPartecipazione {
  riquadro: XmlOneOrMany<RiquadroPartecipazione>;
}

export interface RiquadroPartecipazione {
  'composizione-quote': ComposizioneQuotePartecipazione;
  'diritti-partecipazione'?: DirittiPartecipazione;
}

export interface ComposizioneQuotePartecipazione {
  'c-valuta': string;
  valuta: string;
  'valore-nominale': string;
}

export interface DirittiPartecipazione {
  'diritto-partecipazione': XmlOneOrMany<DirittoPartecipazione>;
}

export interface TabellaPartecipateImpresa {
  'c-tipo-partecipate': string;
  'tipo-partecipate': string;
  partecipata: XmlOneOrMany<PartecipataImpresa>;
}

export interface PartecipataImpresa {
  'c-fiscale': string;
  denominazione: string;
  'dt-inizio-partecipazione': string;
  'quote-diritti-impresa': QuoteDirittiImpresa;
}

export interface QuoteDirittiImpresa {
  'quota-diritto-impresa': XmlOneOrMany<QuotaDirittoImpresa>;
}

export interface QuotaDirittoImpresa {
  'c-tipo-diritto': string;
  'tipo-diritto': string;
  'valore-nominale': string;
  'percentuale-capitale': string;
}

export interface InfoBloccoAttualePartecipazioni {
  'n-partecipazioni': string;
}

/* ==============================
 * Companies register - blocchi impresa (schema-derived core)
 * ============================== */

export interface BlocchiImpresaData {
  Riconoscimento: Riconoscimento;
  'blocchi-impresa': BlocchiImpresa;
}

export interface CodiceDescrizione extends XmlTextValue {
  c: string;
}

export interface DatiIdentificativiBlocchiImpresa {
  'f-sede-intercamerale'?: string;
  'c-fonte': string;
  fonte: string;
  'tipo-soggetto': string;
  'descrizione-tipo-soggetto': string;
  'tipo-impresa': string;
  'descrizione-tipo-impresa': string;
  'dt-iscrizione-ri': string;
  'dt-atto-costituzione': string;
  'dt-ultimo-protocollo': string;
  'dt-mod-ultimo-protocollo-evaso'?: string;
  denominazione: string;
  'c-fiscale': string;
  'partita-iva': string;
  'c-cciaa-competente'?: string;
  'cciaa-competente'?: string;
  cciaa: string;
  'n-rea': string;
  'stato-attivita'?: CodiceDescrizione;
  'forma-giuridica'?: FormaGiuridica;
  'indirizzo-localizzazione'?: IndirizzoXml;
  'indirizzo-posta-certificata'?: string;
  'persone-rappresentanti'?: PersoneRappresentanti;
}

export interface ClassificazioneAtecoSintesi {
  'c-attivita'?: string;
  attivita?: string;
  'c-importanza'?: string;
  importanza?: string;
  'c-nace'?: string;
  'dt-inizio'?: string;
  'dt-riferimento'?: string;
  'c-fonte'?: string;
  fonte?: string;
}

export interface SintesiCifreImpresa {
  'pratiche-anno'?: PraticheAnno;
  'capitale-investito'?: CapitaleInvestito;
  'fondo-consortile'?: FondoConsortile;
  'valore-nominale-conferimenti'?: ValoreNominaleConferimenti;
  'capitale-sociale'?: CapitaleSociale;
  'dati-bilancio'?: DatiBilancio;
  'n-localizzazioni'?: string;
  'n-amministratori'?: string;
  'n-sindaci'?: string;
  'n-titolari-cariche'?: string;
  'n-soci'?: string;
  'n-addetti'?: string;
  'dt-addetti'?: string;
  'n-trasferimenti-sede'?: string;
  'n-trasferimenti-quote'?: string;
  'f-partecipazioni'?: string;
  'f-partecipazioni-sto'?: string;
  'f-controllata'?: string;
  'n-protocolli-aperti'?: string;
}

export interface PraticheAnno {
  'dt-inizio'?: string;
  n?: string;
}

export interface CapitaleInvestito {
  'c-valuta'?: string;
  valuta?: string;
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface CapitaleSociale {
  deliberato?: Deliberato;
  sottoscritto?: Sottoscritto;
  versato?: Versato;
  'tipo-conferimenti'?: TipoConferimenti;
  'c-valuta'?: string;
  valuta?: string;
  ammontare?: string;
  'n-azioni'?: string;
  'n-quote'?: string;
}

export interface Deliberato {
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface Sottoscritto {
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface Versato {
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface TipoConferimenti {
  '#text'?: string;
  c?: string;
}

export interface InfoSedeImpresa {
  'indirizzo-posta-certificata'?: string;
  'dati-iscrizione-rea-rd'?: {
    'n-rea'?: string;
  };
  'partita-iva'?: string;
  'provenienza-trasferimento'?: {
    cciaa?: string;
    'n-rea'?: string;
  };
}

export interface EstremiAttoCostituzione {
  'c-tipo'?: string;
  tipo?: string;
  'n-repertorio'?: string;
  notaio?: string;
  'localita-notaio'?: string;
  'provincia-notaio'?: string;
}

export interface InfoAttivitaBlocchiImpresa {
  'dt-inizio-attivita-impresa'?: string;
  'attivita-esercitata'?: string;
  'attivita-secondaria-esercitata'?: string;
  'classificazioni-ateco'?: ClassificazioniAtecoDettaglio;
  certificazioni?: Certificazioni;
  'addetti-impresa'?: XmlOneOrMany<AddettiImpresa>;
  'addetti-comuni'?: AddettiComuni;
}

export interface ClassificazioniAtecoDettaglio {
  'c-codifica'?: string;
  codifica?: string;
  'classificazione-ateco'?: XmlOneOrMany<ClassificazioneAtecoDettaglio>;
}

export interface ClassificazioneAtecoDettaglio {
  'c-attivita'?: string;
  attivita?: string;
  'c-importanza'?: string;
  importanza?: string;
  'c-fonte'?: string;
  fonte?: string;
}
export interface Certificazione {
  'c-schema-accreditamento'?: string;
  'schema-accreditamento'?: string;
  'norma-riferimento'?: string;
  'n-certificato'?: string;
  'dt-emissione'?: string;
  'dt-scadenza'?: string;
  'denominazione-odc'?: string;
  'c-fiscale-odc'?: string;
}

export interface AddettiImpresa {
  'c-tipo-informazione'?: string;
  'tipo-informazione'?: string;
  anno?: string;
  'dt-dichiarazione'?: string;
  'dt-rilevazione'?: string;
  'info-mesi'?: InfoMesi;
  'distribuzione-dipendenti'?: DistribuzioneDipendenti;
}
export interface InfoMese {
  'c-mese'?: string;
  'n-dipendenti'?: string;
  'n-indipendenti'?: string;
  'n-totale'?: string;
}
export interface AddettiComuni {
  'addetti-comune'?: AddettiComune;
}

export interface AddettiComune {
  'c-comune'?: string;
  comune?: string;
  provincia?: string;
  'pro-localizzazioni'?: {
    'pro-localizzazione'?: XmlOneOrMany<string>;
  };
  'info-mesi'?: InfoMesi;
  'valori-medi'?: {
    'valore-medio-dipendenti'?: string;
    'valore-medio-indipendenti'?: string;
    'valore-medio-totale'?: string;
  };
}
export interface DichiarazioneAmbientale {
  'c-tipo'?: string;
  tipo?: string;
  'c-fonte'?: string;
  fonte?: string;
  'provincia-sezione'?: string;
  n?: string;
  [key: string]: unknown;
}

export interface PersoneSede {
  persona: XmlOneOrMany<PersonaSede>;
}

export interface PersonaSede {
  progressivo?: string;
  'f-rappresentante-ri'?: string;
  'f-amministratore'?: string;
  'f-sindaco'?: string;
  'persona-fisica'?: PersonaFisicaSede;
  'persona-giuridica'?: PersonaGiuridicaSede;
  'indirizzo-posta-certificata'?: string;
  indirizzo?: IndirizzoXml;
  'atti-conferimento-cariche'?: AttiConferimentoCariche;
}

export interface PersonaFisicaSede {
  cognome?: string;
  nome?: string;
  'c-fiscale'?: string;
  sesso?: string;
  'estremi-nascita'?: EstremiNascita;
}

export interface PersonaGiuridicaSede {
  denominazione?: string;
  'c-fiscale'?: string;
}
export interface RiquadroSoci {
  'composizione-quote'?: {
    'c-valuta'?: string;
    valuta?: string;
    'valore-nominale'?: string;
    'valore-versato'?: string;
  };
  titolari?: {
    titolare?: XmlOneOrMany<TitolareSoci>;
  };
  [key: string]: unknown;
}

export interface TitolareSoci {
  'f-rappresentante'?: string;
  domicilio?: IndirizzoXml;
  'anagrafica-titolare'?: {
    'c-tipo'?: string;
    tipo?: string;
    'c-fiscale'?: string;
    denominazione?: string;
    cognome?: string;
    nome?: string;
  };
  'diritto-partecipazione'?: {
    'c-tipo'?: string;
    tipo?: string;
  };
}

export interface ModificaMad extends XmlTextValue {
  'p-modifica'?: string;
  'dt-effetto'?: string;
  'c-tipo'?: string;
  tipo?: string;
  'c-modifica'?: string;
  'descrizione-c-modifica'?: string;
}

export interface ProtocolloRi {
  'n-protocollo'?: string;
  'n-protocollo-ufficio'?: string;
  anno?: string;
  'dt-protocollo'?: string;
  [key: string]: unknown;
}

export interface StoriaSedePrecedente {
  cciaa?: string;
  'n-rea'?: string;
  mad?: Mad;
  trascrizioni?: Trascrizioni;
}
export interface InfoPatrimonialiFinanziarie {
  'capitale-sociale'?: CapitaleSociale;
}

export interface ProcedureConcorsuali {
  'f-presenza-info'?: string;
}

/* ==============================
 * Parsed specialized responses
 * ============================== */

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

export type ParsedPartecipazioniResponse = Omit<
  ParsedAIWSResponseBase,
  'Risposta'
> & {
  Risposta: Omit<
    ParsedAIWSResponseBaseRisposta,
    'dati' | 'ListaAnagrafiche' | 'VisuraEffetto' | 'ListaImpreseRI'
  > & {
    dati: PartecipazioniData;
  };
};

export type ParsedBlocchiImpresaResponse = Omit<
  ParsedAIWSResponseBase,
  'Risposta'
> & {
  Risposta: Omit<
    ParsedAIWSResponseBaseRisposta,
    'dati' | 'ListaAnagrafiche' | 'VisuraEffetto' | 'ListaImpreseRI'
  > & {
    dati: BlocchiImpresaData;
  };
};

// =============================================================================
// A
// =============================================================================

export interface AbilitazioneFacchinaggio {
  'c-fascia'?: string;
  fascia?: string;
  'c-volume'?: string;
  volume?: string;
  'dt-denuncia'?: string;
  'ulteriori-specifiche'?: string;
}

export interface AbilitazioneImpiantisti {
  'c-qualifica'?: string;
  qualifica?: string;
  lettera?: string;
  'descrizione-lettera'?: string;
  lettere?: string;
  limitazioni?: string;
  'f-tutte-attivita-impresa'?: string;
  provincia?: string;
  n?: string;
  'dt-accertamento'?: string;
  'dt-iscrizione'?: string;
  'c-ente-rilascio'?: string;
  'ente-rilascio'?: string;
}

export interface AbilitazionePulizia {
  'c-fascia'?: string;
  fascia?: string;
  'c-volume'?: string;
  volume?: string;
  'dt-denuncia'?: string;
  'ulteriori-specifiche'?: string;
}

export interface AbilitazioniImpiantisti {
  'abilitazione-impiantisti'?: AbilitazioneImpiantisti[];
  'c-riferimento-legge'?: string;
  'riferimento-legge'?: string;
}

/** simpleContent: testo libero + attributo */
export interface AbilitazioniProfessionali {
  '#text'?: string;
  'p-abilitazioni'?: string;
}

export interface AccreditamentiOdc {
  'accreditamento-odc'?: AccreditamentoOdc[];
  'dt-ultima-modifica'?: string;
  'sito-internet'?: string;
}

export interface AccreditamentoOdc {
  'c-schema-accreditamento'?: string;
  'schema-accreditamento'?: string;
  'n-certificato'?: string;
  'dt-emissione'?: string;
  'dt-scadenza'?: string;
  'file-download'?: string;
}
export interface AddettiImpresa {
  'info-mesi'?: InfoMesi;
  'valori-medi'?: ValoriMedi;
  collaboratori?: Collaboratori;
  'distribuzione-dipendenti'?: DistribuzioneDipendenti;
  'c-tipo-informazione'?: string;
  'tipo-informazione'?: string;
  anno?: string;
  'dt-dichiarazione'?: string;
  'dt-rilevazione'?: string;
  'n-dipendenti'?: string;
  'n-indipendenti'?: string;
  'n-totale'?: string;
  'c-rilevazione-dipendenti'?: string;
}

export interface AmministrazioneControllo {
  'n-soci'?: NSoci;
  'sistema-amministrazione'?: SistemaAmministrazione;
  'soggetto-controllo-contabile'?: SoggettoControlloContabile;
  'forme-amministrative'?: FormeAmministrative;
  'forme-amministrative-in-carica'?: FormeAmministrativeInCarica;
  'organi-controllo-in-carica'?: OrganiControlloInCarica;
  'collegio-sindacale'?: CollegioSindacale;
  'collegio-sindacale-in-carica'?: CollegioSindacaleInCarica;
}

export interface AnagraficaTitolare {
  'c-tipo'?: string;
  tipo?: string;
  'c-fiscale'?: string;
  'c-cittadinanza'?: string;
  cittadinanza?: string;
  denominazione?: string;
  'denominazione-denunciata'?: string;
  cognome?: string;
  nome?: string;
  'f-cessata'?: string;
  'dt-cancellazione'?: string;
}

export interface AnnotazioneLibroSoci {
  'estremi-pratica'?: EstremiPratica;
  'estremi-pratica-riconfermata'?: EstremiPraticaRiconfermata;
  'riquadri-trasferimento'?: RiquadriTrasferimento;
  note?: string[];
}

export interface AnnotazioniLibroSoci {
  'annotazione-libro-soci'?: AnnotazioneLibroSoci[];
}

export interface Apparecchi {
  'n-impastatrici'?: string;
  'n-formatrici'?: string;
  'n-grissinatrici'?: string;
  'n-spezzatrici'?: string;
  'n-laminatoi'?: string;
}

/** simpleContent: testo + attributo c */
export interface AreaIntervento {
  '#text'?: string;
  c?: string;
}

export interface AreeIntervento {
  'area-intervento'?: AreaIntervento[];
}

export interface AssegnatariMarchio {
  iscrizione?: Iscrizione;
  cancellazione?: Cancellazione;
}

export interface Attestazione {
  'certificato-qualita'?: CertificatoQualita;
  'c-fonte'?: string;
  'c-identificativo-SOA'?: string;
  denominazione?: string;
  'n-attestazione'?: string;
  'dt-rilascio'?: string;
  'dt-scadenza'?: string;
  regolamento?: string;
}

export interface AttestazioneQualificazioni {
  'categorie-opere'?: CategorieOpere;
  attestazione?: Attestazione;
}

export interface AttestazioniQualificazioni {
  'attestazione-qualificazioni'?: AttestazioneQualificazioni[];
}

export interface Atti {
  atto?: Atto[];
}

export interface AttiConferimentoCariche {
  'atto-conferimento-cariche'?: AttoConferimentoCariche[];
}

export interface AttiTrascrizioni {
  'atto-trascrizioni'?: AttoTrascrizioni[];
}

/** simpleContent: testo + attributi */
export interface AttivitaAa {
  '#text'?: string;
  'dt-iscrizione-inizio'?: string;
  'dt-inizio'?: string;
}

export interface AttivitaAaBz {
  'mestieri-aa'?: MestieriAa;
  descrizione?: string[];
  'cancellazione-aa-bz'?: CancellazioneAaBz;
  'dt-inizio'?: string;
  'f-attivita-secondaria'?: string;
}

/** simpleContent: testo + attributo */
export interface AttivitaAgricola {
  '#text'?: string;
  'dt-inizio'?: string;
}

export interface AttivitaNoAa {
  descrizione?: string[];
  'informazioni-supplementari-aa'?: string;
  'cancellazione-aa'?: CancellazioneAa;
  'dt-inizio'?: string;
  'c-categoria'?: string;
  categoria?: string;
}

/** simpleContent: testo + attributo */
export interface AttivitaPrevalente {
  '#text'?: string;
  'f-attivita-non-iniziata'?: string;
}

export interface Atto {
  'estremi-notarili'?: EstremiNotarili;
  omologazione?: Omologazione;
  registrazione?: Registrazione;
  'presentazione-cciaa'?: PresentazioneCciaa;
  'iscrizione-modifica'?: IscrizioneModifica;
  c?: string;
  'c-tipo'?: string;
  tipo?: string;
  'descrizione-tipo'?: string;
  'dt-atto'?: string;
}

export interface AttoConferimentoCariche {
  cariche?: Cariche;
  'poteri-persona'?: PoteriPersona;
  'estremi-atto'?: EstremiAtto;
  'proprieta-quota'?: ProprietaQuota;
  'partecipazione-utili'?: PartecipazioneUtili;
  'conferimenti-prestazioni'?: ConferimentiPrestazioni;
  'abilitazioni-professionali'?: AbilitazioniProfessionali;
  'p-gruppo-cariche'?: string;
}

export interface AttoParcheggiato {
  tipo?: string;
  cciaa?: string;
  anno?: string;
  n?: string;
  'dt-atto'?: string;
  'dt-deposito'?: string;
}

export interface AttoTrascrizioni {
  atto?: Atto;
  'trascrizioni-ri'?: TrscrizioniRi;
}

export interface AutorizzazionePs {
  n?: string;
  dt?: string;
}

// =============================================================================
// B
// =============================================================================

/** simpleContent: testo + attributo c */
export interface BeneServizio {
  '#text'?: string;
  c?: string;
}

export interface BeniServizi {
  'bene-servizio'?: BeneServizio[];
}

export interface Bilanci {
  bilancio?: Array<{ anno?: string }>;
}

export interface BlocchiImpresa {
  'dati-identificativi'?: DatiIdentificativi;
  'sintesi-attivita'?: SintesiAttivita;
  'sintesi-cifre-impresa'?: SintesiCifreImpresa;
  'doc-consultabili'?: DocConsultabili; // Skippato
  'info-sede'?: InfoSede;
  'estremi-atto-costituzione'?: EstremiAttoCostituzione;
  'cancellazione-trasferimento'?: CancellazioneTrasferimento;
  'info-attivita'?: InfoAttivita;
  'storia-attivita'?: StoriaAttivita;
  'storia-addetti'?: StoriaAddetti;
  'albi-ruoli-licenze'?: AlbiRuoliLicenze;
  'persone-sede'?: PersoneSede; // da modificare
  localizzazioni?: Localizzazioni; // da fare
  'protocolli-aperti'?: ProtocolliAperti; // da fare
  'protocolli-completi'?: ProtocolliCompleti; // da fare
  'societa-quotata'?: SocietaQuotata;
  'elenco-soci'?: ElencoSoci;
  'tabella-elenco-soci'?: TabellaElencoSoci;
  'annotazioni-libro-soci'?: AnnotazioniLibroSoci;
  'trasferimenti-quote'?: TrasferimentiQuote; // skip
  'trasferimento-quote'?: TrasferimentoQuote; // skip
  'soci-trasferimento-quote'?: SociTrasferimentoQuote; // skip
  'pratiche-soggetti-controllanti'?: PraticheSoggettiControllanti;
  'partecipazioni-societa'?: PartecipazioniSocieta; // skip
  'tabella-partecipate-impresa'?: TabellaPartecipateImpresa[];
  mad?: Mad;
  trascrizioni?: Trascrizioni;
  'storia-cciaa-provenienza'?: StoriaCciaaProvenienza; // skip
  'storia-sedi-precedenti'?: StoriaSediPrecedenti;
  'iscrizione-ri'?: IscrizioneRi;
  'info-statuto'?: InfoStatuto;
  'reti-imprese'?: RetiImprese;
  'amministrazione-controllo'?: AmministrazioneControllo;
  'info-patrimoniali-finanziarie'?: InfoPatrimonialiFinanziarie;
  'patti-parasociali'?: PattiParasociali;
  'procedure-concorsuali'?: ProcedureConcorsuali;
  'variazioni-forma-giuridica'?: VariazioniFormaGiuridica;
  'info-supplementari-storiche'?: InfoSupplementariStoriche;
  'ta-fusioni-scissioni-subentri'?: TaFusioniScissioniSubentri;
}

// =============================================================================
// C
// =============================================================================

export interface Cancellazione {
  'estremi-atto'?: EstremiAtto;
  'info-cessazione'?: string;
  'dt-cancellazione'?: string;
  'dt-cessazione'?: string;
  'dt-domanda'?: string;
  'dt-denuncia'?: string;
  'c-causale'?: string;
  causale?: string;
  'dt-cessazione-attivita'?: string;
}

export interface CancellazioneAa {
  'c-causale'?: string;
  causale?: string;
  'dt-domanda-accertamento'?: string;
  'dt-delibera'?: string;
  'dt-cessazione'?: string;
}

export interface CancellazioneAaBz {
  'dt-effetto'?: string;
  'dt-domanda-accertamento'?: string;
  'c-causale'?: string;
  causale?: string;
}

export interface CancellazioneRuolo {
  'c-causale'?: string;
  causale?: string;
  'dt-domanda'?: string;
  'dt-delibera'?: string;
  'dt-cessazione'?: string;
}

export interface CancellazioneTrasferimento {
  cancellazione?: Cancellazione;
  'indirizzo-sede-estero'?: IndirizzoSedeEstero;
  'trasferimento-sede'?: TrasferimentoSede;
  'trasferimento-sede-ul-attiva'?: TrasferimentoSedeUlAttiva;
  'info-altro-registro'?: InfoAltroRegistro;
}

export interface CapitaleInvestito {
  'c-valuta'?: string;
  valuta?: string;
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface CapitaleSociale {
  deliberato?: Deliberato;
  sottoscritto?: Sottoscritto;
  versato?: Versato;
  'tipo-conferimenti'?: TipoConferimenti;
  'c-valuta'?: string;
  valuta?: string;
  ammontare?: string;
  'n-azioni'?: string;
  'n-quote'?: string;
}

export interface CaratteristicheImpianto1 {
  'quintali-potenza-nominale'?: string;
  'tipo-riscaldamento'?: string;
  'tipo-combustibile'?: string;
}

export interface CaratteristicheImpianto2 {
  'quintali-potenza-nominale'?: string;
  'tipo-riscaldamento'?: string;
  'tipo-combustibile'?: string;
}

/** simpleContent: testo (denominazione carica) + attributi */
export interface Carica {
  '#text'?: string;
  'p-carica'?: string;
  'c-carica'?: string;
  'dt-iscrizione'?: string;
  'dt-iscrizione-libro-soci'?: string;
  'dt-atto-nomina'?: string;
  'dt-nomina'?: string;
  'dt-fine'?: string;
  'n-anni-esercizio'?: string;
  'c-durata'?: string;
  'descrizione-durata'?: string;
  'dt-riferimento-bilancio'?: string;
  'dt-presentazione'?: string;
}

export interface Cariche {
  carica?: Carica[];
}

export interface CategoriaOpere {
  'c-categoria'?: string;
  categoria?: string;
  'c-classificazione'?: string;
  classificazione?: string;
}

export interface CategorieOpere {
  'categoria-opere'?: CategoriaOpere[];
  'c-fonte'?: string;
}

export interface CertificatoQualita {
  'denominazione-odc'?: string;
  'dt-scadenza'?: string;
}

export interface Certificazione {
  settori?: Settori;
  'c-schema-accreditamento'?: string;
  'schema-accreditamento'?: string;
  'norma-riferimento'?: string;
  'n-certificato'?: string;
  nota?: string;
  'dt-emissione'?: string;
  'denominazione-odc'?: string;
  'c-fiscale-odc'?: string;
}

export interface CertificazioneBio {
  fonte?: string;
  'dt-ultimo-aggiornamento'?: string;
  'c-operatore'?: string;
  operatore?: string;
  'dt-assoggettamento'?: string;
  attivita?: string;
  'n-certificato'?: string;
  'c-odc'?: string;
  odc?: string;
  'attivita-certificata'?: string;
  'n-certificato-conformita'?: string;
  'dt-scadenza'?: string;
}

export interface Certificazioni {
  certificazione?: Certificazione[];
  'dt-ultima-modifica'?: string;
}

export interface CertificazioniBio {
  'certificazione-bio'?: CertificazioneBio[];
}

export interface CessazioneEsercizio {
  note?: string[];
  'dt-cessazione'?: string;
  'dt-decorrenza'?: string;
}

export interface CessazioneLocalizzazione {
  'estremi-atto'?: EstremiAtto;
  'info-cessazione'?: string;
  'dt-cessazione'?: string;
  'dt-domanda'?: string;
  'dt-denuncia'?: string;
  'c-causale'?: string;
  causale?: string;
}

export interface ClassificazioneAteco {
  'c-attivita'?: string;
  attivita?: string;
  'c-importanza'?: string;
  importanza?: string;
  'c-nace'?: string;
  'dt-inizio'?: string;
  'dt-riferimento'?: string;
  'c-fonte'?: string;
  fonte?: string;
}

export interface ClassificazioneAteco2002 {
  'c-attivita'?: string;
  attivita?: string;
  'c-importanza'?: string;
  importanza?: string;
  'dt-inizio'?: string;
}

export interface ClassificazioniAteco {
  'classificazione-ateco'?: ClassificazioneAteco[];
  'c-codifica'?: string;
  codifica?: string;
}

export interface ClassificazioniAteco2002 {
  'classificazione-ateco-2002'?: ClassificazioneAteco2002[];
}

export interface CodiciLei {
  c?: string;
  'dt-scadenza'?: string;
  'c-fonte'?: string;
  fonte?: string;
}

export interface Collaboratori {
  'info-mesi'?: InfoMesi;
  'valori-medi'?: ValoriMedi;
}

export interface CollegioSindacale {
  'n-effettivi'?: string;
  'n-supplenti'?: string;
  'n-min'?: string;
  'n-max'?: string;
}

export interface CollegioSindacaleInCarica {
  'n-in-carica'?: string;
  'anni-durata'?: string;
  'c-durata'?: string;
  durata?: string;
  'dt-inizio-carica'?: string;
  'dt-fine-carica'?: string;
}

export interface CommercioDettaglio {
  'integrazione-informazioni'?: IntegrazioneInformazioni;
  'dt-dichiarazione'?: string;
  'superficie-vendita'?: string;
  'c-settore-merceologico'?: string;
  'settore-merceologico'?: string;
}

export interface ComposizioneQuote {
  'c-tipo'?: string;
  tipo?: string;
  n?: string;
  'c-valuta'?: string;
  valuta?: string;
  'valore-nominale'?: string;
  'n-azioni'?: string;
  'n-quote'?: string;
  'valore-unitario'?: string;
  'ammontare-convertito-in-euro'?: string;
  'valore-versato'?: string;
}

export interface ComunicazioneCuratore {
  'estremi-udienza'?: EstremiUdienza;
  tribunale?: string;
  'n-provvedimento'?: string;
  'dt-provvedimento'?: string;
  'nome-giudice'?: string;
  'cognome-giudice'?: string;
}

export interface ComunicazioniCuratore {
  'comunicazione-curatore'?: ComunicazioneCuratore[];
}

/** simpleContent: testo + attributo */
export interface ConferimentiPrestazioni {
  '#text'?: string;
  'p-conferimenti'?: string;
}

export interface ConferimentiBenefici {
  '#text'?: string;
  'f-presenza-nello-statuto'?: string;
}

// =============================================================================
// D
// =============================================================================

export interface DatiArtigiani {
  'attivita-aa'?: AttivitaAa;
  'informazioni-supplementari-aa'?: string;
  'cancellazione-aa'?: CancellazioneAa;
  'f-albo-soppresso'?: string;
  'c-riferimento-legge'?: string;
  n?: string;
  'c-categoria'?: string;
  categoria?: string;
  provincia?: string;
  'dt-iscrizione-accertamento'?: string;
  'dt-domanda'?: string;
  'dt-domanda-accertamento'?: string;
  'dt-iscrizione'?: string;
  'dt-delibera'?: string;
}

export interface DatiBilanci {
  'dati-bilancio'?: DatiBilancio[];
}

export interface DatiBilancio {
  anno?: string;
  'utile-perdite'?: string;
  ricavi?: string;
  'valore-produzione'?: string;
}

export interface DatiIscrizioneReaRd {
  'n-rea'?: string;
  'n-rd'?: string;
  'dt-iscrizione'?: string;
  'c-tipo-iscrizione'?: string;
  'tipo-iscrizione'?: string;
}

export interface Deliberato {
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface DenunceInizioAttivita {
  'denuncia-inizio-attivita'?: DenunciaInizioAttivita[];
}

export interface DenunciaInizioAttivita {
  'c-tipo'?: string;
  tipo?: string;
  'dt-denuncia'?: string;
  'c-ente-rilascio'?: string;
  'ente-rilascio'?: string;
}

/** simpleContent: testo (descrizione dettaglio) + attributo */
export interface DettaglioAttivita {
  '#text'?: string;
  'c-dettaglio'?: string;
}

export interface DettagliAttivita {
  'dettaglio-attivita'?: DettaglioAttivita[];
  'c-tipo'?: string;
  tipo?: string;
}

export interface DettagliIscrizione {
  'dettaglio-iscrizione'?: DettaglioIscrizione[];
}

export interface DettaglioIscrizione {
  'ulteriori-dettagli'?: UlterioriDettagli;
  'dt-inizio'?: string;
  'dt-emissione'?: string;
  'dt-scadenza'?: string;
  'stato-dettaglio'?: string;
  'dt-inizio-stato'?: string;
  'dt-fine-stato'?: string;
}

/** simpleContent: testo + attributi */
export interface Dichiarazione {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
  'dt-iscrizione'?: string;
}

export interface DichiarazioneAmbientale {
  'dettagli-iscrizione'?: DettagliIscrizione;
  'c-tipo'?: string;
  tipo?: string;
  'c-fonte'?: string;
  fonte?: string;
  'provincia-sezione'?: string;
  provincia?: string;
  n?: string;
  anno?: string;
  'dt-prima-iscrizione'?: string;
  'dt-iscrizione'?: string;
  'dt-cancellazione'?: string;
  'stato-iscrizione'?: string;
  'dt-inizio-stato'?: string;
  'dt-fine-stato'?: string;
}

/** simpleContent: testo + attributi */
export interface DichiarazioneIncubatore {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
}

/** simpleContent: testo + attributi */
export interface DichiarazionePmi {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
}

/** simpleContent: testo + attributi */
export interface DichiarazioneScuolaLavoro {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
}

/** simpleContent: testo + attributi */
export interface DichiarazioneStartUp {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
}

export interface Dichiarazioni {
  dichiarazione?: Dichiarazione[];
}

export interface DichiarazioniAmbientali {
  'dichiarazione-ambientale'?: DichiarazioneAmbientale[];
}

export interface DichiarazioniIncubatore {
  'dichiarazione-incubatore'?: DichiarazioneIncubatore[];
}

export interface DichiarazioniPmi {
  'dichiarazione-pmi'?: DichiarazionePmi[];
}

export interface DichiarazioniScuolaLavoro {
  'dichiarazione-scuola-lavoro'?: DichiarazioneScuolaLavoro[];
}

export interface DichiarazioniStartUp {
  'dichiarazione-start-up'?: DichiarazioneStartUp[];
}

export interface DipendentiContratti {
  'dipendenti-contratto'?: DipendentiContratto[];
}

export interface DipendentiContratto {
  'info-mesi'?: InfoMesi;
  contratto?: string;
}

export interface DipendentiOrariLavoro {
  'dipendenti-orario-lavoro'?: DipendentiOrarioLavoro[];
}

export interface DipendentiOrarioLavoro {
  'info-mesi'?: InfoMesi;
  'orario-lavoro'?: string;
}

export interface DipendentiQualifica {
  'info-mesi'?: InfoMesi;
  qualifica?: string;
}

export interface DipendentiQualifiche {
  'dipendenti-qualifica'?: DipendentiQualifica[];
}

export interface DirittoPartecipazione {
  'ruolo-partecipazione'?: RuoloPartecipazione[];
  'c-tipo'?: string;
  tipo?: string;
  'frazione-numeratore'?: string;
  'frazione-denominatore'?: string;
  percentuale?: string;
  'c-valuta'?: string;
  valuta?: string;
  valore?: string;
}

export interface DistribuzioneDipendenti {
  'dipendenti-contratti'?: DipendentiContratti;
  'dipendenti-orari-lavoro'?: DipendentiOrariLavoro;
  'dipendenti-qualifiche'?: DipendentiQualifiche;
  'f-presenza-agricoli'?: string;
}

export interface DocConsultabili {
  bilanci?: Bilanci;
  'f-esiste-statuto'?: string;
  'n-altri-atti'?: string;
  'rendicontazione-sos'?: string;
  'relazione-benefit'?: string;
  'bilancio-sociale'?: string;
}

export interface Domicilio {
  comune?: string;
  provincia?: string;
  'provincia-ter'?: string;
  via?: string;
  'n-civico'?: string;
  cap?: string;
  'cap-ter'?: string;
  'c-stato'?: string;
  stato?: string;
  frazione?: string;
  presso?: string;
}

/** Stesso schema di Domicilio */
export type DomicilioRi = Domicilio;

export interface DomicilioFiscale {
  'c-comune'?: string;
  comune?: string;
  provincia?: string;
  'provincia-ter'?: string;
  'c-toponimo'?: string;
  toponimo?: string;
  via?: string;
  'n-civico'?: string;
  cap?: string;
  'cap-ter'?: string;
  'c-stato'?: string;
  stato?: string;
  frazione?: string;
  'altre-indicazioni'?: string;
}

export interface DurataSocieta {
  'scadenza-esercizi'?: ScadenzaEsercizi;
  'dt-termine'?: string;
  'f-durata-indeterminata'?: string;
  'c-tipo-proroga'?: string;
  'tipo-proroga'?: string;
  'n-anni-proroga-tacita'?: string;
}

// =============================================================================
// E
// =============================================================================

export interface ElencoSoci {
  'estremi-pratica'?: EstremiPratica;
  'estremi-pratica-riconfermata'?: EstremiPraticaRiconfermata;
  'capitale-sociale'?: CapitaleSociale;
  riquadri?: Riquadri;
  note?: string[];
  'note-pratica-riconfermata'?: string[];
  'dt-soci-titolari-dal'?: string;
  'dt-soci-titolari-al'?: string;
  'f-consorzio'?: string;
  'f-ultimo-elenco-soci'?: string;
  'c-riferimento-legge'?: string;
  'riferimento-legge'?: string;
}

export interface EstremiAtto {
  'c-tipo'?: string;
  tipo?: string;
  notaio?: string;
  tribunale?: string;
  'altre-indicazioni'?: string;
  'n-registrazione'?: string;
  'dt-registrazione'?: string;
  'localita-ufficio-registro'?: string;
  'provincia-ufficio-registro'?: string;
}

export interface EstremiAttoCostituzione {
  'c-tipo'?: string;
  tipo?: string;
  'n-repertorio'?: string;
  notaio?: string;
  'localita-notaio'?: string;
  'provincia-notaio'?: string;
  'n-registrazione'?: string;
  'dt-registrazione'?: string;
  'localita-ufficio-registro'?: string;
  'provincia-ufficio-registro'?: string;
}

export interface EstremiImpresa {
  'forma-giuridica'?: FormaGiuridica;
  'c-fiscale'?: string;
  denominazione?: string;
  'f-cessata'?: string;
  'dt-cancellazione'?: string;
}

export interface EstremiNascita {
  dt?: string;
  'c-comune'?: string;
  comune?: string;
  provincia?: string;
  'c-stato'?: string;
  stato?: string;
}

export interface EstremiNotarili {
  'c-forma'?: string;
  forma?: string;
  notaio?: string;
  'n-repertorio'?: string;
  'localita-notaio'?: string;
  'provincia-notaio'?: string;
}

export interface EstremiPratica {
  'c-pratica'?: string;
  'c-tipo-adempimento'?: string;
  'tipo-adempimento'?: string;
  'dt-atto'?: string;
  cciaa?: string;
  anno?: string;
  n?: string;
  'dt-protocollo'?: string;
  'dt-deposito'?: string;
  'f-riconferma'?: string;
  'dt-dichiarazione'?: string;
  'c-tipo-elenco'?: string;
  'tipo-elenco'?: string;
  'c-tipo-richiesta'?: string;
  'tipo-richiesta'?: string;
}

export interface EstremiPraticaRiconfermata {
  cciaa?: string;
  anno?: string;
  n?: string;
}

export interface EstremiUdienza {
  'dt-udienza'?: string;
  'dt-termine'?: string;
  luogo?: string;
}

export interface Euid {
  'c-euid'?: string;
  'c-stato'?: string;
  stato?: string;
  'c-registro'?: string;
  registro?: string;
  'n-registrazione'?: string;
  'c-forma-giuridica'?: string;
  'forma-giuridica'?: string;
}

export interface Eventi {
  evento?: Evento[];
}

export interface Evento {
  'p-societa'?: string;
  denominazione?: string;
  'c-fiscale'?: string;
  comune?: string;
  cciaa?: string;
  'n-rea'?: string;
  'n-rd'?: string;
  'n-rs'?: string;
  'c-tribunale'?: string;
  tribunale?: string;
  provincia?: string;
  'n-ri'?: string;
  'c-euid'?: string;
}

// =============================================================================
// F
// =============================================================================

export interface Fallimento {
  'fallimento-in-proprio'?: FallimentoInProprio;
  'fallimento-per-estensione'?: FallimentoPerEstensione;
  'p-fallimento'?: string;
}

export interface FallimentoInProprio {
  'estremi-nascita'?: EstremiNascita;
  'n-fallimento'?: string;
  'dt-fallimento'?: string;
  tribunale?: string;
  'provincia-tribunale'?: string;
  'n-sentenza'?: string;
  'dt-sentenza'?: string;
  curatore?: string;
  'dt-chiusura'?: string;
  'c-organo-giudiziario'?: string;
  'organo-giudiziario'?: string;
  sesso?: string;
  cognome?: string;
  nome?: string;
  'c-fiscale'?: string;
}

/** Stessa struttura di FallimentoInProprio */
export type FallimentoPerEstensione = FallimentoInProprio;

export interface FamiliarePartecipe {
  cognome?: string;
  nome?: string;
  'c-fiscale'?: string;
  'f-coltivatore-diretto'?: string;
}

export interface FamiliariPartecipi {
  'familiare-partecipe'?: FamiliarePartecipe[];
}

export interface FilanziamentoSpecificoAffare {
  costituzione?: string;
  modifica?: Modifica;
  cessazione?: string;
}

export interface FondoConsortile {
  descrizioni?: Descrizioni;
  'c-valuta'?: string;
  valuta?: string;
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

/** simpleContent: testo (denominazione) + attributi */
export interface FormaAmministrativa {
  '#text'?: string;
  c?: string;
  'f-in-carica'?: string;
  'f-organo-controllo'?: string;
  'n-min-amministratori'?: string;
  'n-max-amministratori'?: string;
}

/** simpleContent: testo (denominazione) + attributi */
export interface FormaAmministrativaInCarica {
  '#text'?: string;
  c?: string;
  'n-amministratori-in-carica'?: string;
  'anni-durata'?: string;
  'c-durata'?: string;
  durata?: string;
  'dt-inizio-carica'?: string;
  'dt-fine-carica'?: string;
}

export interface FormeAmministrative {
  'forma-amministrativa'?: FormaAmministrativa[];
}

export interface FormeAmministrativeInCarica {
  'forma-amministrativa-in-carica'?: FormaAmministrativaInCarica[];
}

export interface FusioneScissione {
  eventi?: Eventi;
  dichiarazioni?: Dichiarazioni;
  'p-fusione'?: string;
  'c-tipo'?: string;
  tipo?: string;
  'c-approvazione'?: string;
  approvazione?: string;
  'c-evento'?: string;
  evento?: string;
  'dt-iscrizione'?: string;
  'dt-modifica'?: string;
  'dt-atto'?: string;
  'dt-delibera'?: string;
  'dt-atto-revoca'?: string;
  'dt-atto-esecuzione'?: string;
}

export interface FusioniScissioni {
  'fusione-scissione'?: FusioneScissione[];
}

// =============================================================================
// G
// =============================================================================

/** simpleContent: testo + attributi */
export interface GruppoIva {
  '#text'?: string;
  'c-fonte'?: string;
  'dt-ultimo-aggiornamento'?: string;
  denominazione?: string;
  'dt-inizio'?: string;
}

// =============================================================================
// I
// =============================================================================

export interface ImpresaSociale {
  'beni-servizi'?: BeniServizi;
  'settori-attivita'?: SettoriAttivita;
  'n-lavoratori-svantaggiati'?: string;
  'n-lavoratori-disabili'?: string;
}

export interface ImpresaRiferimento {
  denominazione?: string;
  'c-fiscale'?: string;
}

export interface ImpresaSubentrante {
  denominazione?: string;
  'c-fiscale'?: string;
  cciaa?: string;
  'n-rea'?: string;
  'n-rd'?: string;
  'n-ri'?: string;
  'c-titolo-subentro'?: string;
  'titolo-subentro'?: string;
}

export interface ImpresaSubentrata {
  denominazione?: string;
  'c-fiscale'?: string;
  cciaa?: string;
  'n-rea'?: string;
  'n-rd'?: string;
  'n-aa'?: string;
  'n-ri'?: string;
  'c-titolo-subentro'?: string;
  'titolo-subentro'?: string;
}

export interface Indirizzo {
  'c-comune'?: string;
  comune?: string;
  provincia?: string;
  'provincia-ter'?: string;
  'c-toponimo'?: string;
  toponimo?: string;
  via?: string;
  'n-civico'?: string;
  cap?: string;
  'cap-ter'?: string;
  'c-stato'?: string;
  stato?: string;
  frazione?: string;
  'altre-indicazioni'?: string;
}

/** Stessa struttura di Indirizzo */
export type IndirizzoRi = Indirizzo;

export interface IndirizzoSedeEstero {
  'info-trasferimento'?: string;
  'c-stato'?: string;
  stato?: string;
  indirizzo?: string;
}

export interface InfoAltroRegistro {
  'trasferimento-altro-registro'?: TrasferimentoAltroRegistro;
  cancellazione?: Cancellazione;
  cciaa?: string;
}

export interface InfoAmministratori {
  'f-presenza-info'?: string;
}

export interface InfoAttivita {
  'lavoro-prestato-familiari-part'?: LavoroPrestatoFamiliariPart;
  'familiari-partecipi'?: FamiliariPartecipi;
  'attivita-esercitata'?: string;
  'attivita-secondaria-esercitata'?: string;
  'attivita-aa-bz'?: AttivitaAaBz;
  'attivita-no-aa'?: AttivitaNoAa;
  'attivita-agricola'?: AttivitaAgricola;
  'dettagli-attivita'?: DettagliAttivita[];
  'classificazioni-ateco-2002'?: ClassificazioniAteco2002;
  'classificazioni-ateco'?: ClassificazioniAteco[];
  'attivita-prevalente'?: AttivitaPrevalente;
  'attestazioni-qualificazioni'?: AttestazioniQualificazioni;
  'certificazioni-bio'?: CertificazioniBio;
  certificazioni?: Certificazioni;
  'accreditamenti-odc'?: AccreditamentiOdc;
  'impresa-sociale'?: ImpresaSociale;
  runts?: Runts;
  'rating-legalita'?: RatingLegalita;
  'addetti-impresa'?: AddettiImpresa[];
  'addetti-comuni'?: AddettiComuni[];
  'dt-inizio-attivita-impresa'?: string;
  'dt-inizio'?: string;
  'c-stato'?: string;
  stato?: string;
}

export interface InfoMese {
  'c-mese'?: string;
  mese?: string;
  'n-dipendenti'?: string;
  'n-indipendenti'?: string;
  'n-totale'?: string;
  'n-collaboratori'?: string;
  'percentuale-dipendenti'?: string;
  'n-dip-no-agricoli'?: string;
}

export interface InfoMesi {
  'info-mese'?: InfoMese[];
}

export interface InfoPatrimonialiFinanziarie {
  'capitale-investito'?: CapitaleInvestito;
  'fondo-consortile'?: FondoConsortile;
  'valore-nominale-conferimenti'?: ValoreNominaleConferimenti;
  'capitale-sociale'?: CapitaleSociale;
  'composizione-quote'?: ComposizioneQuote;
  'conferimenti-benefici'?: ConferimentiBenefici;
  'strumenti-finanziari'?: StrumentiFinanziari;
  'diminuzione-capitale'?: string;
  'offerta-azioni'?: string;
  'anticipata-conversione'?: string;
  'patrimonio-specifico-affare'?: PatrimonioSpecificoAffare;
  'finanziamento-specifico-affare'?: FilanziamentoSpecificoAffare;
  'dati-bilanci'?: DatiBilanci;
  'f-presenza-info'?: string;
}

export interface InfoPersone {
  'f-presenza-info'?: string;
}

export interface InfoSede {
  telefono?: Telefono;
  telex?: string;
  telefax?: Telefax;
  'indirizzo-posta-certificata'?: string;
  'sito-internet'?: string;
  email?: string;
  'legal-mail'?: string;
  'altre-funzioni-sede'?: string;
  'dati-iscrizione-rea-rd'?: DatiIscrizioneReaRd;
  'persona-giuridica-privata'?: PersonaGiuridicaPrivata;
  'sede-fuori-provincia'?: SedeFuoriProvincia;
  'partita-iva'?: PartitaIva;
  'gruppo-iva'?: GruppoIva;
  'codice-lei'?: CodiciLei;
  insegna?: string;
  euid?: Euid;
  'sede-secondaria-rs'?: SedeSecondariaRs;
  'provenienza-trasferimento'?: ProvenienzaTrasferimento;
  'informazioni-supplementari'?: InformazioniSupplementari;
  'f-scritture-contabili'?: string;
}

export interface Telefono {
  prefisso?: string;
  n?: string;
}

export interface Telefax {
  prefisso?: string;
  n?: string;
}

export interface InfoSindaci {
  'f-presenza-info'?: string;
}

export interface InfoStatuto {
  'durata-societa'?: DurataSocieta;
  'iscrizione-rs'?: IscrizioneRs;
  'oggetto-sociale'?: string;
  poteri?: Poteri;
  riferimenti?: Riferimenti;
  dichiarazioni?: Dichiarazioni;
  'sigla-denominazione'?: string;
  'dt-fondazione'?: string;
  'dt-comunicazione-unica'?: string;
  'dt-atto-costituzione'?: string;
  'dt-costituzione'?: string;
}

export interface InfoSupplementariStoriche {
  'descrizioni-atto-costitutivo'?: string;
  'notizie-storiche'?: string;
}

export interface InformazioneASocio {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
}

export interface InformazioniSocio {
  'informazione-socio'?: InformazioneASocio[];
}

export interface InformazioniSupplementari {
  'poteri-congiunti'?: string;
  'info-visura'?: string;
  'info-generiche'?: string;
  'info-localizzazione'?: string;
}

export interface InformazioniAtto {
  titolari?: Titolari;
  'n-repertorio'?: string;
  notaio?: string;
  'c-oggetto'?: string;
  oggetto?: string;
}

export interface IntegrazioneInformazioni {
  'tabelle-speciali'?: TabelleSpeciali;
  note?: string[];
  'cessazione-esercizio'?: CessazioneEsercizio;
  'dt-inserimento'?: string;
  'dt-decorrenza'?: string;
  'c-tipo-domanda'?: string;
  'tipo-domanda'?: string;
  'n-autorizzazione'?: string;
  'dt-presentazione'?: string;
  'c-comune-presentazione'?: string;
  'comune-presentazione'?: string;
  'provincia-presentazione'?: string;
  'n-protocollo'?: string;
  'c-struttura-esercizio'?: string;
  'struttura-esercizio'?: string;
  'mq-vendita-alimentare'?: string;
  'mq-vendita-non-alimentare'?: string;
  'mq-esercizio'?: string;
  'centro-commerciale'?: string;
}

export interface Iscrizione {
  'c-tipo'?: string;
  tipo?: string;
  'dt-iscrizione'?: string;
  'n-marchio'?: string;
  cciaa?: string;
  'dt-assegnazione'?: string;
  'c-categoria'?: string;
  categoria?: string;
}

export interface IscrizioneModifica {
  'c-tipo-iscrizione'?: string;
  'tipo-iscrizione'?: string;
  'dt-deposito'?: string;
  'dt-iscrizione'?: string;
  'f-rettifica'?: string;
  'dt-rettifica'?: string;
}

export interface IscrizioneRi {
  sezioni?: Sezioni;
  'n-annotazione-ri'?: string;
  'n-iscrizione-ri'?: string;
  'n-c-fiscale'?: string;
  'n-annotazione-ri-old'?: string;
  'n-iscrizione-ri-old'?: string;
  'provincia-ri'?: string;
  'cciaa-competente'?: string;
  'c-n-iscrizione-ri-old'?: string;
  'dt-iscrizione'?: string;
  'dt-annotazione'?: string;
}

export interface IscrizioneRs {
  'dt-iscrizione'?: string;
  'n-rs'?: string;
  'n-volume'?: string;
  'n-fascicolo'?: string;
  'localita-tribunale'?: string;
  'provincia-tribunale'?: string;
}

// =============================================================================
// L
// =============================================================================

export interface LavoroPrestatoFamiliariPart {
  'n-lavoratori-tempo-indeter'?: string;
  'n-giornate'?: string;
}

export interface Licenza {
  'info-non-documentata'?: string;
  'molini-panificatori'?: MoliniPanificatori;
  'licenza-autorizzazione'?: LicenzaAutorizzazione;
  'p-licenza'?: string;
  'f-non-documentata'?: string;
  'c-non-documentata'?: string;
}

export interface LicenzaAutorizzazione {
  'c-autorita-rilascio'?: string;
  'autorita-rilascio'?: string;
  n?: string;
  'dt-iscrizione'?: string;
  c?: string;
  tipo?: string;
}

export interface Licenze {
  licenza?: Licenza[];
}

export interface IndirizzoLocalizzazione {
  'c-comune'?: string;
  comune?: string;
  provincia?: string;
  'provincia-ter'?: string;
  'c-toponimo'?: string;
  toponimo?: string;
  via?: string;
  'n-civico'?: string;
  cap?: string;
  'cap-ter'?: string;
  'c-stato'?: string;
  stato?: string;
  frazione?: string;
  'altre-indicazioni'?: string;
  'c-stradario'?: string;
  'c-zona'?: string;
  'f-sede-presso-terzi'?: string;
}

export interface Localizzazione {
  'sotto-tipi'?: SottoTipi;
  'indirizzo-localizzazione'?: IndirizzoLocalizzazione;
  telefono?: Telefono;
  telex?: string;
  telefax?: Telefax;
  'sede-fuori-provincia'?: SedeFuoriProvincia;
  'sede-secondaria-rs'?: SedeSecondariaRs;
  'impresa-subentrata'?: ImpresaSubentrata;
  'attivita-esercitata'?: string;
  'attivita-secondaria-esercitata'?: string;
  'attivita-aa-bz'?: AttivitaAaBz;
  'attivita-no-aa'?: AttivitaNoAa;
  'dettagli-attivita'?: DettagliAttivita[];
  'classificazioni-ateco-2002'?: ClassificazioniAteco2002;
  'classificazioni-ateco'?: ClassificazioniAteco[];
  'albi-ruoli-licenze'?: AlbiRuoliLicenze;
  persone?: Persone;
  'informazioni-supplementari'?: InformazioniSupplementari;
  'cessazione-localizzazione'?: CessazioneLocalizzazione;
  'trasferimento-localizzazione'?: TrasferimentoLocalizzazione;
  'impresa-subentrante'?: ImpresaSubentrante;
  progressivo?: string;
  'f-dati-ridotti'?: string;
  'c-tipo'?: string;
  tipo?: string;
  'c-tipo-iscrizione'?: string;
  'tipo-iscrizione'?: string;
  denominazione?: string;
  insegna?: string;
  'dt-apertura'?: string;
  'f-cessazione'?: string;
  'c-euid'?: string;
  'f-scritture-contabili'?: string;
}

export interface Localizzazioni {
  localizzazione?: Localizzazione[];
}

// =============================================================================
// M
// =============================================================================

export interface Macchinari {
  'caratteristica-1'?: string;
  'caratteristica-2'?: string;
  'caratteristica-3'?: string;
  'caratteristica-4'?: string;
  'f-apparecchi-pulitura'?: string;
}

export interface Mad {
  'sessioni-rd-rea'?: SessioniRdRea;
  'sessioni-aa'?: SessioniAa;
}

/** simpleContent: testo (descrizione mestiere) + attributi */
export interface MestiereAa {
  '#text'?: string;
  c?: string;
  descrizione?: string;
  'ulteriore-descrizione'?: string;
  'dt-inizio-attivita'?: string;
}

export interface MestieriAa {
  'mestiere-aa'?: MestiereAa[];
}

export interface Modelli {
  modello?: Modello[];
}

export interface ModelliTrascrizioni {
  modelli?: Modelli;
  'trascrizioni-ri'?: TrscrizioniRi;
}

export interface Modello {
  riquadri?: Riquadri;
  c?: string;
  'n-ricorrenze'?: string;
}

/** simpleContent: testo + attributi */
export interface Modifica {
  '#text'?: string;
  'p-modifica'?: string;
  'c-tipo'?: string;
  tipo?: string;
  'dt-effetto'?: string;
  'c-modifica'?: string;
  'descrizione-c-modifica'?: string;
}

export interface Modifiche {
  modifica?: Modifica[];
}

export interface Molini {
  'potenze-cereali-macchinari'?: PotenzeCerealiMacchinari;
  stoccaggio?: Stoccaggio;
  categoria?: string;
}

export interface MoliniPanificatori {
  panificatori?: Panificatori;
  molini?: Molini;
  'c-tipo'?: string;
  tipo?: string;
  n?: string;
  'dt-iscrizione'?: string;
  stato?: string;
  conduzione?: string;
  denominazione?: string;
  'dt-inizio-rapporto'?: string;
  'dt-fine-rapporto'?: string;
}

// =============================================================================
// N
// =============================================================================

export interface NSoci {
  soci?: string;
  accomandatari?: string;
  amministratori?: string;
}

/** simpleContent: testo + attributo c */
export interface NotaElencoSoci {
  '#text'?: string;
  c?: string;
}

export interface NoteElencoSoci {
  'nota-elenco-soci'?: NotaElencoSoci[];
}

/** simpleContent: testo + attributo c */
export interface NotaPartecipazione {
  '#text'?: string;
  c?: string;
}

export interface NotePartecipazione {
  'nota-partecipazione'?: NotaPartecipazione[];
}

// =============================================================================
// O
// =============================================================================

export interface Omologazione {
  'dt-omologazione'?: string;
  n?: string;
}

export interface OrganiControlloInCarica {
  'forma-amministrativa-in-carica'?: FormaAmministrativaInCarica[];
}

// =============================================================================
// P
// =============================================================================

export interface Panificatori {
  'caratteristiche-impianto-1'?: CaratteristicheImpianto1;
  'caratteristiche-impianto-2'?: CaratteristicheImpianto2;
  apparecchi?: Apparecchi;
}

export interface Parametri {
  'id-richiesta'?: string;
  'sigla-cciaa'?: string;
  'testata-cciaa'?: string;
  'titolo-documento'?: string;
  'frase-documento'?: string;
  'dt-estrazione'?: string;
}

export interface Partecipata {
  'quote-diritti-impresa'?: QuoteDirittiImpresa;
  'note-partecipazione'?: NotePartecipazione;
  'c-fiscale'?: string;
  denominazione?: string;
  'f-consorzio'?: string;
  'f-cooperativa'?: string;
  'f-cessata'?: string;
  'dt-cancellazione'?: string;
  'dt-inizio-partecipazione'?: string;
  'dt-fine-partecipazione'?: string;
}

export interface Partecipazione {
  'estremi-impresa'?: EstremiImpresa;
  'estremi-pratica'?: EstremiPratica;
  'capitale-sociale'?: CapitaleSociale;
  riquadri?: Riquadri;
  'f-ultimo-elenco-soci'?: string;
  'f-paragrafo-attuale'?: string;
  'f-info-incompleta'?: string;
}

/** simpleContent: testo + attributo */
export interface PartecipazioneUtili {
  '#text'?: string;
  'p-partecipazione'?: string;
}

export interface Partecipazioni {
  partecipazione?: Partecipazione[];
  'f-presenza-info'?: string;
}

/** simpleContent: testo + attributi */
export interface PartitaIva {
  '#text'?: string;
  'c-fonte-cess'?: string;
  'dt-ultimo-aggiornamento'?: string;
  'dt-cessazione'?: string;
}

export interface PatrimonioSpecificoAffare {
  costituzione?: string;
  modifica?: Modifica;
  cessazione?: string;
}

export interface PattiParasociali {
  'esercizio-diritto-voto'?: string;
  'trasferimento-azioni-partecip'?: string;
  'esercizio-influenza-dominante'?: string;
  altro?: string;
}

export interface Persona {
  'persona-fisica'?: PersonaFisica;
  'persona-giuridica'?: PersonaGiuridica;
  'informazioni-socio'?: InformazioniSocio;
  'indirizzo-posta-certificata'?: string;
  indirizzo?: Indirizzo;
  'indirizzo-ri'?: IndirizzoRi;
  telefono?: Telefono;
  telefax?: Telefax;
  quota?: Quota;
  'atti-conferimento-cariche'?: AttiConferimentoCariche;
  fallimento?: Fallimento;
  'abilitazioni-impiantisti'?: AbilitazioniImpiantisti;
  'ruoli-persona'?: RuoliPersona;
  licenze?: Licenze;
  progressivo?: string;
  'f-rappresentante-rea'?: string;
  'f-rappresentante-ri'?: string;
  'f-rappresentante-ae'?: string;
  'f-amministratore'?: string;
  'f-sindaco'?: string;
  'f-elettore'?: string;
  'tipo-modifica'?: string;
  cognome?: string;
  nome?: string;
  'c-fiscale'?: string;
  cciaa?: string;
  'n-rd'?: string;
  'n-rea'?: string;
  'f-firma-depositata'?: string;
  'f-incaricato-pco'?: string;
}

export interface PersonaFisica {
  'estremi-nascita'?: EstremiNascita;
  'domicilio-fiscale'?: DomicilioFiscale;
  'titoli-onorifici'?: TitoliOnorifici;
  cognome?: string;
  nome?: string;
  'c-fiscale'?: string;
  sesso?: string;
  'c-cittadinanza'?: string;
  cittadinanza?: string;
  'c-capacita-di-agire'?: string;
  'capacita-di-agire'?: string;
  'c-titolo-studio'?: string;
  'titolo-studio'?: string;
  'c-precedente-occupazione'?: string;
  'precedente-occupazione'?: string;
}

export interface PersonaGiuridica {
  'n-rea'?: string;
  'n-rd'?: string;
  cciaa?: string;
  denominazione?: string;
  'denominazione-ri'?: string;
  'c-fiscale'?: string;
  'dt-costituzione'?: string;
  'c-stato-costituzione'?: string;
  'stato-costituzione'?: string;
}

export interface PersonaGiuridicaPrivata {
  registro?: string;
  ente?: string;
  n?: string;
  'dt-iscrizione'?: string;
  'f-accertamento-requisiti'?: string;
}

export interface Persone {
  persona?: Persona[];
}

export interface PersonePco {
  persona?: Persona[];
}

export interface PotenzaCerealiMacchinari {
  macchinari?: Macchinari;
  'quintali-potenza-nominale'?: string;
  'quintali-potenza-reale'?: string;
  'tipo-cereale'?: string;
  'altro-tipo-cereale'?: string;
}

export interface PotenzeCerealiMacchinari {
  'potenza-cereali-macchinari'?: PotenzaCerealiMacchinari[];
}

/** simpleContent: testo (denominazione carica) + attributi */
export interface PoteriCarica {
  '#text'?: string;
  'c-carica'?: string;
  carica?: string;
}

/** simpleContent: testo + attributo */
export interface PoteriPersona {
  '#text'?: string;
  'p-poteri'?: string;
}

export interface Poteri {
  'poteri-statuto'?: string;
  'poteri-carica'?: PoteriCarica[];
  'poteri-patti-sociali'?: string;
  'poteri-soci'?: string;
  'poteri-congiunti'?: string;
  'limitazioni-responsabilita'?: LimitazioniResponsabilita;
  'ripartizioni-utili-perdite'?: RipartizioniUtiliPerdite;
}

export interface PraticaSoggettiControllanti {
  'estremi-pratica'?: EstremiPratica;
  'soggetti-controllanti'?: SoggettiControllanti;
  note?: string[];
}

export interface PraticheAnno {
  'dt-inizio'?: string;
  n?: string;
}

export interface PraticheSoggettiControllanti {
  'pratica-soggetti-controllanti'?: PraticaSoggettiControllanti[];
  'f-presenza-info'?: string;
}

export interface PresentazioneCciaa {
  'dt-presentazione'?: string;
  'n-protocollo'?: string;
}

export interface ProceduraConcorsuale {
  'estremi-atto'?: EstremiAtto;
  dichiarazioni?: Dichiarazioni;
  'comunicazioni-curatore'?: ComunicazioniCuratore;
  cl?: string;
  'c-tipo'?: string;
  tipo?: string;
  'dt-iscrizione-procedura'?: string;
  'dt-provvedimento'?: string;
  'dt-atto'?: string;
  'dt-termine'?: string;
  'dt-omologazione'?: string;
  'dt-chiusura'?: string;
  'dt-esecuzione'?: string;
  'dt-revoca'?: string;
  'dt-udienza'?: string;
}

export interface ProcedureConcorsuali {
  'procedura-concorsuale'?: ProceduraConcorsuale[];
  'comunicazioni-curatore'?: ComunicazioniCuratore;
  'informazioni-curatore'?: string;
  'accordi-debiti'?: string;
  'rapporto-curatore'?: string;
  'appelli-reclami'?: string;
  'proposta-concordato'?: string;
  'esercizio-provvisorio'?: string;
  'continuazione-esercizio-provv'?: string;
  'cessazione-esercizio-provv'?: string;
  'esecuzione-concordato'?: string;
  'annotazioni-procedure'?: string;
  dichiarazioni?: Dichiarazioni;
  'persone-pco'?: PersonePco;
  'f-presenza-info'?: string;
  'cciaa-fuori-provincia'?: string;
}

export interface ProLocalizzazioni {
  'pro-localizzazione'?: string[];
}

/** simpleContent: testo + attributo */
export interface ProprietaQuota {
  '#text'?: string;
  'p-proprieta'?: string;
}

export interface Protocolli {
  protocollo?: Protocollo[];
}

export interface ProtocolliAperti {
  'protocollo-aperto'?: ProtocolloAperto[];
  'f-presenza-info'?: string;
}

export interface ProtocolliCompleti {
  protocolli?: Protocolli;
  'trascrizioni-prot-completi'?: TrscrizioniProtCompleti;
  'f-presenza-info'?: string;
  'dt-estrazione'?: string;
  'dt-lunedi-precedente'?: string;
  'dt-domenica-precedente'?: string;
}

export interface ProtocolliRi {
  'protocollo-ri'?: ProtocolloRi[];
}

export interface ProtocolliRs {
  'protocollo-rs'?: ProtocolloRs[];
}

export interface Protocollo {
  modelli?: Modelli;
  atti?: Atti;
  'c-albo'?: string;
  'c-stato-avanzamento'?: string;
  'stato-avanzamento'?: string;
  'c-stato-pratica'?: string;
  'stato-pratica'?: string;
  'cciaa-intercamerale'?: string;
  'dt-protocollo'?: string;
  'dt-ultima-modifica'?: string;
  anno?: string;
  n?: string;
  'adempimento-comunica'?: string;
  'enti-destinatari'?: string;
}

export interface ProtocolloAperto {
  note?: string[];
  modelli?: Modelli;
  atti?: Atti;
  'c-albo'?: string;
  'c-stato-avanzamento'?: string;
  'stato-avanzamento'?: string;
  'c-stato-pratica'?: string;
  'stato-pratica'?: string;
  'cciaa-intercamerale'?: string;
  'dt-protocollo'?: string;
  'dt-ultima-modifica'?: string;
  anno?: string;
  n?: string;
  'adempimento-comunica'?: string;
  'enti-destinatari'?: string;
}

export interface ProtocolloRi {
  'modelli-trascrizioni'?: ModelliTrascrizioni;
  'atti-trascrizioni'?: AttiTrascrizioni;
  'n-protocollo'?: string;
  'n-protocollo-ufficio'?: string;
  anno?: string;
  'dt-protocollo'?: string;
  'n-comunicazione-intercamerale'?: string;
  'n-protocollo-intercamerale'?: string;
  'anno-comunicazione-intercam'?: string;
  'anno-protocollo-intercam'?: string;
  'cf-impresa'?: string;
  'denom-cciaa'?: string;
  'f-atto-pre-iscrizione'?: string;
  'dt-denuncia'?: string;
}

export interface ProtocolloRs {
  atto?: Atto;
  'trascrizioni-rs'?: TrscrizioniRs;
  'n-riferimento'?: string;
  'n-registro-ordine'?: string;
  'anno-registro-ordine'?: string;
  'c-comune-tribunale'?: string;
  tribunale?: string;
  'provincia-tribunale'?: string;
}

export interface ProvenienzaTrasferimento {
  'dt-trasferimento'?: string;
  cciaa?: string;
  'n-rea'?: string;
  'n-rd'?: string;
  'n-aa'?: string;
}

// =============================================================================
// Q
// =============================================================================

export interface Qualifica {
  c?: string;
}

export interface Qualifiche {
  qualifica?: Qualifica;
}

export interface Quota {
  'c-valuta'?: string;
  valuta?: string;
  valore?: string;
  'ammontare-convertito-in-euro'?: string;
  percentuale?: string;
}

export interface QuotaDiritto {
  'c-tipo-diritto'?: string;
  'tipo-diritto'?: string;
  'n-azioni'?: string;
  'valore-nominale'?: string;
  'percentuale-capitale'?: string;
}

export interface QuoteDiritti {
  'quota-diritto'?: QuotaDiritto[];
}

// =============================================================================
// R
// =============================================================================

export interface RatingLegalita {
  'c-fonte'?: string;
  'dt-ultimo-aggiornamento'?: string;
  punteggio?: string;
  identificativo?: string;
  'dt-rinnovo'?: string;
}

export interface Registrazione {
  'dt-registrazione'?: string;
  n?: string;
  'ufficio-registro'?: string;
  'provincia-ufficio-registro'?: string;
}

export interface RegistroPreziosi {
  qualifica?: Qualifica;
  qualifiche?: Qualifiche;
  'autorizzazione-ps'?: AutorizzazionePs;
  'tassa-cg'?: TassaCg;
  marchio?: string;
  'cancellazione-ruolo'?: CancellazioneRuolo;
  n?: string;
  'dt-domanda'?: string;
}

export interface RequisitoMoraleProfessionale {
  'c-tipo'?: string;
  tipo?: string;
  'c-stato'?: string;
  stato?: string;
  'c-ente'?: string;
  ente?: string;
  'dt-denuncia'?: string;
  'dt-accertamento'?: string;
  'dt-decadenza'?: string;
  'ulteriori-specifiche'?: string;
}

export interface RequisitiMoraliProfessionali {
  'requisito-morale-professionale'?: RequisitoMoraleProfessionale[];
}

export interface ReteImprese {
  'impresa-riferimento'?: ImpresaRiferimento;
  'n-repertorio'?: string;
  'n-registrazione'?: string;
  denominazione?: string;
  'c-fiscale'?: string;
}

export interface RetiImprese {
  'rete-imprese'?: ReteImprese[];
}

export interface Riferimenti {
  clausole?: Clausole;
  'modifiche-statutarie'?: string;
  'deposito-statuto'?: string;
  'modifica-statuto'?: string;
  'aggregazione-imprese'?: string;
  'provvedimenti-giudice'?: string;
  'effetti-differiti'?: string;
  arbitrato?: string;
  'condizioni-sospensive'?: string;
  'provvedimenti-conservatore'?: string;
  'provvedimenti-autorita'?: string;
  'gruppi-societari'?: string;
  'accordi-partecipazione'?: string;
  'contratto-rete'?: string;
  'atti-tradotti'?: string;
  'dichiarazioni-start-up'?: DichiarazioniStartUp;
  'dichiarazioni-incubatore'?: DichiarazioniIncubatore;
  'dichiarazioni-pmi'?: DichiarazioniPmi;
  'dichiarazioni-scuola-lavoro'?: DichiarazioniScuolaLavoro;
}

/** simpleContent: testo + attributo */
export interface RiconoscimentoProfessionale {
  '#text'?: string;
  'dt-provvedimento'?: string;
  'n-iscrizione'?: string;
}

export interface RiconoscimentiProfessionali {
  'riconoscimento-professionale'?: RiconoscimentoProfessionale[];
}

export interface Riquadri {
  riquadro?: Riquadro[];
}

export interface RiquadriTrasferimento {
  'riquadro-trasferimento'?: RiquadroTrasferimento[];
}

export interface Riquadro {
  'tipo-atto'?: TipoAtto;
  'composizione-quote'?: ComposizioneQuote;
  'vincoli-quote'?: string[];
  titolari?: Titolari;
  'diritti-partecipazione'?: DirittiPartecipazione;
  note?: string[];
  c?: string;
  'n-ricorrenze'?: string;
  'dt-annotazione'?: string;
  'dt-evento'?: string;
}

export interface RiquadroTrasferimento {
  'tipo-atto'?: TipoAtto;
  'composizione-quote'?: ComposizioneQuote;
  'vincoli-quote'?: string[];
  titolari?: Titolari;
  note?: string[];
  'dt-annotazione'?: string;
  'dt-evento'?: string;
}

/** simpleContent: testo + attributo */
export interface RipartizioniUtiliPerdite {
  '#text'?: string;
  'f-presenza-nello-statuto'?: string;
}

export interface Ruoli {
  ruolo?: Ruolo[];
}

export interface RuoliPersona {
  'ruolo-persona'?: RuoloPersona[];
}

export interface Ruolo {
  'cancellazione-ruolo'?: CancellazioneRuolo;
  'c-tipo'?: string;
  tipo?: string;
  'c-categoria'?: string;
  categoria?: string;
  'c-qualifica'?: string;
  qualifica?: string;
  'c-forma'?: string;
  forma?: string;
  n?: string;
  'dt-iscrizione'?: string;
  'c-ente-rilascio'?: string;
  'ente-rilascio'?: string;
  provincia?: string;
}

/** simpleContent: testo + attributo c */
export interface RuoloPartecipazione {
  '#text'?: string;
  c?: string;
}

export interface RuoloPersona {
  'f-sezione-rea'?: string;
  'c-tipo'?: string;
  tipo?: string;
  'c-categoria'?: string;
  categoria?: string;
  'c-qualifica'?: string;
  qualifica?: string;
  'c-forma'?: string;
  forma?: string;
  n?: string;
  'dt-iscrizione'?: string;
  'c-ente-rilascio'?: string;
  'ente-rilascio'?: string;
  provincia?: string;
}

export interface Runts {
  sezioni?: Sezioni;
  id?: string;
}

// =============================================================================
// S
// =============================================================================

export interface ScadenzaEsercizi {
  'dt-primo-esercizio'?: string;
  'esercizi-successivi'?: string;
  'mesi-proroga-bilancio'?: string;
  'giorni-proroga-bilancio'?: string;
}

export interface SedeFuoriProvincia {
  'n-rea'?: string;
  'n-rd'?: string;
  'n-aa'?: string;
  cciaa?: string;
}

export interface SedeSecondariaRs {
  'n-sede-secondaria'?: string;
  'c-comune-tribunale'?: string;
  'comune-tribunale'?: string;
  'provincia-tribunale'?: string;
  'dt-iscrizione'?: string;
}

export interface SessioneAa {
  modifiche?: Modifiche[];
  'c-movimentazione'?: string;
  movimentazione?: string;
  'dt-delibera'?: string;
  'dt-domanda-accertamento'?: string;
}

export interface SessioneRdRea {
  modifiche?: Modifiche;
  'c-movimentazione'?: string;
  movimentazione?: string;
  'dt-denuncia'?: string;
}

export interface SessioniAa {
  'sessione-aa'?: SessioneAa[];
  'dt-iscrizione'?: string;
}

export interface SessioniRdRea {
  'sessione-rd-rea'?: SessioneRdRea[];
}

/** simpleContent: testo + attributo c */
export interface Settore {
  '#text'?: string;
  c?: string;
}

export interface Settori {
  settore?: Settore[];
}

/** simpleContent: testo + attributo c */
export interface SettoreAttivita {
  '#text'?: string;
  c?: string;
}

export interface SettoriAttivita {
  'settore-attivita'?: SettoreAttivita[];
}

export interface Sezione {
  c?: string;
  descrizione?: string;
  'dt-iscrizione'?: string;
  'dt-ultima-comunicazione'?: string;
  'f-coltivatore-diretto'?: string;
  'cciaa-aa'?: string;
  'n-aa'?: string;
  'f-attesa-decisione'?: string;
  'dt-decorrenza'?: string;
}

export interface Sezioni {
  sezione?: Sezione[];
}

export interface SintesiAttivita {
  'attivita-prevalente-r'?: string;
  'attivita-esercitata-r'?: string;
  'attivita-agricola-r'?: string;
  'attivita-aa-r'?: string;
  'classificazione-ateco'?: ClassificazioneAteco;
  'f-import-export'?: string;
  'f-albi-ruoli-licenze'?: string;
  'f-contratto-rete'?: string;
  'f-attestazioni-soa'?: string;
  'f-certificazioni-qualita'?: string;
  'f-albi-registri-ambientali'?: string;
  'dt-inizio'?: string;
  'punteggio-rating-legalita'?: string;
}

export interface SintesiCifreImpresa {
  'pratiche-anno'?: PraticheAnno;
  'capitale-investito'?: CapitaleInvestito;
  'fondo-consortile'?: FondoConsortile;
  'valore-nominale-conferimenti'?: ValoreNominaleConferimenti;
  'capitale-sociale'?: CapitaleSociale;
  'dati-bilancio'?: DatiBilancio;
  'n-localizzazioni'?: string;
  'n-amministratori'?: string;
  'n-sindaci'?: string;
  'n-titolari-cariche'?: string;
  'n-soci'?: string;
  'n-addetti'?: string;
  'dt-addetti'?: string;
  'n-trasferimenti-sede'?: string;
  'n-trasferimenti-quote'?: string;
  'f-partecipazioni'?: string;
  'f-partecipazioni-sto'?: string;
  'f-controllata'?: string;
  'n-protocolli-aperti'?: string;
}

/** simpleContent: testo + attributo c */
export interface SistemaAmministrazione {
  '#text'?: string;
  c?: string;
}

export interface Soci {
  socio?: Socio[];
}

export interface Socio {
  'anagrafica-titolare'?: AnagraficaTitolare;
  'quote-diritti'?: QuoteDiritti;
}

export interface SociTrasferimentoQuote {
  'f-presenza-info'?: string;
}

export interface SocietaCooperativa {
  'dt-presentazione'?: string;
  'n-iscrizione'?: string;
  'dt-iscrizione'?: string;
  'c-sezione'?: string;
  sezione?: string;
  'c-sotto-sezione'?: string;
  'sotto-sezione'?: string;
  'c-categoria'?: string;
  categoria?: string;
  'c-categoria-attivita-eserc'?: string;
  'categoria-attivita-esercitata'?: string;
  'c-tipo-forma-amministrativa'?: string;
  'n-soci'?: string;
}

export interface SocietaQuotata {
  'anno-dal'?: string;
  'anno-al'?: string;
  mercato?: string;
  'c-fonte'?: string;
  fonte?: string;
  'dt-ultimo-aggiornamento'?: string;
  'dt-ultimo-deposito-es'?: string;
}

export interface SoggettiControllanti {
  'soggetto-controllante'?: SoggettoControllante[];
}

export interface SoggettoControllante {
  note?: string[];
  denominazione?: string;
  'c-fiscale'?: string;
  'dt-costituzione'?: string;
  'c-stato'?: string;
  stato?: string;
  cciaa?: string;
  'n-rea'?: string;
  'dt-riferimento'?: string;
  'c-tipo-dichiarazione'?: string;
  'tipo-dichiarazione'?: string;
  'c-tipo-controllo'?: string;
  'tipo-controllo'?: string;
}

/** simpleContent: testo + attributo c */
export interface SoggettoControlloContabile {
  '#text'?: string;
  c?: string;
}

export interface SottoTipi {
  'sotto-tipo'?: SottoTipo[];
}

/** simpleContent: testo + attributo c */
export interface SottoTipo {
  '#text'?: string;
  c?: string;
}

export interface Stoccaggio {
  magazzini?: string;
  silos?: string;
}

export interface StoriaAddetti {
  'addetti-impresa'?: AddettiImpresa[];
}

export interface StoriaAttivita {
  'classificazioni-ateco-2002'?: ClassificazioniAteco2002;
  'classificazioni-ateco'?: ClassificazioniAteco[];
}

export interface StoriaCciaaProvenienza {
  mad?: Mad;
  trascrizioni?: Trascrizioni;
  cciaa?: string;
}

export interface StoriaSedePrecedente {
  mad?: Mad;
  trascrizioni?: Trascrizioni;
  cciaa?: string;
  'n-rea'?: string;
}

export interface StoriaSediPrecedenti {
  'storia-sede-precedente'?: StoriaSedePrecedente[];
}

export interface StrumentiFinanziari {
  'azioni-ordinarie'?: string;
  'altre-azioni'?: string;
  obbligazioni?: string;
  'obbligazioni-convertibili'?: string;
  'titoli-debito'?: string;
  'altri-strumenti'?: string;
}

export interface Subentri {
  subentro?: Subentro[];
}

export interface SubentriImpresa {
  'impresa-subentrata'?: ImpresaSubentrata;
  subentri?: Subentri;
  'impresa-subentrante'?: ImpresaSubentrante;
}

export interface Subentro {
  'c-tipo'?: string;
  tipo?: string;
  denominazione?: string;
  'c-fiscale'?: string;
  cciaa?: string;
  'n-rea'?: string;
  'n-ri'?: string;
  'c-titolo'?: string;
  titolo?: string;
}

// =============================================================================
// T
// =============================================================================

export interface TaFusioniScissioniSubentri {
  'trasferimenti-azienda'?: TrasferimentiAzienda;
  'fusioni-scissioni'?: FusioniScissioni;
  dichiarazioni?: Dichiarazioni;
  'subentri-impresa'?: SubentriImpresa;
  'f-presenza-info'?: string;
}

export interface TabellaElencoSoci {
  soci?: Soci;
  'note-elenco-soci'?: NoteElencoSoci;
}

/** simpleContent: testo + attributi */
export interface TabelleSpeciali {
  '#text'?: string;
  'f-farmacia'?: string;
  'f-vendita-generi-monopolio'?: string;
  'f-vendita-carburanti'?: string;
  mq?: string;
}

export interface TassaCg {
  n?: string;
  dt?: string;
}

/** simpleContent: testo + attributo c */
export interface TipoAtto {
  '#text'?: string;
  c?: string;
}

/** simpleContent: testo + attributo c */
export interface TipoConferimenti {
  '#text'?: string;
  c?: string;
}

/** simpleContent: testo + attributi */
export interface TipoTrascrizione {
  '#text'?: string;
  'c-tipo-trascrizione'?: string;
  'c-tipo-modifica'?: string;
  'tipo-modifica'?: string;
}

export interface Titolare {
  'anagrafica-titolare'?: AnagraficaTitolare;
  domicilio?: Domicilio;
  'domicilio-ri'?: DomicilioRi;
  'indirizzo-posta-certificata'?: string;
  'diritto-partecipazione'?: DirittoPartecipazione;
  note?: string[];
  'c-situazione'?: string;
  situazione?: string;
  'c-tipo'?: string;
  tipo?: string;
  'f-rappresentante'?: string;
}

export interface Titolari {
  titolare?: Titolare[];
  note?: string[];
}

export interface TitoliOnorifici {
  'titolo-onorifico'?: TitoloOnorifico[];
}

/** simpleContent: testo + attributo c */
export interface TitoloOnorifico {
  '#text'?: string;
  c?: string;
}

export interface TrscrizioneProtCompleti {
  'progressivo-trascrizione'?: string;
  'dt-iscrizione'?: string;
  'c-tipo-trascrizione'?: string;
  'tipo-trascrizione'?: string;
}

export interface TrscrizioneRi {
  persona?: Persona;
  'tipo-trascrizione'?: TipoTrascrizione;
  descrizioni?: Descrizioni;
  'iscrizione-modifica'?: IscrizioneModifica;
  'p-trascrizione'?: string;
  'c-tipo-modifica'?: string;
  'tipo-modifica'?: string;
}

export interface TrscrizioneRs {
  persona?: Persona;
  'tipo-trascrizione'?: TipoTrascrizione;
  descrizioni?: Descrizioni;
  'p-trascrizione'?: string;
  'c-tipo-modifica'?: string;
  'tipo-modifica'?: string;
}

export interface Trascrizioni {
  'protocolli-rs'?: ProtocolliRs;
  'protocolli-ri'?: ProtocolliRi;
}

export interface TrscrizioniProtCompleti {
  'trascrizione-prot-completi'?: TrscrizioneProtCompleti[];
}

export interface TrscrizioniRi {
  'trascrizione-ri'?: TrscrizioneRi[];
}

export interface TrscrizioniRs {
  'trascrizione-rs'?: TrscrizioneRs[];
}

export interface Trasferimenti {
  trasferimento?: Trasferimento[];
}

export interface TrasferimentiAzienda {
  'trasferimento-azienda'?: TrasferimentoAzienda[];
}

export interface TrasferimentiQuote {
  'trasferimento-quote'?: TrasferimentoQuote[];
  'f-successivi-ultimo-es'?: string;
  'f-tutti'?: string;
  'f-presenza-info'?: string;
}

export interface Trasferimento {
  'estremi-impresa'?: EstremiImpresa;
  'estremi-pratica'?: EstremiPratica;
  riquadri?: Riquadri;
  'f-successivo-ultimo-es'?: string;
}

export interface TrasferimentoAltroRegistro {
  'c-tipo'?: string;
  tipo?: string;
}

export interface TrasferimentoAzienda {
  'estremi-pratica'?: EstremiPratica;
  'informazioni-atto'?: InformazioniAtto;
  note?: string[];
}

export interface TrasferimentoLocalizzazione {
  comune?: string;
  provincia?: string;
}

export interface TrasferimentoQuote {
  'estremi-pratica'?: EstremiPratica;
  'riquadri-trasferimento'?: RiquadriTrasferimento;
  note?: string[];
  'f-contestuale'?: string;
}

export interface TrasferimentoSede {
  comune?: string;
  provincia?: string;
  'c-toponimo'?: string;
  toponimo?: string;
  via?: string;
  'n-civico'?: string;
  'n-rea'?: string;
  'n-rd'?: string;
  'n-aa'?: string;
}

export interface TrasferimentoSedeUlAttiva {
  'c-causale'?: string;
  causale?: string;
  dt?: string;
}

// =============================================================================
// U
// =============================================================================

export interface UlterioriDettagli {
  'ulteriore-dettaglio'?: UlterioreDettaglio[];
}

/** simpleContent: testo + attributi */
export interface UlterioreDettaglio {
  '#text'?: string;
  'c-tipo'?: string;
  tipo?: string;
}

// =============================================================================
// V
// =============================================================================

export interface ValoreNominaleConferimenti {
  'c-valuta'?: string;
  valuta?: string;
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

export interface ValoriMedi {
  'valore-medio-dipendenti'?: string;
  'valore-medio-indipendenti'?: string;
  'valore-medio-totale'?: string;
  'valore-medio-collaboratori'?: string;
}

export interface VariazioneFormaGiuridica {
  'estremi-atto'?: EstremiAtto;
  'p-variazione'?: string;
  'c-old'?: string;
  old?: string;
  'c-new'?: string;
  new?: string;
  'dt-atto'?: string;
}

export interface VariazioniFormaGiuridica {
  'variazione-forma-giuridica'?: VariazioneFormaGiuridica[];
}

export interface Versato {
  ammontare?: string;
  'ammontare-convertito-in-euro'?: string;
}

// =============================================================================
// Clausole (referenced by Riferimenti)
// =============================================================================

/** simpleContent: testo + attributo */
export interface ClausolaConFlagStatuto {
  '#text'?: string;
  'f-presenza-nello-statuto'?: string;
}

export interface Clausole {
  recesso?: ClausolaConFlagStatuto;
  esclusione?: ClausolaConFlagStatuto;
  gradimento?: ClausolaConFlagStatuto;
  prelazione?: ClausolaConFlagStatuto;
  limitazione?: ClausolaConFlagStatuto;
  compromissorie?: ClausolaConFlagStatuto;
  altre?: ClausolaConFlagStatuto;
}

// =============================================================================
// Descrizioni (referenced by multiple types)
// =============================================================================

export interface Descrizioni {
  descrizione?: string[];
}

/** simpleContent: testo + attributo */
export interface LimitazioniResponsabilita {
  '#text'?: string;
  'f-presenza-nello-statuto'?: string;
}

// =============================================================================
// AlbiRuoliLicenze (referenced by BlocchiImpresa and Localizzazione)
// =============================================================================

export interface AlbiRuoliLicenze {
  'dati-artigiani'?: DatiArtigiani;
  'riconoscimenti-professionali'?: RiconoscimentiProfessionali;
  'abilitazioni-impiantisti'?: AbilitazioniImpiantisti;
  'abilitazione-pulizia'?: AbilitazionePulizia;
  'abilitazione-facchinaggio'?: AbilitazioneFacchinaggio;
  ruoli?: Ruoli;
  'registro-preziosi'?: RegistroPreziosi;
  'denunce-inizio-attivita'?: DenunceInizioAttivita;
  licenze?: Licenze;
  'requisiti-morali-professionali'?: RequisitiMoraliProfessionali;
  'commercio-dettaglio'?: CommercioDettaglio;
  'societa-cooperativa'?: SocietaCooperativa;
  'albo-regionale-coop-sociali'?: AlboRegionaleCoopSociali;
  'assegnatari-marchio'?: AssegnatariMarchio;
  'dichiarazioni-ambientali'?: DichiarazioniAmbientali;
}

export interface AlboRegionaleCoopSociali {
  sezioni?: Sezioni;
  'aree-intervento'?: AreeIntervento;
  'desc-albo'?: string;
  'dt-iscrizione'?: string;
  'dt-cancellazione'?: string;
}

// =============================================================================
// Bilanci (XBRL)
// =============================================================================

/**
 * Parsed XBRL document for financial statements.
 * Designed for namespaced tags like `itcc-ci:*`, `itcc-ci-abb:*`, `xbrli:*`.
 */
export interface BilancioXbrlData {
  xbrl: XbrlDocument;
}

export interface XbrlDocument {
  'link:schemaRef'?: XmlOneOrMany<XbrlSchemaRef>;
  context?: XmlOneOrMany<XbrlContext>;
  unit?: XmlOneOrMany<XbrlUnit>;
  [factQName: `${string}:${string}`]:
    | XmlOneOrMany<XbrlFact>
    | XmlOneOrMany<XbrlSchemaRef>
    | XmlOneOrMany<XbrlContext>
    | XmlOneOrMany<XbrlUnit>
    | undefined;
}

export interface XbrlSchemaRef {
  'xlink:type'?: string;
  'xlink:href'?: string;
  'xlink:arcrole'?: string;
}

export interface XbrlContext {
  entity?: XbrlEntity;
  period?: XbrlPeriod;
  scenario?: XbrlScenario;
  id?: string;
}

export interface XbrlEntity {
  identifier?: XbrlIdentifier;
}

export interface XbrlIdentifier {
  '#text'?: string;
  scheme?: string;
}

export interface XbrlPeriod {
  instant?: string;
  startDate?: string;
  endDate?: string;
}

export interface XbrlScenario {
  'itcc-ci-abb:scen'?: string;
}

export interface XbrlUnit {
  measure?: string;
  id?: string;
}

/**
 * Generic XBRL fact with value (`#text`) and standard XBRL attributes.
 */
export interface XbrlFact extends XmlTextValue {
  contextRef?: string;
  unitRef?: string;
  decimals?: string;
}
