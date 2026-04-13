export interface Riconoscimento {
  IdentificativoPosizione: string;
  OutputRestituiti: string;
}

export interface Indirizzo {
  via: string;
  'n-civico': string;
  comune: string;
  provincia: string;
  cap: string;
}

export interface PersonaRappresentante {
  cognome: string;
  nome: string;
  carica: string;
  'f-rappresentante-ri'?: 'S' | 'N';
}

export interface DatiIdentificativi {
  'stato-attivita': { c: string; '#text': string };
  'forma-giuridica': { c: string; '#text': string };
  'indirizzo-localizzazione': {
    'c-comune': string;
    comune: string;
    provincia: string;
    'c-toponimo': string;
    toponimo: string;
    via: string;
    'n-civico': string;
    cap: string;
  };
  'indirizzo-posta-certificata': string;
  'persone-rappresentanti': {
    'persona-rappresentante': PersonaRappresentante[];
  };
  'f-sede-intercamerale': 'S' | 'N';
  'c-fonte': string;
  fonte: string;
  'tipo-soggetto': string;
  'descrizione-tipo-soggetto': string;
  'tipo-impresa': string;
  'descrizione-tipo-impresa': string;
  'dt-iscrizione-ri': string;
  'dt-atto-costituzione': string;
  'dt-ultimo-protocollo': string;
  'dt-mod-ultimo-protocollo-evaso': string;
  denominazione: string;
  'c-fiscale': string;
  'partita-iva': string;
  'c-cciaa-competente': string;
  cciaa: string;
  'cciaa-competente': string;
  'n-rea': string;
}

export interface SintesiAttivita {
  'attivita-prevalente-r': string;
  'classificazione-ateco': { 'c-attivita': string; 'c-nace': string };
  'dt-inizio': string;
}

export interface CapitaleSociale {
  ammontare: string;
  'c-valuta'?: string;
  valuta?: string;
  sottoscritto?: { ammontare: string };
  versato?: { ammontare: string };
}

export interface SintesiCifreImpresa {
  'pratiche-anno': { 'dt-inizio': string; n: string };
  'capitale-sociale': CapitaleSociale;
  'n-localizzazioni': string;
  'n-amministratori': string;
  'n-sindaci': string;
  'n-titolari-cariche': string;
  'n-soci': string;
  'dt-addetti': string;
  'n-addetti': string;
  'n-trasferimenti-sede': string;
  'n-trasferimenti-quote': string;
}

export interface AnagraficaTitolare {
  tipo: 'PERSONA' | 'IMPRESA' | string;
  'c-tipo'?: string;
  'c-fiscale': string;
  denominazione: string;
  nome?: string;
  cognome?: string;
}

export interface Titolare {
  'f-rappresentante': 'S' | 'N';
  domicilio?: Indirizzo;
  'anagrafica-titolare': AnagraficaTitolare;
  'diritto-partecipazione'?: { 'c-tipo': string; tipo: string };
}

export interface ComposizioneQuote {
  'c-valuta': string;
  valuta: string;
  'valore-nominale': string;
  'valore-versato': string;
}

export interface Riquadro {
  'composizione-quote': ComposizioneQuote;
  titolari: { titolare: Titolare[] | Titolare };
}

export interface ElencoSoci {
  'capitale-sociale': CapitaleSociale;
  riquadri: { riquadro: Riquadro[] | Riquadro };
  'dt-soci-titolari-al': string;
  'f-ultimo-elenco-soci': 'S' | 'N';
}

export interface TabellaElencoSoci {
  soci: {
    socio: Array<{
      anagrafica_titolare: AnagraficaTitolare;
      'quote-diritti': Array<{
        'quota-diritto': {
          'c-tipo-diritto': string;
          'tipo-diritto': string;
          'valore-nominale': string;
          'percentuale-capitale': string;
        };
      }>;
    }>;
  };
}

export interface TrasferimentoQuote {
  'trasferimento-quote': Array<{
    'estremi-pratica': {
      cciaa: string;
      anno: string;
      n: string;
      'dt-protocollo': string;
      'dt-deposito': string;
    };
    'f-contestuale'?: 'S' | 'N';
  }>;
  'f-successivi-ultimo-es': 'S' | 'N';
}

export interface BloccoImpresa {
  'dati-identificativi': DatiIdentificativi;
  'sintesi-attivita': SintesiAttivita;
  'sintesi-cifre-impresa': SintesiCifreImpresa;
  'elenco-soci': ElencoSoci;
  'tabella-elenco-soci': TabellaElencoSoci;
  'trasferimenti-quote': TrasferimentoQuote;
}

export interface CompanyData {
  Riconoscimento: Riconoscimento;
  'blocchi-impresa': BloccoImpresa;
}
