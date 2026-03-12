export interface Riconoscimento {
  IdentificativoPosizione: string | null;
  OutputRestituiti: string | null;
}

export interface Indirizzo {
  via?: string | null;
  'n-civico'?: string | null;
  comune?: string | null;
  provincia?: string | null;
  cap?: string | null;
  'c-toponimo'?: string | null;
  toponimo?: string | null;
}

export interface PersonaRappresentante {
  cognome: string | null;
  nome: string | null;
  carica: string | null;
  'f-rappresentante-ri'?: 'S' | 'N';
}

export interface DatiIdentificativi {
  'stato-attivita': { c: string | null; _: string };
  'forma-giuridica': { c: string | null; _: string };
  'indirizzo-localizzazione': Indirizzo;
  'indirizzo-posta-certificata': string | null;
  'persone-rappresentanti': {
    'persona-rappresentante': PersonaRappresentante[];
  };
  'f-sede-intercamerale': 'S' | 'N';
  'c-fonte': string | null;
  fonte: string | null;
  'tipo-soggetto': string | null;
  'descrizione-tipo-soggetto': string | null;
  'tipo-impresa': string | null;
  'descrizione-tipo-impresa': string | null;
  'dt-iscrizione-ri': string | null;
  'dt-atto-costituzione': string | null;
  'dt-ultimo-protocollo': string | null;
  'dt-mod-ultimo-protocollo-evaso': string | null;
  denominazione: string | null;
  'c-fiscale': string | null;
  'partita-iva': string | null;
  'c-cciaa-competente': string | null;
  cciaa: string | null;
  'cciaa-competente': string | null;
  'n-rea': string | null;
}

export interface SintesiAttivita {
  'attivita-prevalente-r': string | null;
  'classificazione-ateco': { 'c-attivita': string | null; 'c-nace': string };
  'dt-inizio': string | null;
}

export interface PersonaFisica {
  cognome: string | null;
  nome: string | null;
  'c-fiscale': string | null;
  sesso: string | null;
  'estremi-nascita': {
    dt: string | null;
    comune: string | null;
    provincia: string | null;
    'c-comune'?: string;
  };
  'domicilio-fiscale': Indirizzo;
}

export interface Carica {
  'p-carica': string | null;
  'c-carica': string | null;
  'dt-iscrizione': string | null;
  'dt-atto-nomina': string | null;
  'c-durata': string | null;
  'descrizione-durata': string | null;
  'dt-riferimento-bilancio': string | null;
  'dt-presentazione'?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface AttoConferimentoCariche {
  'p-gruppo-cariche': string | null;
  cariche: { carica: Carica[] };
}

export interface PersonaSede {
  progressivo: string | null;
  'f-rappresentante-ri'?: 'S' | 'N';
  'f-amministratore'?: 'S' | 'N';
  'f-sindaco'?: 'S' | 'N';
  'persona-fisica': PersonaFisica;
  'indirizzo-posta-certificata'?: string | null;
  'atti-conferimento-cariche': {
    'atto-conferimento-cariche': AttoConferimentoCariche[];
  };
}

export interface AmministrazioneControllo {
  'forme-amministrative-in-carica': {
    'forma-amministrativa-in-carica': {
      c: string | null;
      'n-amministratori-in-carica': string;
    };
  };
}

export interface BloccoImpresa {
  'dati-identificativi': DatiIdentificativi;
  'sintesi-attivita': SintesiAttivita;
  'persone-sede': { persona: PersonaSede[] };
  'amministrazione-controllo': AmministrazioneControllo;
}

export interface CompanyAdministrativeDataSummary {
  identification: CompanyIdentification;
  activitySummary: ActivitySummary;
  officePersons: { person: OfficePerson[] };
  administrationControl: AdministrationControl;
}

// ----------------------- Recognition -----------------------
export interface Recognition {
  positionId: string | null; // Original: IdentificativoPosizione
  returnedOutput: string | null; // Original: OutputRestituiti
}

// ----------------------- Address -----------------------
export interface Address {
  street?: string | null; // via
  streetNumber?: string | null; // n-civico
  city?: string | null; // comune
  province?: string | null; // provincia
  postalCode?: string | null; // cap
  topographyCode?: string | null; // c-toponimo
  topographyName?: string | null; // toponimo
}

// ----------------------- Company representative -----------------------
export interface CompanyRepresentative {
  lastName: string | null; // cognome
  firstName: string | null; // nome
  role: string | null; // carica
  isRegisteredRepresentative?: 'S' | 'N'; // f-rappresentante-ri
}

// ----------------------- Company basic info -----------------------
export interface CompanyIdentification {
  activityStatus: { text: string | null; code: string }; // stato-attivita
  legalForm: { text: string | null; code: string }; // forma-giuridica
  locationAddress: Address; // indirizzo-localizzazione
  certifiedEmail: string | null; // indirizzo-posta-certificata
  representatives: {
    representative: CompanyRepresentative | CompanyRepresentative[];
  }; // persone-rappresentanti
  isInterchamberOffice: 'S' | 'N'; // f-sede-intercamerale
  sourceCode: string | null; // c-fonte
  sourceName: string | null; // fonte
  subjectType: string | null; // tipo-soggetto
  subjectTypeDescription: string | null; // descrizione-tipo-soggetto
  companyType: string | null; // tipo-impresa
  companyTypeDescription: string | null; // descrizione-tipo-impresa
  registrationDate: string | null; // dt-iscrizione-ri
  constitutionDate: string | null; // dt-atto-costituzione
  lastProtocolDate: string | null; // dt-ultimo-protocollo
  lastProtocolProcessedDate: string | null; // dt-mod-ultimo-protocollo-evaso
  companyName: string | null; // denominazione
  taxCode: string | null; // c-fiscale
  vatNumber: string | null; // partita-iva
  chamberCode: string | null; // c-cciaa-competente
  chamberName: string | null; // cciaa-competente
  chamberAbbreviation: string | null; // cciaa
  reaNumber: string | null; // n-rea
}

// ----------------------- Activity summary -----------------------
export interface ActivitySummary {
  mainActivityDescription: string | null; // attivita-prevalente-r
  atecoClassification: { activityCode: string | null; naceCode: string }; // classificazione-ateco
  startDate: string | null; // dt-inizio
}

// ----------------------- Person info -----------------------
export interface PhysicalPerson {
  lastName: string | null;
  firstName: string | null;
  taxCode: string | null;
  gender: string | null;
  birthInfo: {
    date: string | null;
    city: string | null;
    province: string | null;
    cityCode?: string;
  };
  fiscalAddress: Address;
}

// ----------------------- Role assignment -----------------------
export interface RoleAssignment {
  roleIndex: string | null;
  roleCode: string | null;
  registrationDate: string | null;
  appointmentDate: string | null;
  durationCode: string | null;
  durationDescription: string | null;
  referenceBalanceDate: string | null;
  presentationDate?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface RoleAssignmentGroup {
  groupIndex: string | null;
  roles: { role: RoleAssignment[] };
}

// ----------------------- Person office -----------------------
export interface OfficePerson {
  index: string | null; // progressivo
  isRegisteredRepresentative?: 'S' | 'N';
  isAdministrator?: 'S' | 'N';
  isAuditor?: 'S' | 'N';
  physicalPerson: PhysicalPerson; // persona-fisica
  certifiedEmail?: string | null; // indirizzo-posta-certificata
  roleAssignments: { roleAssignmentGroup: RoleAssignmentGroup[] }; // atti-conferimento-cariche
}

// ----------------------- Administration -----------------------
export interface AdministrationControl {
  activeGovernanceForms: {
    governanceForm: { code: string | null; activeAdministratorsCount: string };
  };
}
