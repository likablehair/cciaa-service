// =============================================================================
// XSD source types (Italian, kebab-case keys)
// =============================================================================

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
  'f-rappresentante-ri'?: boolean | null;
}

export interface DatiIdentificativi {
  'stato-attivita': { c: string | null; _: string };
  'forma-giuridica': { c: string | null; _: string };
  'indirizzo-localizzazione': Indirizzo;
  'indirizzo-posta-certificata': string | null;
  'persone-rappresentanti': {
    'persona-rappresentante': PersonaRappresentante[];
  };
  'f-sede-intercamerale': boolean | null;
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

export interface SintesiAttivitaXsd {
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
  'f-rappresentante-ri'?: boolean | null;
  'f-amministratore'?: boolean | null;
  'f-sindaco'?: boolean | null;
  'persona-fisica': PersonaFisica;
  'indirizzo-posta-certificata'?: string | null;
  'atti-conferimento-cariche': {
    'atto-conferimento-cariche': AttoConferimentoCariche[];
  };
}

export interface AmministrazioneControlloXsd {
  'forme-amministrative-in-carica': {
    'forma-amministrativa-in-carica': {
      c: string | null;
      'n-amministratori-in-carica': string;
    };
  };
}

export interface BloccoImpresa {
  'dati-identificativi': DatiIdentificativi;
  'sintesi-attivita': SintesiAttivitaXsd;
  'persone-sede': { persona: PersonaSede[] };
  'amministrazione-controllo': AmministrazioneControlloXsd;
}

// =============================================================================
// English mapped types — top-level profile
// =============================================================================

// testone
export interface CompanyRegistryProfile {
  recognition: Recognition;
  identification: CompanyIdentification; // dati-identificativi
  activitySummary: ActivitySummary; // sintesi-attivita
  financialSummary: FinancialSummary | null; //sintesi-cifre-impresa
  headquartersInfo: HeadquartersInfo | null; // info-sede
  incorporationActDetails: IncorporationActDetails | null; // estremi-atto-costituzione
  cancellationOrTransfer: CancellationOrTransfer | null; // cancellazione-trasferimento
  activityInfo: CompanyActivityInfo | null; // info-attivita
  activityHistory: ActivityHistory | null; // storia-attivita
  workforceHistory: WorkforceHistory | null; // storia-addetti
  licensesAndRegisters: BusinessLicensesAndRegisters | null; // albi-ruoli-licenze
  officePeople: OfficePeople | null; // persone-sede
  listedCompanyInfo: ListedCompany | null; // societa-quotata
  shareholdersList: ShareholderListEntry | null; // elenco-soci
  shareholdersTable: ShareholdersTableEntry | null; // tabella-elenco-soci
  shareholdersBookAnnotations: ShareholdersBookAnnotations | null; // annotazioni-libro-soci
  controllingSubjectsPractices: ControllingSubjectsPractices | null; // pratiche-soggetti-controllanti
  subsidiaryCompaniesTable: SubsidiaryCompaniesTable[] | null; // tabella-partecipate-impresa
  changesHistory: ChangesHistory | null; // mad (movimentazione anagrafe ditte)
  transcriptions: Transcriptions | null; // trascrizioni
  previousHeadquartersHistory: PreviousHeadquartersHistory | null; // storia-sedi-precedenti
  registerEnrollment: RegisterEnrollmentDetails | null; // iscrizione-ri
  bylawsDetails: BylawsDetails | null; // info-statuto
  businessNetworks: BusinessNetworks | null; // reti-imprese
  governanceAndControl: GovernanceAndControl | null;
  financialAndAssetInfo: FinancialAndAssetInfo | null; // info-patrimoniali-finanziarie
  shareholdersAgreements: ShareholdersAgreements | null; // patti-parasociali
  insolvencyProcedures: InsolvencyProcedures | null; // procedure-concorsuali
  legalFormChanges: LegalFormChanges | null; // variazioni-forma-giuridica
  historicSupplementaryInfo: HistoricSupplementaryInfo | null; // notizie-storiche
  corporateRestructuring: CorporateRestructuring | null; // scioglimento-fusioni-scissioni
}

export type CompanyRegistryBlocksSummary = CompanyRegistryProfile;
export type CompanyAdministrativeDataSummary = CompanyRegistryProfile;

// =============================================================================
// Shared building blocks
// =============================================================================

/** abilitazione-facchinaggio */
export interface PorteringAuthorization {
  tierCode: string | null; // c-fascia
  tier: string | null; // fascia
  volumeCode: string | null; // c-volume
  volume: string | null; // volume
  notificationDate: string | null; // dt-denuncia
  additionalDetails: string | null; // ulteriori-specifiche
}

/** abilitazione-impiantisti */
export interface InstallerAuthorization {
  qualificationCode: string | null; // c-qualifica
  qualification: string | null; // qualifica
  letter: string | null; // lettera
  letterDescription: string | null; // descrizione-lettera
  letters: string | null; // lettere
  limitations: string | null; // limitazioni
  allCompanyActivitiesFlag: boolean | null; // f-tutte-attivita-impresa
  province: string | null; // provincia
  number: number | null; // n
  assessmentDate: string | null; // dt-accertamento
  enrollmentDate: string | null; // dt-iscrizione
  issuingBodyCode: string | null; // c-ente-rilascio
  issuingBody: string | null; // ente-rilascio
}

/** abilitazione-pulizia */
export interface CleaningAuthorization {
  tierCode: string | null; // c-fascia
  tier: string | null; // fascia
  volumeCode: string | null; // c-volume
  volume: string | null; // volume
  notificationDate: string | null; // dt-denuncia
  additionalDetails: string | null; // ulteriori-specifiche
}

/** abilitazioni-impiantisti */
export interface InstallerAuthorizations {
  authorizations: InstallerAuthorization[]; // abilitazione-impiantisti[]
  lawReferenceCode: string | null; // c-riferimento-legge
  lawReference: string | null; // riferimento-legge
}

/** accreditamento-odc */
export interface ConformityBodyAccreditation {
  schemeCode: string | null; // c-schema-accreditamento
  scheme: string | null; // schema-accreditamento
  certificateNumber: number | null; // n-certificato
  issueDate: string | null; // dt-emissione
  expiryDate: string | null; // dt-scadenza
  downloadFile: string | null; // file-download
}

/** accreditamenti-odc */
export interface ConformityBodyAccreditations {
  accreditations: ConformityBodyAccreditation[]; // accreditamento-odc[]
  lastUpdateDate: string | null; // dt-ultima-modifica
  website: string | null; // sito-internet
}

/** addetti-impresa */
export interface CompanyWorkforce {
  monthlyDetails: WorkforceMonthlyDetail[]; // info-mesi → info-mese[]
  averageValues: WorkforceAverageValues | null; // valori-medi
  collaborators: CollaboratorWorkforce | null; // collaboratori
  employeeDistribution: EmployeeDistribution | null; // distribuzione-dipendenti
  informationTypeCode: string | null; // c-tipo-informazione
  informationType: string | null; // tipo-informazione
  year: string | null; // anno
  declarationDate: string | null; // dt-dichiarazione
  surveyDate: string | null; // dt-rilevazione
  numEmployees: number | null; // n-dipendenti
  numSelfEmployed: number | null; // n-indipendenti
  total: number | null; // n-totale
  employeeSurveyCode: string | null; // c-rilevazione-dipendenti
}

/** info-mese */
export interface WorkforceMonthlyDetail {
  monthCode: string | null; // c-mese
  month: string | null; // mese
  numEmployees: number | null; // n-dipendenti
  numSelfEmployed: number | null; // n-indipendenti
  total: number | null; // n-totale
  numCollaborators: number | null; // n-collaboratori
  employeePercentage: string | null; // percentuale-dipendenti
  numNonAgriculturalEmployees: number | null; // n-dip-no-agricoli
}

/** valori-medi */
export interface WorkforceAverageValues {
  averageEmployees: string | null; // valore-medio-dipendenti
  averageSelfEmployed: string | null; // valore-medio-indipendenti
  averageTotal: string | null; // valore-medio-totale
  averageCollaborators: string | null; // valore-medio-collaboratori
}

/** collaboratori */
export interface CollaboratorWorkforce {
  monthlyDetails: WorkforceMonthlyDetail[]; // info-mesi → info-mese[]
  averageValues: WorkforceAverageValues | null; // valori-medi
}

/** addetti-comune */
export interface MunicipalityWorkforceEntry {
  localUnits: string[]; // pro-localizzazioni → pro-localizzazione[]
  monthlyDetails: WorkforceMonthlyDetail[]; // info-mesi → info-mese[]
  averageValues: WorkforceAverageValues | null; // valori-medi
  municipalityCode: string | null; // c-comune
  municipality: string | null; // comune
  province: string | null; // provincia
  provinceTer: string | null; // provincia-ter
}

/** addetti-comuni */
export interface MunicipalityWorkforceEntries {
  entries: MunicipalityWorkforceEntry[]; // addetti-comune[]
}

/** anagrafica-titolare */
export interface HolderPersonalInfo {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  taxCode: string | null; // c-fiscale
  citizenshipCode: string | null; // c-cittadinanza
  citizenship: string | null; // cittadinanza
  name: string | null; // denominazione
  declaredName: string | null; // denominazione-denunciata
  lastName: string | null; // cognome
  firstName: string | null; // nome
  isClosed: string | null; // f-cessata
  cancellationDate: string | null; // dt-cancellazione
}

/** annotazione-libro-soci */
export interface ShareholdersBookAnnotation {
  practiceDetails: PracticeDetails | null; // estremi-pratica
  confirmedPracticeDetails: ConfirmedPracticeDetails | null; // estremi-pratica-riconfermata
  transferFrames: TransferFrames | null; // riquadri-trasferimento
  notes: string[]; // note[]
}

/** annotazioni-libro-soci */
export interface ShareholdersBookAnnotations {
  annotations: ShareholdersBookAnnotation[]; // annotazione-libro-soci[]
}

/** apparecchi */
export interface BakeryEquipment {
  kneaders: number | null; // n-impastatrici
  shaping: number | null; // n-formatrici
  breadstickMachines: number | null; // n-grissinatrici
  dividers: number | null; // n-spezzatrici
  laminators: number | null; // n-laminatoi
}

/** area-intervento (simpleContent) */
export interface InterventionArea {
  description: string | null; // _text
  code: string | null; // c
}

/** aree-intervento */
export interface InterventionAreas {
  areas: InterventionArea[]; // area-intervento[]
}

/** assegnatari-marchio */
export interface BrandAssignees {
  enrollment: BrandEnrollment | null; // iscrizione
  cancellation: Cancellation | null; // cancellazione
}

/** attestazione */
export interface SoaCertification {
  qualityCertificate: QualityCertificate | null; // certificato-qualita
  sourceCode: string | null; // c-fonte
  soaIdentifierCode: string | null; // c-identificativo-SOA
  name: string | null; // denominazione
  certificationNumber: number | null; // n-attestazione
  issueDate: string | null; // dt-rilascio
  expiryDate: string | null; // dt-scadenza
  regulation: string | null; // regolamento
}

/** attestazione-qualificazioni */
export interface QualificationCertification {
  workCategories: WorkCategories | null; // categorie-opere
  soaCertification: SoaCertification | null; // attestazione
}

/** attestazioni-qualificazioni */
export interface QualificationCertifications {
  certifications: QualificationCertification[]; // attestazione-qualificazioni[]
}

/** atto */
export interface Deed {
  notaryDetails: NotaryDetails | null; // estremi-notarili
  homologation: Homologation | null; // omologazione
  registration: DeedRegistration | null; // registrazione
  chamberFiling: ChamberFiling | null; // presentazione-cciaa
  enrollmentModification: EnrollmentModification | null; // iscrizione-modifica
  code: string | null; // c
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  typeDescription: string | null; // descrizione-tipo
  deedDate: string | null; // dt-atto
}

/** atti */
export interface Deeds {
  deeds: Deed[]; // atto[]
}

/** atto-conferimento-cariche */
export interface RoleAppointmentDeed {
  roles: RoleEntries | null; // cariche
  powers: PersonPowers | null; // poteri-persona
  deedDetails: DeedDetails | null; // estremi-atto
  shareOwnership: ShareOwnership | null; // proprieta-quota
  profitParticipation: ProfitParticipation | null; // partecipazione-utili
  contributions: Contributions | null; // conferimenti-prestazioni
  professionalQualifications: ProfessionalQualifications | null; // abilitazioni-professionali
  groupIndex: string | null; // p-gruppo-cariche
}

/** atti-conferimento-cariche */
export interface RoleAppointmentDeeds {
  deeds: RoleAppointmentDeed[]; // atto-conferimento-cariche[]
}

/** atto-parcheggiato */
export interface StagedDeed {
  type: string | null; // tipo
  chamberCode: string | null; // cciaa
  year: string | null; // anno
  number: number | null; // n
  deedDate: string | null; // dt-atto
  filingDate: string | null; // dt-deposito
}

/** atto-trascrizioni */
export interface DeedTranscription {
  deed: Deed | null; // atto
  registerTranscriptions: RegisterTranscriptions | null; // trascrizioni-ri
}

/** atti-trascrizioni */
export interface DeedTranscriptions {
  transcriptions: DeedTranscription[]; // atto-trascrizioni[]
}

/** attivita-aa (simpleContent) */
export interface CraftsActivity {
  description: string | null; // _text
  enrollmentStartDate: string | null; // dt-iscrizione-inizio
  startDate: string | null; // dt-inizio
}

/** attivita-aa-bz */
export interface CraftsActivityBolzano {
  trades: CraftsTrades | null; // mestieri-aa
  descriptions: string[] | null; // descrizione[]
  cancellation: CraftsCancellationBolzano | null; // cancellazione-aa-bz
  startDate: string | null; // dt-inizio
  isSecondaryActivityFlag: boolean | null; // f-attivita-secondaria
}

/** attivita-agricola (simpleContent) */
export interface AgriculturalActivity {
  description: string | null; // _text
  startDate: string | null; // dt-inizio
}

/** attivita-no-aa */
export interface NonCraftsActivity {
  descriptions: string[] | null; // descrizione[]
  supplementaryInfo: string | null; // informazioni-supplementari-aa
  cancellation: CraftsCancellation | null; // cancellazione-aa
  startDate: string | null; // dt-inizio
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
}

/** attivita-prevalente (simpleContent) */
export interface PrimaryActivity {
  description: string | null; // _text
  notStartedFlag: boolean | null; // f-attivita-non-iniziata
}

/** autorizzazione-ps */
export interface PublicSecurityAuthorization {
  number: number | null; // n
  date: string | null; // dt
}

/** bene-servizio (simpleContent) */
export interface GoodOrService {
  description: string | null; // _text
  code: string | null; // c
}

/** beni-servizi */
export interface GoodsAndServices {
  items: GoodOrService[]; // bene-servizio[]
}

/** bilanci */
export interface FinancialStatementYears {
  years: Array<{ year: string | null }>; // bilancio[]
}

/** cancellazione */
export interface Cancellation {
  deedDetails: DeedDetails | null; // estremi-atto
  cessationInfo: string | null; // info-cessazione
  cancellationDate: string | null; // dt-cancellazione
  cessationDate: string | null; // dt-cessazione
  applicationDate: string | null; // dt-domanda
  notificationDate: string | null; // dt-denuncia
  reasonCode: string | null; // c-causale
  reason: string | null; // causale
  activityCessationDate: string | null; // dt-cessazione-attivita
}

/** cancellazione-aa */
export interface CraftsCancellation {
  reasonCode: string | null; // c-causale
  reason: string | null; // causale
  assessmentApplicationDate: string | null; // dt-domanda-accertamento
  resolutionDate: string | null; // dt-delibera
  cessationDate: string | null; // dt-cessazione
}

/** cancellazione-aa-bz */
export interface CraftsCancellationBolzano {
  effectDate: string | null; // dt-effetto
  assessmentApplicationDate: string | null; // dt-domanda-accertamento
  reasonCode: string | null; // c-causale
  reason: string | null; // causale
}

/** cancellazione-ruolo */
export interface RoleCancellation {
  reasonCode: string | null; // c-causale
  reason: string | null; // causale
  applicationDate: string | null; // dt-domanda
  resolutionDate: string | null; // dt-delibera
  cessationDate: string | null; // dt-cessazione
}

/** cancellazione-trasferimento */
export interface CancellationOrTransfer {
  cancellation: Cancellation | null; // cancellazione
  foreignOfficeAddress: ForeignOfficeAddress | null; // indirizzo-sede-estero
  headquartersTransfer: HeadquartersTransfer | null; // trasferimento-sede
  activeLocalUnitTransfer: ActiveLocalUnitTransfer | null; // trasferimento-sede-ul-attiva
  otherRegisterInfo: OtherRegisterInfo | null; // info-altro-registro
}

/** capitale-investito */
export interface InvestedCapital {
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  amount: string | null; // ammontare
  amountInEuros: string | null; // ammontare-convertito-in-euro
}

/** capitale-sociale */
export interface ShareCapitalEntry {
  authorizedAmount: AuthorizedCapital | null; // deliberato
  subscribedAmount: SubscribedCapital | null; // sottoscritto
  paidAmount: PaidCapital | null; // versato
  contributionType: ContributionType | null; // tipo-conferimenti
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  amount: string | null; // ammontare
  numShares: number | null; // n-azioni
  numQuotas: number | null; // n-quote
}

/** caratteristiche-impianto-1 / caratteristiche-impianto-2 */
export interface PlantCharacteristics {
  nominalCapacityQuintals: string | null; // quintali-potenza-nominale
  heatingType: string | null; // tipo-riscaldamento
  fuelType: string | null; // tipo-combustibile
}

/** carica / role entry (simpleContent) */
export interface RoleEntry {
  roleText: string | null; // _text (denomination of the role)
  roleIndex: string | null; // p-carica
  roleCode: string | null; // c-carica
  registrationDate: string | null; // dt-iscrizione
  shareholdersBookRegistrationDate: string | null; // dt-iscrizione-libro-soci
  appointmentDeedDate: string | null; // dt-atto-nomina
  appointmentDate: string | null; // dt-nomina
  endDate: string | null; // dt-fine
  yearsOfOffice: number | null; // n-anni-esercizio
  durationCode: string | null; // c-durata
  durationDescription: string | null; // descrizione-durata
  balanceReferenceDate: string | null; // dt-riferimento-bilancio
  presentationDate?: string | null; // dt-presentazione
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** cariche */
export interface RoleEntries {
  roles: RoleEntry[]; // carica[]
}

/** categoria-opere */
export interface WorkCategory {
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
  classificationCode: string | null; // c-classificazione
  classification: string | null; // classificazione
}

/** categorie-opere */
export interface WorkCategories {
  categories: WorkCategory[]; // categoria-opere[]
  sourceCode: string | null; // c-fonte
}

/** certificato-qualita */
export interface QualityCertificate {
  certifierName: string | null; // denominazione-odc
  expiryDate: string | null; // dt-scadenza
}

/** certificazione */
export interface QualityCertificationEntry {
  sectors: Sectors | null; // settori
  schemeCode: string | null; // c-schema-accreditamento
  scheme: string | null; // schema-accreditamento
  referenceStandard: string | null; // norma-riferimento
  certificateNumber: number | null; // n-certificato
  note: string | null; // nota
  issueDate: string | null; // dt-emissione
  certifierName: string | null; // denominazione-odc
  certifierTaxCode: string | null; // c-fiscale-odc
}

/** certificazioni */
export interface QualityCertifications {
  certifications: QualityCertificationEntry[]; // certificazione[]
  lastUpdateDate: string | null; // dt-ultima-modifica
}

/** certificazione-bio */
export interface OrganicCertification {
  source: string | null; // fonte
  lastUpdateDate: string | null; // dt-ultimo-aggiornamento
  operatorCode: string | null; // c-operatore
  operator: string | null; // operatore
  subjectDate: string | null; // dt-assoggettamento
  activity: string | null; // attivita
  certificateNumber: number | null; // n-certificato
  certifierCode: string | null; // c-odc
  certifier: string | null; // odc
  certifiedActivity: string | null; // attivita-certificata
  conformityCertificateNumber: number | null; // n-certificato-conformita
  expiryDate: string | null; // dt-scadenza
}

/** certificazioni-bio */
export interface OrganicCertifications {
  certifications: OrganicCertification[]; // certificazione-bio[]
}

/** cessazione-esercizio */
export interface BusinessCessation {
  notes: string[]; // note[]
  cessationDate: string | null; // dt-cessazione
  effectDate: string | null; // dt-decorrenza
}

/** cessazione-localizzazione */
export interface LocationCessation {
  deedDetails: DeedDetails | null; // estremi-atto
  cessationInfo: string | null; // info-cessazione
  cessationDate: string | null; // dt-cessazione
  applicationDate: string | null; // dt-domanda
  notificationDate: string | null; // dt-denuncia
  reasonCode: string | null; // c-causale
  reason: string | null; // causale
}

/** classificazione-ateco */
export interface AtecoClassificationEntry {
  activityCode: string | null; // c-attivita
  activityDescription: string | null; // attivita
  relevanceCode: string | null; // c-importanza
  relevanceDescription: string | null; // importanza
  naceCode: string | null; // c-nace
  startDate: string | null; // dt-inizio
  referenceDate: string | null; // dt-riferimento
  sourceCode: string | null; // c-fonte
  sourceDescription: string | null; // fonte
}

/** classificazione-ateco-2002 */
export interface AtecoClassification2002 {
  activityCode: string | null; // c-attivita
  activityDescription: string | null; // attivita
  relevanceCode: string | null; // c-importanza
  relevanceDescription: string | null; // importanza
  startDate: string | null; // dt-inizio
}

/** classificazioni-ateco */
export interface AtecoClassifications {
  classifications: AtecoClassificationEntry[]; // classificazione-ateco[]
  codingCode: string | null; // c-codifica
  coding: string | null; // codifica
}

/** classificazioni-ateco-2002 */
export interface AtecoClassifications2002 {
  classifications: AtecoClassification2002[]; // classificazione-ateco-2002[]
}

/** codice-lei */
export interface LeiCode {
  code: string | null; // c
  expiryDate: string | null; // dt-scadenza
  sourceCode: string | null; // c-fonte
  source: string | null; // fonte
}

/** collegio-sindacale */
export interface AuditingBoard {
  numEffectiveMembers: number | null; // n-effettivi
  numAlternateMembers: number | null; // n-supplenti
  minMembers: number | null; // n-min
  maxMembers: number | null; // n-max
}

/** collegio-sindacale-in-carica */
export interface ActiveAuditingBoard {
  numActiveMembers: number | null; // n-in-carica
  yearsOfOffice: string | null; // anni-durata
  durationCode: string | null; // c-durata
  duration: string | null; // durata
  officeStartDate: string | null; // dt-inizio-carica
  officeEndDate: string | null; // dt-fine-carica
}

/** commercio-dettaglio */
export interface RetailTrade {
  additionalInfo: RetailAdditionalInfo | null; // integrazione-informazioni
  declarationDate: string | null; // dt-dichiarazione
  salesArea: string | null; // superficie-vendita
  sectorCode: string | null; // c-settore-merceologico
  sector: string | null; // settore-merceologico
}

/** integrazione-informazioni */
export interface RetailAdditionalInfo {
  specialTables: SpecialTables | null; // tabelle-speciali
  notes: string[]; // note[]
  businessCessation: BusinessCessation | null; // cessazione-esercizio
  insertionDate: string | null; // dt-inserimento
  effectDate: string | null; // dt-decorrenza
  requestTypeCode: string | null; // c-tipo-domanda
  requestType: string | null; // tipo-domanda
  authorizationNumber: number | null; // n-autorizzazione
  presentationDate: string | null; // dt-presentazione
  municipalityCode: string | null; // c-comune-presentazione
  municipality: string | null; // comune-presentazione
  province: string | null; // provincia-presentazione
  protocolNumber: number | null; // n-protocollo
  facilityTypeCode: string | null; // c-struttura-esercizio
  facilityType: string | null; // struttura-esercizio
  foodSalesAreaSqm: string | null; // mq-vendita-alimentare
  nonFoodSalesAreaSqm: string | null; // mq-vendita-non-alimentare
  facilityAreaSqm: string | null; // mq-esercizio
  shoppingCenter: string | null; // centro-commerciale
}

/** tabelle-speciali (simpleContent) */
export interface SpecialTables {
  text: string | null; // _text
  pharmacyFlag: boolean | null; // f-farmacia
  tobaccoSalesFlag: boolean | null; // f-vendita-generi-monopolio
  fuelSalesFlag: boolean | null; // f-vendita-carburanti
  squareMeters: string | null; // mq
}

/** composizione-quote */
export interface ShareComposition {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  number: number | null; // n
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  nominalValue: string | null; // valore-nominale
  numShares: number | null; // n-azioni
  numQuotas: number | null; // n-quote
  unitValue: string | null; // valore-unitario
  amountInEuros: string | null; // ammontare-convertito-in-euro
  paidValue: string | null; // valore-versato
}

/** comunicazione-curatore */
export interface ReceiverCommunication {
  hearingDetails: HearingDetails | null; // estremi-udienza
  court: string | null; // tribunale
  orderNumber: number | null; // n-provvedimento
  orderDate: string | null; // dt-provvedimento
  judgeName: string | null; // nome-giudice
  judgeSurname: string | null; // cognome-giudice
}

/** comunicazioni-curatore */
export interface ReceiverCommunications {
  communications: ReceiverCommunication[]; // comunicazione-curatore[]
}

/** conferimenti-prestazioni (simpleContent) */
export interface Contributions {
  text: string | null; // _text
  contributionsIndex: string | null; // p-conferimenti
}

/** conferimenti-benefici (simpleContent) */
export interface BenefitContributions {
  text: string | null; // _text
  inBylawsFlag: boolean | null; // f-presenza-nello-statuto
}

/** dati-artigiani */
export interface CraftsData {
  craftsActivity: CraftsActivity | null; // attivita-aa
  supplementaryInfo: string | null; // informazioni-supplementari-aa
  cancellation: CraftsCancellation | null; // cancellazione-aa
  suppressedRegisterFlag: boolean | null; // f-albo-soppresso
  lawReferenceCode: string | null; // c-riferimento-legge
  number: number | null; // n
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
  province: string | null; // provincia
  assessmentEnrollmentDate: string | null; // dt-iscrizione-accertamento
  applicationDate: string | null; // dt-domanda
  assessmentApplicationDate: string | null; // dt-domanda-accertamento
  enrollmentDate: string | null; // dt-iscrizione
  resolutionDate: string | null; // dt-delibera
}

/** dati-bilancio */
export interface BalanceSheetData {
  year: string | null; // anno
  profitOrLoss: string | null; // utile-perdite
  revenues: string | null; // ricavi
  productionValue: string | null; // valore-produzione
}

/** dati-iscrizione-rea-rd */
export interface ReaRdRegistration {
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  enrollmentDate: string | null; // dt-iscrizione
  enrollmentTypeCode: string | null; // c-tipo-iscrizione
  enrollmentType: string | null; // tipo-iscrizione
}

/** deliberato */
export interface AuthorizedCapital {
  amount: string | null; // ammontare
  amountInEuros: string | null; // ammontare-convertito-in-euro
}

/** sottoscritto */
export interface SubscribedCapital {
  amount: string | null; // ammontare
  amountInEuros: string | null; // ammontare-convertito-in-euro
}

/** versato */
export interface PaidCapital {
  amount: string | null; // ammontare
  amountInEuros: string | null; // ammontare-convertito-in-euro
}

/** denuncia-inizio-attivita */
export interface BusinessStartNotification {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  notificationDate: string | null; // dt-denuncia
  issuingBodyCode: string | null; // c-ente-rilascio
  issuingBody: string | null; // ente-rilascio
}

/** dettaglio-attivita (simpleContent) */
export interface ActivityDetail {
  description: string | null; // _text
  detailCode: string | null; // c-dettaglio
}

/** dettaglio-iscrizione */
export interface RegistrationDetail {
  additionalDetails: AdditionalDetails | null; // ulteriori-dettagli
  startDate: string | null; // dt-inizio
  issueDate: string | null; // dt-emissione
  expiryDate: string | null; // dt-scadenza
  detailStatus: string | null; // stato-dettaglio
  statusStartDate: string | null; // dt-inizio-stato
  statusEndDate: string | null; // dt-fine-stato
}

/** dichiarazione (simpleContent) */
export interface Declaration {
  text: string | null; // _text
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  enrollmentDate: string | null; // dt-iscrizione
}

/** dichiarazione-ambientale */
export interface EnvironmentalDeclarationEntry {
  registrationDetails: RegistrationDetails | null; // dettagli-iscrizione
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  sourceCode: string | null; // c-fonte
  source: string | null; // fonte
  provinceSection: string | null; // provincia-sezione
  province: string | null; // provincia
  number: number | null; // n
  year: string | null; // anno
  firstEnrollmentDate: string | null; // dt-prima-iscrizione
  enrollmentDate: string | null; // dt-iscrizione
  cancellationDate: string | null; // dt-cancellazione
  enrollmentStatus: string | null; // stato-iscrizione
  statusStartDate: string | null; // dt-inizio-stato
  statusEndDate: string | null; // dt-fine-stato
}

/** dichiarazione-incubatore / pmi / scuola-lavoro / start-up (simpleContent) */
export interface StatusDeclaration {
  text: string | null; // _text
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
}

/** distribuzione-dipendenti */
export interface EmployeeDistribution {
  contractDistribution: ContractDistribution | null; // dipendenti-contratti
  workingHoursDistribution: WorkingHoursDistribution | null; // dipendenti-orari-lavoro
  qualificationDistribution: QualificationDistribution | null; // dipendenti-qualifiche
  agriculturalWorkersFlag: boolean | null; // f-presenza-agricoli
}

/** dipendenti-contratto */
export interface ContractEmployees {
  monthlyDetails: WorkforceMonthlyDetail[]; // info-mesi → info-mese[]
  contract: string | null; // contratto
}

/** dipendenti-contratti */
export interface ContractDistribution {
  entries: ContractEmployees[]; // dipendenti-contratto[]
}

/** dipendenti-orario-lavoro */
export interface WorkingHoursEmployees {
  monthlyDetails: WorkforceMonthlyDetail[]; // info-mesi → info-mese[]
  workingHours: string | null; // orario-lavoro
}

/** dipendenti-orari-lavoro */
export interface WorkingHoursDistribution {
  entries: WorkingHoursEmployees[]; // dipendenti-orario-lavoro[]
}

/** dipendenti-qualifica */
export interface QualificationEmployees {
  monthlyDetails: WorkforceMonthlyDetail[]; // info-mesi → info-mese[]
  qualification: string | null; // qualifica
}

/** dipendenti-qualifiche */
export interface QualificationDistribution {
  entries: QualificationEmployees[]; // dipendenti-qualifica[]
}

/** diritto-partecipazione */
export interface ParticipationRight {
  participationRoles: ParticipationRole[]; // ruolo-partecipazione[]
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  fractionNumerator: string | null; // frazione-numeratore
  fractionDenominator: string | null; // frazione-denominatore
  percentage: string | null; // percentuale
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  value: string | null; // valore
}

/** ruolo-partecipazione (simpleContent) */
export interface ParticipationRole {
  description: string | null; // _text
  code: string | null; // c
}

/** doc-consultabili */
export interface ConsultableDocuments {
  financialStatements: FinancialStatementYears | null; // bilanci
  bylawsExistsFlag: boolean | null; // f-esiste-statuto
  numOtherDeeds: number | null; // n-altri-atti
  sosReporting: string | null; // rendicontazione-sos
  benefitReport: string | null; // relazione-benefit
  socialBalance: string | null; // bilancio-sociale
}

/** domicilio / domicilio-ri */
export interface DomicileAddress {
  city: string | null; // comune
  province: string | null; // provincia
  provinceTer: string | null; // provincia-ter
  street: string | null; // via
  streetNumber: number | null; // n-civico
  postalCode: string | null; // cap
  postalCodeTer: string | null; // cap-ter
  countryCode: string | null; // c-stato
  country: string | null; // stato
  hamlet: string | null; // frazione
  careOf: string | null; // presso
}

/** domicilio-fiscale */
export interface FiscalDomicile {
  municipalityCode: string | null; // c-comune
  city: string | null; // comune
  province: string | null; // provincia
  provinceTer: string | null; // provincia-ter
  topographyCode: string | null; // c-toponimo
  topography: string | null; // toponimo
  street: string | null; // via
  streetNumber: number | null; // n-civico
  postalCode: string | null; // cap
  postalCodeTer: string | null; // cap-ter
  countryCode: string | null; // c-stato
  country: string | null; // stato
  hamlet: string | null; // frazione
  otherIndications: string | null; // altre-indicazioni
}

/** durata-societa */
export interface CompanyDuration {
  fiscalYearMaturity: FiscalYearMaturity | null; // scadenza-esercizi
  endDate: string | null; // dt-termine
  indefiniteDurationFlag: boolean | null; // f-durata-indeterminata
  extensionTypeCode: string | null; // c-tipo-proroga
  extensionType: string | null; // tipo-proroga
  tacitExtensionYears: number | null; // n-anni-proroga-tacita
}

/** scadenza-esercizi */
export interface FiscalYearMaturity {
  firstFiscalYearDate: string | null; // dt-primo-esercizio
  subsequentFiscalYears: string | null; // esercizi-successivi
  balanceExtensionMonths: string | null; // mesi-proroga-bilancio
  balanceExtensionDays: string | null; // giorni-proroga-bilancio
}

/** elenco-soci */
export interface ShareholderListEntry {
  practiceDetails: PracticeDetails | null; // estremi-pratica
  confirmedPracticeDetails: ConfirmedPracticeDetails | null; // estremi-pratica-riconfermata
  shareCapital: ShareCapitalEntry | null; // capitale-sociale
  frames: ShareFrames | null; // riquadri
  notes: string[]; // note[]
  confirmedPracticeNotes: string[]; // note-pratica-riconfermata[]
  shareholdersFromDate: string | null; // dt-soci-titolari-dal
  shareholdersToDate: string | null; // dt-soci-titolari-al
  consortiumFlag: boolean | null; // f-consorzio
  latestShareholdersListFlag: boolean | null; // f-ultimo-elenco-soci
  lawReferenceCode: string | null; // c-riferimento-legge
  lawReference: string | null; // riferimento-legge
}

/** estremi-atto */
export interface DeedDetails {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  notary: string | null; // notaio
  court: string | null; // tribunale
  otherIndications: string | null; // altre-indicazioni
  registrationNumber: number | null; // n-registrazione
  registrationDate: string | null; // dt-registrazione
  registryOfficeLocality: string | null; // localita-ufficio-registro
  registryOfficeProvince: string | null; // provincia-ufficio-registro
}

/** estremi-atto-costituzione */
export interface IncorporationDeedDetails {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  repertoryNumber: number | null; // n-repertorio
  notary: string | null; // notaio
  notaryLocality: string | null; // localita-notaio
  notaryProvince: string | null; // provincia-notaio
  registrationNumber: number | null; // n-registrazione
  registrationDate: string | null; // dt-registrazione
  registryOfficeLocality: string | null; // localita-ufficio-registro
  registryOfficeProvince: string | null; // provincia-ufficio-registro
}

/** estremi-impresa */
export interface CompanyDetails {
  legalForm: string | null; // forma-giuridica (placeholder)
  taxCode: string | null; // c-fiscale
  name: string | null; // denominazione
  isClosedFlag: boolean | null; // f-cessata
  cancellationDate: string | null; // dt-cancellazione
}

/** estremi-nascita */
export interface BirthDetails {
  date: string | null; // dt
  municipalityCode: string | null; // c-comune
  city: string | null; // comune
  province: string | null; // provincia
  countryCode: string | null; // c-stato
  country: string | null; // stato
}

/** estremi-notarili */
export interface NotaryDetails {
  formCode: string | null; // c-forma
  form: string | null; // forma
  notary: string | null; // notaio
  repertoryNumber: number | null; // n-repertorio
  notaryLocality: string | null; // localita-notaio
  notaryProvince: string | null; // provincia-notaio
}

/** estremi-pratica */
export interface PracticeDetails {
  practiceCode: string | null; // c-pratica
  complianceTypeCode: string | null; // c-tipo-adempimento
  complianceType: string | null; // tipo-adempimento
  deedDate: string | null; // dt-atto
  chamberCode: string | null; // cciaa
  year: string | null; // anno
  number: number | null; // n
  protocolDate: string | null; // dt-protocollo
  filingDate: string | null; // dt-deposito
  reconfirmationFlag: boolean | null; // f-riconferma
  declarationDate: string | null; // dt-dichiarazione
  listTypeCode: string | null; // c-tipo-elenco
  listType: string | null; // tipo-elenco
  requestTypeCode: string | null; // c-tipo-richiesta
  requestType: string | null; // tipo-richiesta
}

/** estremi-pratica-riconfermata */
export interface ConfirmedPracticeDetails {
  chamberCode: string | null; // cciaa
  year: string | null; // anno
  number: number | null; // n
}

/** estremi-udienza */
export interface HearingDetails {
  hearingDate: string | null; // dt-udienza
  deadlineDate: string | null; // dt-termine
  location: string | null; // luogo
}

/** euid */
export interface EuropeanUniqueIdentifier {
  euidCode: string | null; // c-euid
  countryCode: string | null; // c-stato
  country: string | null; // stato
  registerCode: string | null; // c-registro
  register: string | null; // registro
  registrationNumber: number | null; // n-registrazione
  legalFormCode: string | null; // c-forma-giuridica
  legalForm: string | null; // forma-giuridica
}

/** evento */
export interface CorporateEvent {
  companyIndex: string | null; // p-societa
  name: string | null; // denominazione
  taxCode: string | null; // c-fiscale
  city: string | null; // comune
  chamberCode: string | null; // cciaa
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  rsNumber: number | null; // n-rs
  courtCode: string | null; // c-tribunale
  court: string | null; // tribunale
  province: string | null; // provincia
  riNumber: number | null; // n-ri
  euidCode: string | null; // c-euid
}

/** fallimento-in-proprio / fallimento-per-estensione */
export interface BankruptcyDetails {
  birthDetails: BirthDetails | null; // estremi-nascita
  bankruptcyNumber: number | null; // n-fallimento
  bankruptcyDate: string | null; // dt-fallimento
  court: string | null; // tribunale
  courtProvince: string | null; // provincia-tribunale
  judgmentNumber: number | null; // n-sentenza
  judgmentDate: string | null; // dt-sentenza
  receiver: string | null; // curatore
  closureDate: string | null; // dt-chiusura
  judicialBodyCode: string | null; // c-organo-giudiziario
  judicialBody: string | null; // organo-giudiziario
  gender: string | null; // sesso
  lastName: string | null; // cognome
  firstName: string | null; // nome
  taxCode: string | null; // c-fiscale
}

/** fallimento */
export interface Bankruptcy {
  ownBankruptcy: BankruptcyDetails | null; // fallimento-in-proprio
  extendedBankruptcy: BankruptcyDetails | null; // fallimento-per-estensione
  bankruptcyIndex: string | null; // p-fallimento
}

export interface ParticipatingFamilyMembers {
  entries: ParticipatingFamilyMember[]; // familiare-partecipe[]
}

/** familiare-partecipe */
export interface ParticipatingFamilyMember {
  lastName: string | null; // cognome
  firstName: string | null; // nome
  taxCode: string | null; // c-fiscale
  directFarmerFlag: boolean | null; // f-coltivatore-diretto
}

/** fondo-consortile */
export interface ConsortiumFund {
  descriptions: Descriptions | null; // descrizioni
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  amount: string | null; // ammontare
  amountInEuros: string | null; // ammontare-convertito-in-euro
}

export interface GovernanceForms {
  entries: GovernanceForm[] | null; // forma-amministrativa[]
}

export interface ActiveGovernanceForms {
  entries: ActiveGovernanceForm[] | null; // forma-amministrativa-in-carica[]
}

export interface ControlBodiesInCharge {
  entries: ActiveGovernanceForm[] | null; // forma-amministrativa-in-carica[]
}


/** forma-amministrativa (simpleContent) */
export interface GovernanceForm {
  text: string | null; // _text (form name)
  code: string | null; // c
  activeFlag: boolean | null; // f-in-carica
  controlBodyFlag: boolean | null; // f-organo-controllo
  minAdministrators: number | null; // n-min-amministratori
  maxAdministrators: number | null; // n-max-amministratori
}

/** forma-amministrativa-in-carica (simpleContent) */
export interface ActiveGovernanceForm {
  text: string | null; // _text (form name)
  code: string | null; // c
  numActiveAdministrators: number | null; // n-amministratori-in-carica
  yearsOfOffice: string | null; // anni-durata
  durationCode: string | null; // c-durata
  duration: string | null; // durata
  officeStartDate: string | null; // dt-inizio-carica
  officeEndDate: string | null; // dt-fine-carica
}

/** fusione-scissione */
export interface MergerOrSplit {
  events: CorporateEvents | null; // eventi
  declarations: Declarations | null; // dichiarazioni
  mergerIndex: string | null; // p-fusione
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  approvalCode: string | null; // c-approvazione
  approval: string | null; // approvazione
  eventCode: string | null; // c-evento
  event: string | null; // evento
  enrollmentDate: string | null; // dt-iscrizione
  modificationDate: string | null; // dt-modifica
  deedDate: string | null; // dt-atto
  resolutionDate: string | null; // dt-delibera
  revocationDeedDate: string | null; // dt-atto-revoca
  executionDeedDate: string | null; // dt-atto-esecuzione
}

/** fusioni-scissioni */
export interface MergersAndSplits {
  entries: MergerOrSplit[]; // fusione-scissione[]
}

/** gruppo-iva (simpleContent) */
export interface VatGroup {
  groupName: string | null; // _text
  sourceCode: string | null; // c-fonte
  lastUpdateDate: string | null; // dt-ultimo-aggiornamento
  name: string | null; // denominazione
  startDate: string | null; // dt-inizio
}

/** impresa-riferimento */
export interface RelatedCompany {
  name: string | null; // denominazione
  taxCode: string | null; // c-fiscale
}

/** impresa-subentrante / impresa-subentrata */
export interface SuccessorCompany {
  name: string | null; // denominazione
  taxCode: string | null; // c-fiscale
  chamberCode: string | null; // cciaa
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  riNumber: number | null; // n-ri
  successionTitleCode: string | null; // c-titolo-subentro
  successionTitle: string | null; // titolo-subentro
}

/** indirizzo / indirizzo-ri */
export interface FullAddress {
  municipalityCode: string | null; // c-comune
  city: string | null; // comune
  province: string | null; // provincia
  provinceTer: string | null; // provincia-ter
  topographyCode: string | null; // c-toponimo
  topography: string | null; // toponimo
  street: string | null; // via
  streetNumber: number | null; // n-civico
  postalCode: string | null; // cap
  postalCodeTer: string | null; // cap-ter
  countryCode: string | null; // c-stato
  country: string | null; // stato
  hamlet: string | null; // frazione
  otherIndications: string | null; // altre-indicazioni
}

/** indirizzo-sede-estero */
export interface ForeignOfficeAddress {
  transferInfo: string | null; // info-trasferimento
  countryCode: string | null; // c-stato
  country: string | null; // stato
  address: string | null; // indirizzo
}

/** info-altro-registro */
export interface OtherRegisterInfo {
  otherRegisterTransfer: OtherRegisterTransfer | null; // trasferimento-altro-registro
  cancellation: Cancellation | null; // cancellazione
  chamberCode: string | null; // cciaa
}

/** info-attivita */
export interface CompanyActivityInfo {
  familyWorkInfo: FamilyWorkInfo | null; // lavoro-prestato-familiari-part
  participatingFamilyMembers: ParticipatingFamilyMembers | null; // familiari-partecipi → familiare-partecipe[]
  pursuedActivity: string | null; // attivita-esercitata
  secondaryActivity: string | null; // attivita-secondaria-esercitata
  craftsActivityBolzano: CraftsActivityBolzano | null; // attivita-aa-bz
  nonCraftsActivity: NonCraftsActivity | null; // attivita-no-aa
  agriculturalActivity: AgriculturalActivity | null; // attivita-agricola
  activityDetails: ActivityDetails[]; // dettagli-attivita[]
  atecoClassifications2002: AtecoClassifications2002 | null; // classificazioni-ateco-2002
  atecoClassifications: AtecoClassifications[]; // classificazioni-ateco[]
  primaryActivity: PrimaryActivity | null; // attivita-prevalente
  qualificationCertifications: QualificationCertifications | null; // attestazioni-qualificazioni
  organicCertifications: OrganicCertifications | null; // certificazioni-bio
  qualityCertifications: QualityCertifications | null; // certificazioni
  conformityBodyAccreditations: ConformityBodyAccreditations | null; // accreditamenti-odc
  socialEnterprise: SocialEnterprise | null; // impresa-sociale
  runts: RuntsEnrollment | null; // runts
  legalRating: LegalRating | null; // rating-legalita
  companyWorkforce: CompanyWorkforce[]; // addetti-impresa[]
  municipalityWorkforce: MunicipalityWorkforceEntries[]; // addetti-comuni[]
  activityStartDate: string | null; // dt-inizio-attivita-impresa
  startDate: string | null; // dt-inizio
  statusCode: string | null; // c-stato
  status: string | null; // stato
}

/** dettagli-attivita */
export interface ActivityDetails {
  details: ActivityDetail[]; // dettaglio-attivita[]
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
}

/** lavoro-prestato-familiari-part */
export interface FamilyWorkInfo {
  numPermanentWorkers: number | null; // n-lavoratori-tempo-indeter
  numWorkdays: number | null; // n-giornate
}

/** impresa-sociale */
export interface SocialEnterprise {
  goodsAndServices: GoodsAndServices | null; // beni-servizi
  activitySectors: ActivitySectors | null; // settori-attivita
  numDisadvantagedWorkers: number | null; // n-lavoratori-svantaggiati
  numDisabledWorkers: number | null; // n-lavoratori-disabili
}

/** settori-attivita */
export interface ActivitySectors {
  sectors: ActivitySector[]; // settore-attivita[]
}

/** settore-attivita (simpleContent) */
export interface ActivitySector {
  description: string | null; // _text
  code: string | null; // c
}

/** runts */
export interface RuntsEnrollment {
  sections: Sections | null; // sezioni
  id: string | null; // id
}

/** rating-legalita */
export interface LegalRating {
  sourceCode: string | null; // c-fonte
  lastUpdateDate: string | null; // dt-ultimo-aggiornamento
  score: string | null; // punteggio
  identifier: string | null; // identificativo
  renewalDate: string | null; // dt-rinnovo
}

/** info-patrimoniali-finanziarie */
export interface FinancialAndAssetInfo {
  investedCapital: InvestedCapital | null; // capitale-investito
  consortiumFund: ConsortiumFund | null; // fondo-consortile
  contributionNominalValue: ContributionNominalValue | null; // valore-nominale-conferimenti
  shareCapital: ShareCapitalEntry | null; // capitale-sociale
  shareComposition: ShareComposition | null; // composizione-quote
  benefitContributions: BenefitContributions | null; // conferimenti-benefici
  financialInstruments: FinancialInstruments | null; // strumenti-finanziari
  capitalReduction: string | null; // diminuzione-capitale
  shareOffer: string | null; // offerta-azioni
  earlyConversion: string | null; // anticipata-conversione
  specificProjectAssets: SpecificProjectAssets | null; // patrimonio-specifico-affare
  specificProjectFinancing: SpecificProjectFinancing | null; // finanziamento-specifico-affare
  balanceSheetData: BalanceSheetEntries | null; // dati-bilanci
  hasInfoFlag: boolean | null; // f-presenza-info
}

/** valore-nominale-conferimenti */
export interface ContributionNominalValue {
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  amount: string | null; // ammontare
  amountInEuros: string | null; // ammontare-convertito-in-euro
}

/** dati-bilanci */
export interface BalanceSheetEntries {
  entries: BalanceSheetData[]; // dati-bilancio[]
}

/** strumenti-finanziari */
export interface FinancialInstruments {
  ordinaryShares: string | null; // azioni-ordinarie
  otherShares: string | null; // altre-azioni
  bonds: string | null; // obbligazioni
  convertibleBonds: string | null; // obbligazioni-convertibili
  debtSecurities: string | null; // titoli-debito
  otherInstruments: string | null; // altri-strumenti
}

/** patrimonio-specifico-affare */
export interface SpecificProjectAssets {
  constitutionDeed: string | null; // costituzione
  modification: ModificationEntry | null; // modifica
  cessationDeed: string | null; // cessazione
}

/** finanziamento-specifico-affare */
export interface SpecificProjectFinancing {
  constitutionDeed: string | null; // costituzione
  modification: ModificationEntry | null; // modifica
  cessationDeed: string | null; // cessazione
}

/** modifica (simpleContent) */
export interface ModificationEntry {
  text: string | null; // _text
  modificationIndex: string | null; // p-modifica
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  effectDate: string | null; // dt-effetto
  modificationCode: string | null; // c-modifica
  modificationCodeDescription: string | null; // descrizione-c-modifica
}

/** persona-giuridica-privata */
export interface PrivateLegalPersonInfo {
  register: string | null; // registro
  entity: string | null; // ente
  number: number | null; // n
  enrollmentDate: string | null; // dt-iscrizione
  requirementsVerifiedFlag: boolean | null; // f-accertamento-requisiti
}

/** sede-fuori-provincia */
export interface OutOfProvinceHeadquarters {
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  aaNumber: number | null; // n-aa
  chamberCode: string | null; // cciaa
}

/** sede-secondaria-rs */
export interface SecondaryRegisteredOffice {
  secondaryOfficeNumber: number | null; // n-sede-secondaria
  courtMunicipalityCode: string | null; // c-comune-tribunale
  courtMunicipality: string | null; // comune-tribunale
  courtProvince: string | null; // provincia-tribunale
  enrollmentDate: string | null; // dt-iscrizione
}

/** provenienza-trasferimento */
export interface TransferOrigin {
  transferDate: string | null; // dt-trasferimento
  chamberCode: string | null; // cciaa
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  aaNumber: number | null; // n-aa
}

/** informazioni-supplementari */
export interface SupplementaryInfo {
  jointPowers: string | null; // poteri-congiunti
  registryInfo: string | null; // info-visura
  genericInfo: string | null; // info-generiche
  locationInfo: string | null; // info-localizzazione
}

/** info-statuto */
export interface BylawsDetails {
  companyDuration: CompanyDuration | null; // durata-societa
  registeredOfficeRegistration: RegisteredOfficeRegistration | null; // iscrizione-rs
  corporatePurpose: string | null; // oggetto-sociale
  powers: Powers | null; // poteri
  references: References | null; // riferimenti
  declarations: Declarations | null; // dichiarazioni
  nameAbbreviation: string | null; // sigla-denominazione
  foundationDate: string | null; // dt-fondazione
  uniqueCommunicationDate: string | null; // dt-comunicazione-unica
  incorporationDeedDate: string | null; // dt-atto-costituzione
  incorporationDate: string | null; // dt-costituzione
}

/** iscrizione */
export interface BrandEnrollment {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  enrollmentDate: string | null; // dt-iscrizione
  brandNumber: number | null; // n-marchio
  chamberCode: string | null; // cciaa
  assignmentDate: string | null; // dt-assegnazione
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
}

/** iscrizione-modifica */
export interface EnrollmentModification {
  enrollmentTypeCode: string | null; // c-tipo-iscrizione
  enrollmentType: string | null; // tipo-iscrizione
  filingDate: string | null; // dt-deposito
  enrollmentDate: string | null; // dt-iscrizione
  correctionFlag: boolean | null; // f-rettifica
  correctionDate: string | null; // dt-rettifica
}

/** iscrizione-ri */
export interface RegisterEnrollmentDetails {
  sections: Sections | null; // sezioni
  riAnnotationNumber: number | null; // n-annotazione-ri
  riEnrollmentNumber: number | null; // n-iscrizione-ri
  taxCodeNumber: number | null; // n-c-fiscale
  oldRiAnnotationNumber: number | null; // n-annotazione-ri-old
  oldRiEnrollmentNumber: number | null; // n-iscrizione-ri-old
  riProvince: string | null; // provincia-ri
  competentChamber: string | null; // cciaa-competente
  oldRiEnrollmentNumberCode: string | null; // c-n-iscrizione-ri-old
  enrollmentDate: string | null; // dt-iscrizione
  annotationDate: string | null; // dt-annotazione
}

/** iscrizione-rs */
export interface RegisteredOfficeRegistration {
  enrollmentDate: string | null; // dt-iscrizione
  rsNumber: number | null; // n-rs
  volumeNumber: number | null; // n-volume
  caseFileNumber: number | null; // n-fascicolo
  courtLocality: string | null; // localita-tribunale
  courtProvince: string | null; // provincia-tribunale
}

/** licenza */
export interface BusinessLicense {
  undocumentedInfo: string | null; // info-non-documentata
  bakeryLicense: BakeryLicense | null; // molini-panificatori
  licenseAuthorization: LicenseAuthorization | null; // licenza-autorizzazione
  licenseIndex: string | null; // p-licenza
  undocumentedFlag: boolean | null; // f-non-documentata
  undocumentedCode: string | null; // c-non-documentata
}

/** licenza-autorizzazione */
export interface LicenseAuthorization {
  issuingAuthorityCode: string | null; // c-autorita-rilascio
  issuingAuthority: string | null; // autorita-rilascio
  number: number | null; // n
  enrollmentDate: string | null; // dt-iscrizione
  code: string | null; // c
  type: string | null; // tipo
}

/** localizzazione */
export interface CompanyLocation {
  subTypes: LocationSubTypes | null; // sotto-tipi
  address: FullAddress | null; // indirizzo-localizzazione (placeholder)
  outOfProvinceHq: OutOfProvinceHeadquarters | null; // sede-fuori-provincia
  secondaryRegisteredOffice: SecondaryRegisteredOffice | null; // sede-secondaria-rs
  predecessorCompany: SuccessorCompany | null; // impresa-subentrata
  pursuedActivity: string | null; // attivita-esercitata
  secondaryActivity: string | null; // attivita-secondaria-esercitata
  craftsActivityBolzano: CraftsActivityBolzano | null; // attivita-aa-bz
  nonCraftsActivity: NonCraftsActivity | null; // attivita-no-aa
  activityDetails: ActivityDetails[]; // dettagli-attivita[]
  atecoClassifications2002: AtecoClassifications2002 | null; // classificazioni-ateco-2002
  atecoClassifications: AtecoClassifications[]; // classificazioni-ateco[]
  licensesAndRegisters: BusinessLicensesAndRegisters | null; // albi-ruoli-licenze
  people: People | null; // persone
  supplementaryInfo: SupplementaryInfo | null; // informazioni-supplementari
  locationCessation: LocationCessation | null; // cessazione-localizzazione
  locationTransfer: LocationTransfer | null; // trasferimento-localizzazione
  successorCompany: SuccessorCompany | null; // impresa-subentrante
  index: string | null; // progressivo
  reducedDataFlag: boolean | null; // f-dati-ridotti
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  enrollmentTypeCode: string | null; // c-tipo-iscrizione
  enrollmentType: string | null; // tipo-iscrizione
  name: string | null; // denominazione
  sign: string | null; // insegna
  openingDate: string | null; // dt-apertura
  cessationFlag: boolean | null; // f-cessazione
  euidCode: string | null; // c-euid
  accountingRecordsFlag: boolean | null; // f-scritture-contabili
}

export interface HistoricSupplementaryInfo {
  memorandumDescription: string | null; // descrizione-atto-costitutivo
  historicNews: string | null; // notizie-storiche
}

/** sotto-tipi */
export interface LocationSubTypes {
  subTypes: LocationSubType[]; // sotto-tipo[]
}

/** sotto-tipo (simpleContent) */
export interface LocationSubType {
  description: string | null; // _text
  code: string | null; // c
}

/** trasferimento-localizzazione */
export interface LocationTransfer {
  city: string | null; // comune
  province: string | null; // provincia
}

/** mestiere-aa (simpleContent) */
export interface CraftsTrade {
  description: string | null; // _text
  code: string | null; // c
  tradeDescription: string | null; // descrizione
  furtherDescription: string | null; // ulteriore-descrizione
  activityStartDate: string | null; // dt-inizio-attivita
}

/** mestieri-aa */
export interface CraftsTrades {
  trades: CraftsTrade[]; // mestiere-aa[]
}

/** modelli-trascrizioni */
export interface TemplatesAndTranscriptions {
  templates: Templates | null; // modelli
  registerTranscriptions: RegisterTranscriptions | null; // trascrizioni-ri
}

/** n-soci */
export interface ShareholdersCount {
  shareholders: string | null; // soci
  limitedPartners: string | null; // accomandatari
  administrators: string | null; // amministratori
}

/** omologazione */
export interface Homologation {
  homologationDate: string | null; // dt-omologazione
  number: number | null; // n
}

/** parametri */
export interface RequestParameters {
  requestId: string | null; // id-richiesta
  chamberAbbreviation: string | null; // sigla-cciaa
  chamberHeader: string | null; // testata-cciaa
  documentTitle: string | null; // titolo-documento
  documentPhrase: string | null; // frase-documento
  extractionDate: string | null; // dt-estrazione
}

/** partecipata */
export interface SubsidiaryCompany {
  sharesAndRights: SubsidiarySharesAndRights | null; // quote-diritti-impresa
  participationNotes: ParticipationNotes | null; // note-partecipazione
  taxCode: string | null; // c-fiscale
  name: string | null; // denominazione
  consortiumFlag: boolean | null; // f-consorzio
  cooperativeFlag: boolean | null; // f-cooperativa
  closedFlag: boolean | null; // f-cessata
  cancellationDate: string | null; // dt-cancellazione
  participationStartDate: string | null; // dt-inizio-partecipazione
  participationEndDate: string | null; // dt-fine-partecipazione
}

/** partecipazione */
export interface ParticipationEntry {
  companyDetails: CompanyDetails | null; // estremi-impresa
  practiceDetails: PracticeDetails | null; // estremi-pratica
  shareCapital: ShareCapitalEntry | null; // capitale-sociale
  frames: ShareFrames | null; // riquadri
  latestShareholdersListFlag: boolean | null; // f-ultimo-elenco-soci
  currentParagraphFlag: boolean | null; // f-paragrafo-attuale
  incompleteInfoFlag: boolean | null; // f-info-incompleta
}

/** partecipazione-utili (simpleContent) */
export interface ProfitParticipation {
  text: string | null; // _text
  participationIndex: string | null; // p-partecipazione
}

/** partita-iva (simpleContent) */
export interface VatNumberEntry {
  vatNumber: string | null; // _text
  cessationSourceCode: string | null; // c-fonte-cess
  lastUpdateDate: string | null; // dt-ultimo-aggiornamento
  cessationDate: string | null; // dt-cessazione
}

/** patti-parasociali */
export interface ShareholdersAgreements {
  votingRights: string | null; // esercizio-diritto-voto
  shareTransfer: string | null; // trasferimento-azioni-partecip
  dominantInfluence: string | null; // esercizio-influenza-dominante
  other: string | null; // altro
}

/** persona */
export interface PersonEntry {
  physicalPerson: PhysicalPersonDetails | null; // persona-fisica
  legalPerson: LegalPersonDetails | null; // persona-giuridica
  shareholderInfo: ShareholderInfo | null; // informazioni-socio
  certifiedEmail: string | null; // indirizzo-posta-certificata
  address: FullAddress | null; // indirizzo
  riAddress: FullAddress | null; // indirizzo-ri
  quota: ShareQuota | null; // quota
  roleAppointmentDeeds: RoleAppointmentDeeds | null; // atti-conferimento-cariche
  bankruptcy: Bankruptcy | null; // fallimento
  installerAuthorizations: InstallerAuthorizations | null; // abilitazioni-impiantisti
  personRoles: PersonRoles | null; // ruoli-persona
  licenses: Licenses | null; // licenze
  index: string | null; // progressivo
  reaRepresentativeFlag: boolean | null; // f-rappresentante-rea
  riRepresentativeFlag: boolean | null; // f-rappresentante-ri
  aeRepresentativeFlag: boolean | null; // f-rappresentante-ae
  administratorFlag: boolean | null; // f-amministratore
  auditorFlag: boolean | null; // f-sindaco
  electorFlag: boolean | null; // f-elettore
  modificationType: string | null; // tipo-modifica
  lastName: string | null; // cognome
  firstName: string | null; // nome
  taxCode: string | null; // c-fiscale
  chamberCode: string | null; // cciaa
  rdNumber: number | null; // n-rd
  reaNumber: number | null; // n-rea
  signatureDepositedFlag: boolean | null; // f-firma-depositata
  pcoAuthorizedFlag: boolean | null; // f-incaricato-pco
}

/** persona-fisica */
export interface PhysicalPersonDetails {
  birthDetails: BirthDetails | null; // estremi-nascita
  fiscalDomicile: FiscalDomicile | null; // domicilio-fiscale
  honoraryTitles: HonoraryTitles | null; // titoli-onorifici
  lastName: string | null; // cognome
  firstName: string | null; // nome
  taxCode: string | null; // c-fiscale
  gender: string | null; // sesso
  citizenshipCode: string | null; // c-cittadinanza
  citizenship: string | null; // cittadinanza
  legalCapacityCode: string | null; // c-capacita-di-agire
  legalCapacity: string | null; // capacita-di-agire
  educationTitleCode: string | null; // c-titolo-studio
  educationTitle: string | null; // titolo-studio
  previousOccupationCode: string | null; // c-precedente-occupazione
  previousOccupation: string | null; // precedente-occupazione
}

/** persona-giuridica */
export interface LegalPersonDetails {
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  chamberCode: string | null; // cciaa
  name: string | null; // denominazione
  riName: string | null; // denominazione-ri
  taxCode: string | null; // c-fiscale
  incorporationDate: string | null; // dt-costituzione
  incorporationStatusCode: string | null; // c-stato-costituzione
  incorporationStatus: string | null; // stato-costituzione
}

/** persona-giuridica-privata */
export interface PrivateLegalPerson {
  register: string | null; // registro
  entity: string | null; // ente
  number: number | null; // n
  enrollmentDate: string | null; // dt-iscrizione
  requirementsVerifiedFlag: boolean | null; // f-accertamento-requisiti
}

/** poteri */
export interface Powers {
  bylawsPowers: string | null; // poteri-statuto
  rolePowers: RolePower[]; // poteri-carica[]
  partnershipAgreementPowers: string | null; // poteri-patti-sociali
  partnerPowers: string | null; // poteri-soci
  jointPowers: string | null; // poteri-congiunti
  liabilityLimitations: LiabilityLimitations | null; // limitazioni-responsabilita
  profitLossDistributions: ProfitLossDistributions | null; // ripartizioni-utili-perdite
}

/** poteri-carica (simpleContent) */
export interface RolePower {
  text: string | null; // _text
  roleCode: string | null; // c-carica
  role: string | null; // carica
}

/** poteri-persona (simpleContent) */
export interface PersonPowers {
  text: string | null; // _text
  powersIndex: string | null; // p-poteri
}

/** limitazioni-responsabilita (simpleContent) */
export interface LiabilityLimitations {
  text: string | null; // _text
  inBylawsFlag: boolean | null; // f-presenza-nello-statuto
}

/** ripartizioni-utili-perdite (simpleContent) */
export interface ProfitLossDistributions {
  text: string | null; // _text
  inBylawsFlag: boolean | null; // f-presenza-nello-statuto
}

/** pratiche-soggetti-controllanti */
export interface ControllingSubjectsPractices {
  practices: ControllingSubjectsPractice[] | null; // pratica-soggetti-controllanti[]
  flagInfo: boolean | null; // f-presenza-info
}


/** pratica-soggetti-controllanti */
export interface ControllingSubjectsPractice {
  practiceDetails: PracticeDetails | null; // estremi-pratica
  controllingSubjects: ControllingSubjects | null; // soggetti-controllanti
  notes: string[]; // note[]
}

/** presentazione-cciaa */
export interface ChamberFiling {
  presentationDate: string | null; // dt-presentazione
  protocolNumber: number | null; // n-protocollo
}

/** procedure-concorsuali */
export interface InsolvencyProcedures {
  procedures: InsolvencyProcedure[]; // procedura-concorsuale[]
  flagInfo: boolean | null; // f-presenza-info
}

/** procedura-concorsuale */
export interface InsolvencyProcedure {
  deedDetails: DeedDetails | null; // estremi-atto
  declarations: Declarations | null; // dichiarazioni
  receiverCommunications: ReceiverCommunications | null; // comunicazioni-curatore
  classCode: string | null; // cl
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  procedureEnrollmentDate: string | null; // dt-iscrizione-procedura
  orderDate: string | null; // dt-provvedimento
  deedDate: string | null; // dt-atto
  deadlineDate: string | null; // dt-termine
  homologationDate: string | null; // dt-omologazione
  closureDate: string | null; // dt-chiusura
  executionDate: string | null; // dt-esecuzione
  revocationDate: string | null; // dt-revoca
  hearingDate: string | null; // dt-udienza
}

/** proprieta-quota (simpleContent) */
export interface ShareOwnership {
  text: string | null; // _text
  ownershipIndex: string | null; // p-proprieta
}

/** protocollo */
export interface FilingProtocolEntry {
  templates: Templates | null; // modelli
  deeds: Deeds | null; // atti
  registerCode: string | null; // c-albo
  progressStatusCode: string | null; // c-stato-avanzamento
  progressStatus: string | null; // stato-avanzamento
  practiceStatusCode: string | null; // c-stato-pratica
  practiceStatus: string | null; // stato-pratica
  interchamberCode: string | null; // cciaa-intercamerale
  protocolDate: string | null; // dt-protocollo
  lastModificationDate: string | null; // dt-ultima-modifica
  year: string | null; // anno
  number: number | null; // n
  uniqueFilingCompliance: string | null; // adempimento-comunica
  recipientAuthorities: string | null; // enti-destinatari
}

/** protocollo-ri */
export interface RegisterFilingProtocol {
  templatesAndTranscriptions: TemplatesAndTranscriptions | null; // modelli-trascrizioni
  deedTranscriptions: DeedTranscriptions | null; // atti-trascrizioni
  protocolNumber: number | null; // n-protocollo
  officeProtocolNumber: number | null; // n-protocollo-ufficio
  year: string | null; // anno
  protocolDate: string | null; // dt-protocollo
  interchamberCommunicationNumber: number | null; // n-comunicazione-intercamerale
  interchamberProtocolNumber: number | null; // n-protocollo-intercamerale
  interchamberCommunicationYear: string | null; // anno-comunicazione-intercam
  interchamberProtocolYear: string | null; // anno-protocollo-intercam
  companyTaxCode: string | null; // cf-impresa
  chamberName: string | null; // denom-cciaa
  preEnrollmentDeedFlag: boolean | null; // f-atto-pre-iscrizione
  notificationDate: string | null; // dt-denuncia
}

/** protocollo-rs */
export interface RegisteredOfficeFilingProtocol {
  deed: Deed | null; // atto
  registeredOfficeTranscriptions: RegisteredOfficeTranscriptions | null; // trascrizioni-rs
  referenceNumber: number | null; // n-riferimento
  orderRegisterNumber: number | null; // n-registro-ordine
  orderRegisterYear: string | null; // anno-registro-ordine
  courtMunicipalityCode: string | null; // c-comune-tribunale
  court: string | null; // tribunale
  courtProvince: string | null; // provincia-tribunale
}

/** qualifica */
export interface Qualification {
  code: string | null; // c
}

/** quota */
export interface ShareQuota {
  currencyCode: string | null; // c-valuta
  currency: string | null; // valuta
  value: string | null; // valore
  amountInEuros: string | null; // ammontare-convertito-in-euro
  percentage: string | null; // percentuale
}

/** quota-diritto / quota-diritto-impresa */
export interface ShareRight {
  rightTypeCode: string | null; // c-tipo-diritto
  rightType: string | null; // tipo-diritto
  numShares: number | null; // n-azioni
  nominalValue: string | null; // valore-nominale
  capitalPercentage: string | null; // percentuale-capitale
}

/** registrazione */
export interface DeedRegistration {
  registrationDate: string | null; // dt-registrazione
  number: number | null; // n
  registryOffice: string | null; // ufficio-registro
  registryOfficeProvince: string | null; // provincia-ufficio-registro
}

/** registro-preziosi */
export interface PreciousMetalsRegister {
  qualification: Qualification | null; // qualifica
  qualifications: Qualifications | null; // qualifiche
  publicSecurityAuthorization: PublicSecurityAuthorization | null; // autorizzazione-ps
  taxStamp: TaxStamp | null; // tassa-cg
  brand: string | null; // marchio
  roleCancellation: RoleCancellation | null; // cancellazione-ruolo
  number: number | null; // n
  applicationDate: string | null; // dt-domanda
}

/** tassa-cg */
export interface TaxStamp {
  number: number | null; // n
  date: string | null; // dt
}

/** reti-imprese */
export interface BusinessNetworks {
  networks: BusinessNetwork[] | null; // rete-imprese[]
}

/** rete-imprese */
export interface BusinessNetwork {
  referenceCompany: RelatedCompany | null; // impresa-riferimento
  repertoryNumber: number | null; // n-repertorio
  registrationNumber: number | null; // n-registrazione
  networkName: string | null; // denominazione
  taxCode: string | null; // c-fiscale
}

/** riferimenti */
export interface References {
  bylawsClauses: BylawsClauses | null; // clausole
  bylawsAmendments: string | null; // modifiche-statutarie
  bylawsDeposit: string | null; // deposito-statuto
  bylawsModification: string | null; // modifica-statuto
  companyAggregation: string | null; // aggregazione-imprese
  courtOrders: string | null; // provvedimenti-giudice
  deferredEffects: string | null; // effetti-differiti
  arbitration: string | null; // arbitrato
  suspensiveConditions: string | null; // condizioni-sospensive
  conservatorOrders: string | null; // provvedimenti-conservatore
  authorityOrders: string | null; // provvedimenti-autorita
  corporateGroups: string | null; // gruppi-societari
  participationAgreements: string | null; // accordi-partecipazione
  networkContract: string | null; // contratto-rete
  translatedDeeds: string | null; // atti-tradotti
  startUpDeclarations: StatusDeclarationsList | null; // dichiarazioni-start-up
  incubatorDeclarations: StatusDeclarationsList | null; // dichiarazioni-incubatore
  smeDeclarations: StatusDeclarationsList | null; // dichiarazioni-pmi
  schoolWorkDeclarations: StatusDeclarationsList | null; // dichiarazioni-scuola-lavoro
}

/** clausole */
export interface BylawsClauses {
  withdrawal: BylawsClause | null; // recesso
  exclusion: BylawsClause | null; // esclusione
  approval: BylawsClause | null; // gradimento
  preemption: BylawsClause | null; // prelazione
  limitation: BylawsClause | null; // limitazione
  arbitration: BylawsClause | null; // compromissorie
  other: BylawsClause | null; // altre
}

/** recesso / esclusione / etc. (simpleContent) */
export interface BylawsClause {
  text: string | null; // _text
  inBylawsFlag: boolean | null; // f-presenza-nello-statuto
}

/** riconoscimento-professionale (simpleContent) */
export interface ProfessionalRecognition {
  text: string | null; // _text
  orderDate: string | null; // dt-provvedimento
  enrollmentNumber: number | null; // n-iscrizione
}

/** riquadro */
export interface ShareFrame {
  deedType: DeedType | null; // tipo-atto
  shareComposition: ShareComposition | null; // composizione-quote
  shareRestrictions: string[]; // vincoli-quote[]
  holders: Holders | null; // titolari
  participationRights: ParticipationRights | null; // diritti-partecipazione
  notes: string[]; // note[]
  code: string | null; // c
  occurrences: number | null; // n-ricorrenze
  annotationDate: string | null; // dt-annotazione
  eventDate: string | null; // dt-evento
}

/** riquadri */
export interface ShareFrames {
  frames: ShareFrame[]; // riquadro[]
}

/** riquadro-trasferimento */
export interface TransferFrame {
  deedType: DeedType | null; // tipo-atto
  shareComposition: ShareComposition | null; // composizione-quote
  shareRestrictions: string[]; // vincoli-quote[]
  holders: Holders | null; // titolari
  notes: string[]; // note[]
  annotationDate: string | null; // dt-annotazione
  eventDate: string | null; // dt-evento
}

/** riquadri-trasferimento */
export interface TransferFrames {
  frames: TransferFrame[]; // riquadro-trasferimento[]
}

/** tipo-atto (simpleContent) */
export interface DeedType {
  description: string | null; // _text
  code: string | null; // c
}

/** tipo-conferimenti (simpleContent) */
export interface ContributionType {
  description: string | null; // _text
  code: string | null; // c
}

/** tipo-trascrizione (simpleContent) */
export interface TranscriptionType {
  text: string | null; // _text
  transcriptionTypeCode: string | null; // c-tipo-trascrizione
  modificationTypeCode: string | null; // c-tipo-modifica
  modificationType: string | null; // tipo-modifica
}

/** ruolo */
export interface RoleEntry2 {
  roleCancellation: RoleCancellation | null; // cancellazione-ruolo
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
  qualificationCode: string | null; // c-qualifica
  qualification: string | null; // qualifica
  formCode: string | null; // c-forma
  form: string | null; // forma
  number: number | null; // n
  enrollmentDate: string | null; // dt-iscrizione
  issuingBodyCode: string | null; // c-ente-rilascio
  issuingBody: string | null; // ente-rilascio
  province: string | null; // provincia
}

/** ruolo-persona */
export interface PersonRole {
  reaSection: string | null; // f-sezione-rea
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
  qualificationCode: string | null; // c-qualifica
  qualification: string | null; // qualifica
  formCode: string | null; // c-forma
  form: string | null; // forma
  number: number | null; // n
  enrollmentDate: string | null; // dt-iscrizione
  issuingBodyCode: string | null; // c-ente-rilascio
  issuingBody: string | null; // ente-rilascio
  province: string | null; // provincia
}

/** ruoli-persona */
export interface PersonRoles {
  roles: PersonRole[]; // ruolo-persona[]
}

/** sessione-aa */
export interface CraftsChangeSession {
  modifications: Modifications[]; // modifiche[]
  movementCode: string | null; // c-movimentazione
  movement: string | null; // movimentazione
  resolutionDate: string | null; // dt-delibera
  assessmentApplicationDate: string | null; // dt-domanda-accertamento
}

/** sessione-rd-rea */
export interface RegisterChangeSession {
  modifications: Modifications | null; // modifiche
  movementCode: string | null; // c-movimentazione
  movement: string | null; // movimentazione
  notificationDate: string | null; // dt-denuncia
}

/** modifiche */
export interface Modifications {
  modifications: ModificationEntry[]; // modifica[]
}

/** settore (simpleContent) */
export interface Sector {
  description: string | null; // _text
  code: string | null; // c
}

/** settori */
export interface Sectors {
  sectors: Sector[]; // settore[]
}

/** sezione */
export interface SectionEntry {
  code: string | null; // c
  description: string | null; // descrizione
  enrollmentDate: string | null; // dt-iscrizione
  lastCommunicationDate: string | null; // dt-ultima-comunicazione
  directFarmerFlag: boolean | null; // f-coltivatore-diretto
  aaChamberdCode: string | null; // cciaa-aa
  aaNumber: number | null; // n-aa
  pendingDecisionFlag: boolean | null; // f-attesa-decisione
  effectDate: string | null; // dt-decorrenza
}

/** sezioni */
export interface Sections {
  sections: SectionEntry[]; // sezione[]
}

/** sistema-amministrazione (simpleContent) */
export interface AdministrationSystem {
  text: string | null; // _text
  code: string | null; // c
}

/** socio */
export interface Shareholder {
  personalInfo: HolderPersonalInfo | null; // anagrafica-titolare
  sharesAndRights: SharesAndRights | null; // quote-diritti
}

/** soggetto-controllante */
export interface ControllingSubject {
  notes: string[]; // note[]
  name: string | null; // denominazione
  taxCode: string | null; // c-fiscale
  incorporationDate: string | null; // dt-costituzione
  countryCode: string | null; // c-stato
  country: string | null; // stato
  chamberCode: string | null; // cciaa
  reaNumber: number | null; // n-rea
  referenceDate: string | null; // dt-riferimento
  declarationTypeCode: string | null; // c-tipo-dichiarazione
  declarationType: string | null; // tipo-dichiarazione
  controlTypeCode: string | null; // c-tipo-controllo
  controlType: string | null; // tipo-controllo
}

/** soggetti-controllanti */
export interface ControllingSubjects {
  subjects: ControllingSubject[]; // soggetto-controllante[]
}

/** soggetto-controllo-contabile (simpleContent) */
export interface AccountingControlBody {
  text: string | null; // _text
  code: string | null; // c
}

/** societa-cooperativa */
export interface CooperativeSociety {
  presentationDate: string | null; // dt-presentazione
  enrollmentNumber: number | null; // n-iscrizione
  enrollmentDate: string | null; // dt-iscrizione
  sectionCode: string | null; // c-sezione
  section: string | null; // sezione
  subSectionCode: string | null; // c-sotto-sezione
  subSection: string | null; // sotto-sezione
  categoryCode: string | null; // c-categoria
  category: string | null; // categoria
  activityCategoryCode: string | null; // c-categoria-attivita-eserc
  activityCategory: string | null; // categoria-attivita-esercitata
  governanceTypeCode: string | null; // c-tipo-forma-amministrativa
  numShareholders: number | null; // n-soci
}

/** societa-quotata */
export interface ListedCompany {
  fromYear: string | null; // anno-dal
  toYear: string | null; // anno-al
  market: string | null; // mercato
  sourceCode: string | null; // c-fonte
  source: string | null; // fonte
  lastUpdateDate: string | null; // dt-ultimo-aggiornamento
  lastFinancialStatementDate: string | null; // dt-ultimo-deposito-es
}

/** storia-cciaa-provenienza / storia-sede-precedente */
export interface PreviousHeadquartersRecord {
  changesHistory: ChangesHistoryRecord | null; // mad
  transcriptions: Transcriptions | null; // trascrizioni
  chamberCode: string | null; // cciaa
  reaNumber?: number | null; // n-rea (only storia-sede-precedente)
}

/** storia-attivita */
export interface ActivityHistory {
  atecoClassifications2002: AtecoClassifications2002 | null; // classificazioni-ateco-2002
  atecoClassifications: AtecoClassifications[]; // classificazioni-ateco[]
}

/** storia-addetti */
export interface WorkforceHistory {
  entries: CompanyWorkforce[]; // addetti-impresa[]
}

/** subentro */
export interface BusinessSuccession {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  name: string | null; // denominazione
  taxCode: string | null; // c-fiscale
  chamberCode: string | null; // cciaa
  reaNumber: number | null; // n-rea
  riNumber: number | null; // n-ri
  titleCode: string | null; // c-titolo
  title: string | null; // titolo
}

/** ta-fusioni-scissioni-subentri */
export interface CorporateRestructuring {
  companyTransfers: CompanyTransfers | null; // trasferimenti-azienda
  mergersAndSplits: MergersAndSplits | null; // fusioni-scissioni
  declarations: Declarations | null; // dichiarazioni
  businessSuccessions: BusinessSuccessions | null; // subentri-impresa
  hasInfoFlag: boolean | null; // f-presenza-info
}

/** tabella-elenco-soci */
export interface ShareholdersTableEntry {
  shareholders: Shareholders | null; // soci
  shareholderNotes: ShareholderNotes | null; // note-elenco-soci
}

/** tabella-partecipate-impresa */
export interface SubsidiaryCompaniesTable {
  subsidiaries: SubsidiaryCompany[]; // partecipata[]
  typeCode: string | null; // c-tipo-partecipate
  type: string | null; // tipo-partecipate
}

/** titolare */
export interface HolderEntry {
  personalInfo: HolderPersonalInfo | null; // anagrafica-titolare
  domicile: DomicileAddress | null; // domicilio
  riDomicile: DomicileAddress | null; // domicilio-ri
  certifiedEmail: string | null; // indirizzo-posta-certificata
  participationRight: ParticipationRight | null; // diritto-partecipazione
  notes: string[]; // note[]
  statusCode: string | null; // c-situazione
  status: string | null; // situazione
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  representativeFlag: boolean | null; // f-rappresentante
}

/** titolari */
export interface Holders {
  holders: HolderEntry[]; // titolare[]
  notes: string[]; // note[]
}

/** titolo-onorifico (simpleContent) */
export interface HonoraryTitle {
  text: string | null; // _text
  code: string | null; // c
}

/** titoli-onorifici */
export interface HonoraryTitles {
  titles: HonoraryTitle[]; // titolo-onorifico[]
}

/** trascrizione-prot-completi */
export interface CompleteFilingTranscription {
  transcriptionIndex: string | null; // progressivo-trascrizione
  enrollmentDate: string | null; // dt-iscrizione
  transcriptionTypeCode: string | null; // c-tipo-trascrizione
  transcriptionType: string | null; // tipo-trascrizione
}

/** trascrizione-ri */
export interface RegisterTranscription {
  person: PersonEntry | null; // persona
  transcriptionType: TranscriptionType | null; // tipo-trascrizione
  descriptions: Descriptions | null; // descrizioni
  enrollmentModification: EnrollmentModification | null; // iscrizione-modifica
  transcriptionIndex: string | null; // p-trascrizione
  modificationTypeCode: string | null; // c-tipo-modifica
  modificationType: string | null; // tipo-modifica
}

/** trascrizioni-ri */
export interface RegisterTranscriptions {
  transcriptions: RegisterTranscription[]; // trascrizione-ri[]
}

/** trascrizione-rs */
export interface RegisteredOfficeTranscription {
  person: PersonEntry | null; // persona
  transcriptionType: TranscriptionType | null; // tipo-trascrizione
  descriptions: Descriptions | null; // descrizioni
  transcriptionIndex: string | null; // p-trascrizione
  modificationTypeCode: string | null; // c-tipo-modifica
  modificationType: string | null; // tipo-modifica
}

/** trascrizioni-rs */
export interface RegisteredOfficeTranscriptions {
  transcriptions: RegisteredOfficeTranscription[]; // trascrizione-rs[]
}

/** trascrizioni */
export interface Transcriptions {
  registeredOfficeProtocols: RegisteredOfficeProtocols | null; // protocolli-rs
  registerProtocols: RegisterProtocols | null; // protocolli-ri
}

/** trasferimento */
export interface CompanyTransfer {
  companyDetails: CompanyDetails | null; // estremi-impresa
  practiceDetails: PracticeDetails | null; // estremi-pratica
  frames: ShareFrames | null; // riquadri
  afterLastFiscalYearFlag: boolean | null; // f-successivo-ultimo-es
}

/** trasferimento-azienda */
export interface BusinessTransfer {
  practiceDetails: PracticeDetails | null; // estremi-pratica
  deedInfo: DeedInfo | null; // informazioni-atto
  notes: string[]; // note[]
}

/** informazioni-atto */
export interface DeedInfo {
  holders: Holders | null; // titolari
  repertoryNumber: number | null; // n-repertorio
  notary: string | null; // notaio
  purposeCode: string | null; // c-oggetto
  purpose: string | null; // oggetto
}

/** trasferimento-quote */
export interface ShareTransfer {
  practiceDetails: PracticeDetails | null; // estremi-pratica
  transferFrames: TransferFrames | null; // riquadri-trasferimento
  notes: string[]; // note[]
  simultaneousFlag: boolean | null; // f-contestuale
}

/** trasferimento-sede */
export interface HeadquartersTransfer {
  city: string | null; // comune
  province: string | null; // provincia
  topographyCode: string | null; // c-toponimo
  topography: string | null; // toponimo
  street: string | null; // via
  streetNumber: number | null; // n-civico
  reaNumber: number | null; // n-rea
  rdNumber: number | null; // n-rd
  aaNumber: number | null; // n-aa
}

/** trasferimento-sede-ul-attiva */
export interface ActiveLocalUnitTransfer {
  reasonCode: string | null; // c-causale
  reason: string | null; // causale
  date: string | null; // dt
}

/** trasferimento-altro-registro */
export interface OtherRegisterTransfer {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
}

/** ulteriore-dettaglio (simpleContent) */
export interface AdditionalDetail {
  text: string | null; // _text
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
}

/** ulteriori-dettagli */
export interface AdditionalDetails {
  details: AdditionalDetail[]; // ulteriore-dettaglio[]
}

/** variazioni-forma-giuridica */
export interface LegalFormChanges {
  changes: LegalFormChange[]; // variazione-forma-giuridica[]
}

/** variazione-forma-giuridica */
export interface LegalFormChange {
  deedDetails: DeedDetails | null; // estremi-atto
  changeIndex: string | null; // p-variazione
  oldCode: string | null; // c-old
  oldValue: string | null; // old
  newCode: string | null; // c-new
  newValue: string | null; // new
  deedDate: string | null; // dt-atto
}

// =============================================================================
// Container/collection types referenced above
// =============================================================================

export interface CorporateEvents {
  events: CorporateEvent[]; // evento[]
}

export interface Declarations {
  declarations: Declaration[]; // dichiarazione[]
}

export interface RegistrationDetails {
  details: RegistrationDetail[]; // dettaglio-iscrizione[]
}

export interface Descriptions {
  descriptions: string[]; // descrizione[]
}

export interface StatusDeclarationsList {
  declarations: StatusDeclaration[]; // dichiarazione-incubatore[] / pmi[] etc.
}

export interface Licenses {
  licenses: BusinessLicense[]; // licenza[]
}

export interface People {
  people: PersonEntry[]; // persona[]
}

export interface Templates {
  templates: TemplateEntry[]; // modello[]
}

export interface TemplateEntry {
  frames: ShareFrames | null; // riquadri
  code: string | null; // c
  occurrences: number | null; // n-ricorrenze
}

export interface ParticipationNotes {
  notes: ParticipationNote[]; // nota-partecipazione[]
}

export interface ParticipationNote {
  text: string | null; // _text
  code: string | null; // c
}

export interface ShareholderNotes {
  notes: ShareholderNote[]; // nota-elenco-soci[]
}

export interface ShareholderNote {
  text: string | null; // _text
  code: string | null; // c
}

export interface Qualifications {
  qualification: Qualification | null;
}

export interface ProfessionalQualifications {
  text: string | null; // _text
  qualificationsIndex: string | null; // p-abilitazioni
}

export interface ShareholderInfo {
  info: ShareholderInfoEntry[]; // informazione-socio[]
}

export interface ShareholderInfoEntry {
  text: string | null; // _text
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
}

export interface SharesAndRights {
  rights: ShareRight[]; // quota-diritto[]
}

export interface SubsidiarySharesAndRights {
  rights: ShareRight[]; // quota-diritto-impresa[]
}

export interface Shareholders {
  shareholders: Shareholder[]; // socio[]
}

export interface ParticipationRights {
  rights: ParticipationRight[]; // diritto-partecipazione[]
}

export interface RegisteredOfficeProtocols {
  protocols: RegisteredOfficeFilingProtocol[]; // protocollo-rs[]
}

export interface RegisterProtocols {
  protocols: RegisterFilingProtocol[]; // protocollo-ri[]
}

export interface BusinessLicensesAndRegisters {
  craftsData: CraftsData | null; // dati-artigiani
  professionalRecognitions: ProfessionalRecognitions | null; // riconoscimenti-professionali
  installerAuthorizations: InstallerAuthorizations | null; // abilitazioni-impiantisti
  cleaningAuthorization: CleaningAuthorization | null; // abilitazione-pulizia
  porteringAuthorization: PorteringAuthorization | null; // abilitazione-facchinaggio
  roles: Roles | null; // ruoli
  preciousMetalsRegister: PreciousMetalsRegister | null; // registro-preziosi
  businessStartNotifications: BusinessStartNotifications | null; // denunce-inizio-attivita
  licenses: Licenses | null; // licenze
  moralRequirements: MoralRequirements | null; // requisiti-morali-professionali
  retailTrade: RetailTrade | null; // commercio-dettaglio
  cooperativeSociety: CooperativeSociety | null; // societa-cooperativa
  regionalCooperativeRegister: RegionalCooperativeRegister | null; // albo-regionale-coop-sociali
  brandAssignees: BrandAssignees | null; // assegnatari-marchio
  environmentalDeclarations: EnvironmentalDeclarationsList | null; // dichiarazioni-ambientali
}

export interface ProfessionalRecognitions {
  recognitions: ProfessionalRecognition[]; // riconoscimento-professionale[]
}

export interface Roles {
  roles: RoleEntry2[]; // ruolo[]
}

export interface BusinessStartNotifications {
  notifications: BusinessStartNotification[]; // denuncia-inizio-attivita[]
}

export interface MoralRequirements {
  requirements: MoralRequirement[]; // requisito-morale-professionale[]
}

export interface MoralRequirement {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  statusCode: string | null; // c-stato
  status: string | null; // stato
  entityCode: string | null; // c-ente
  entity: string | null; // ente
  notificationDate: string | null; // dt-denuncia
  assessmentDate: string | null; // dt-accertamento
  expiryDate: string | null; // dt-decadenza
  additionalDetails: string | null; // ulteriori-specifiche
}

export interface RegionalCooperativeRegister {
  sections: Sections | null; // sezioni
  interventionAreas: InterventionAreas | null; // aree-intervento
  registerDescription: string | null; // desc-albo
  enrollmentDate: string | null; // dt-iscrizione
  cancellationDate: string | null; // dt-cancellazione
}

export interface EnvironmentalDeclarationsList {
  declarations: EnvironmentalDeclarationEntry[]; // dichiarazione-ambientale[]
}

export interface CompanyTransfers {
  transfers: BusinessTransfer[]; // trasferimento-azienda[]
}

export interface BusinessSuccessions {
  predecessor: SuccessorCompany | null; // impresa-subentrata
  successions: Succession[]; // subentri → subentro[]
  successor: SuccessorCompany | null; // impresa-subentrante
}

export interface Succession {
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  name: string | null; // denominazione
  taxCode: string | null; // c-fiscale
  chamberCode: string | null; // cciaa
  reaNumber: number | null; // n-rea
  riNumber: number | null; // n-ri
  titleCode: string | null; // c-titolo
  title: string | null; // titolo
}

export interface ChangesHistoryRecord {
  registerChangeSessions: RegisterChangeSession[]; // sessioni-rd-rea → sessione-rd-rea[]
  craftsChangeSessions: CraftsChangeSession[]; // sessioni-aa → sessione-aa[]
}

export interface BakeryLicense {
  bakerySection: BakerySection | null; // panificatori
  millSection: MillSection | null; // molini
  typeCode: string | null; // c-tipo
  type: string | null; // tipo
  number: number | null; // n
  enrollmentDate: string | null; // dt-iscrizione
  status: string | null; // stato
  management: string | null; // conduzione
  name: string | null; // denominazione
  startDate: string | null; // dt-inizio-rapporto
  endDate: string | null; // dt-fine-rapporto
}

export interface BakerySection {
  plantCharacteristics1: PlantCharacteristics | null; // caratteristiche-impianto-1
  plantCharacteristics2: PlantCharacteristics | null; // caratteristiche-impianto-2
  equipment: BakeryEquipment | null; // apparecchi
}

export interface MillSection {
  cerealCapacities: CerealCapacities | null; // potenze-cereali-macchinari
  storage: Storage | null; // stoccaggio
  category: string | null; // categoria
}

export interface CerealCapacities {
  entries: CerealCapacity[]; // potenza-cereali-macchinari[]
}

export interface CerealCapacity {
  machinery: Machinery | null; // macchinari
  nominalCapacityQuintals: string | null; // quintali-potenza-nominale
  actualCapacityQuintals: string | null; // quintali-potenza-reale
  cerealType: string | null; // tipo-cereale
  otherCerealType: string | null; // altro-tipo-cereale
}

export interface Machinery {
  characteristic1: string | null; // caratteristica-1
  characteristic2: string | null; // caratteristica-2
  characteristic3: string | null; // caratteristica-3
  characteristic4: string | null; // caratteristica-4
  cleaningMachinesFlag: boolean | null; // f-apparecchi-pulitura
}

export interface Storage {
  warehouses: string | null; // magazzini
  silos: string | null; // silos
}

// =============================================================================
// English mapped types — top-level blocks (already in original file)
// =============================================================================

/** riconoscimento */
export interface Recognition {
  positionId: string | null; // IdentificativoPosizione
  returnedOutput: string | null; // OutputRestituiti
}

/** indirizzo-localizzazione */
export interface Address {
  street: string | null; // via
  streetNumber: number | null; // n-civico
  city: string | null; // comune
  province: string | null; // provincia
  postalCode: string | null; // cap
  topographyCode: string | null; // c-toponimo
  topographyName: string | null; // toponimo
}

export interface CompanyRepresentative {
  lastName: string | null; // cognome
  firstName: string | null; // nome
  role: string | null; // carica
  isRegisteredRepresentative?: boolean | null; // f-rappresentante-ri
}

export interface CompanyIdentification {
  activityStatus: { text: string | null; code: string | null }; // stato-attivita
  legalForm: { text: string | null; code: string | null }; // forma-giuridica
  locationAddress: Address; // indirizzo-localizzazione
  certifiedEmail: string | null; // indirizzo-posta-certificata
  representatives: {
    representative: CompanyRepresentative | CompanyRepresentative[] | null;
  }; // persone-rappresentanti
  isInterchamberOffice: boolean | null; // f-sede-intercamerale
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
  cciaaCode: string | null; // c-cciaa-competente
  cciaaName: string | null; // cciaa-competente
  cciaaAbbreviation: string | null; // cciaa
  reaNumber: number | null; // n-rea
}

export interface ActivitySummary {
  importExportFlag: boolean | null; // f-import-export
  registersAndEnvironmentalRolesFlag: boolean | null; // f-albi-ruoli-licenze
  networkContractFlag: boolean | null; // f-contratto-rete
  soaCertificationsFlag: boolean | null; // f-attestazioni-soa
  qualityCertificationsFlag: boolean | null; // f-certificazioni-qualita
  environmentalRegistersFlag: boolean | null; // f-albi-registri-ambientali
  startDate: string | null; // dt-inizio
  ratingScore: string | null; // punteggio-rating-legalita
  mainActivityDescription: string | null; // attivita-prevalente-r
  pursuedActivityDescription: string | null; // attivita-esercitata-r
  agriculturalActivityDescription: string | null; // attivita-agricola-r
  aaActivityDescription: string | null; // attivita-aa-r
  atecoClassification: {
    activityCode: string | null;
    activityDescription: string | null;
    relevanceCode: string | null;
    relevanceDescription: string | null;
    naceCode: string;
    startDate: string | null;
    referenceDate: string | null;
    sourceCode: string | null;
    sourceDescription: string | null;
  }; // classificazione-ateco
}

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

export interface OfficePerson {
  index: string | null; // progressivo
  isRegisteredRepresentative?: boolean | null;
  isAdministrator?: boolean | null;
  isAuditor?: boolean | null;
  physicalPerson: PhysicalPerson; // persona-fisica
  certifiedEmail?: string | null; // indirizzo-posta-certificata
  roleAssignments: { roleAssignmentGroup: RoleAssignmentGroup[] }; // atti-conferimento-cariche
}

export interface FinancialSummary {
  yearlyFilings: {
    startDate: string | null;
    count: number | null;
  } | null;
  investedCapital: InvestedCapitalInfo | null;
  consortiumFund: ConsortiumFundInfo | null;
  nominalValueInjections: NominalValueInjectionInfo | null;
  shareCapital: ShareCapitalInfo | null;
  balanceSheetData: BalanceSheetDataInfo | null;
  numLocalizations: number | null;
  numAdministrators: number | null;
  numMayors: number | null;
  numOfficeHolders: number | null;
  numShareholders: number | null;
  numEmployees: number | null;
  employeesDate: string | null;
  numHeadquartersTransfers: number | null;
  numShareTransfers: number | null;
  flagCorporateHoldings: boolean | null;
  flagHistoricCorporateHoldings: boolean | null;
  flagControlledCompany: boolean | null;
  numOpenProtocols: number | null;
}

export interface BalanceSheetDataInfo {
  year: string | null;
  profitLoss: number | null;
  revenue: number | null;
  productionValue: number | null;
}

export interface InvestedCapitalInfo {
  currencyCode: string | null;
  currencyName: string | null;
  amount: number | null;
  amountInEuro: number | null;
}

export interface NominalValueInjectionInfo {
  currencyCode: string | null;
  currencyName: string | null;
  amount: number | null;
  amountInEuro: number | null;
}

export interface ConsortiumFundInfo {
  descriptions: {
    description: string | null;
  } | null;
  currencyCode: string | null;
  currencyName: string | null;
  amount: number | null;
  amountInEuro: number | null;
}

export interface ShareCapitalInfo {
  currencyCode: string | null;
  currencyName: string | null;
  amount: number | null;
  deliberatedAmount: number | null;
  subscribedAmount: number | null;
  paidAmount: number | null;
  numShares: number | null;
  numQuotas: number | null;
  conferimentTypes: {
    code: string | null;
    description: string | null;
  } | null;
}

export interface HeadquartersInfo {
  phoneNumber: string | null;
  faxNumber: string | null;
  telefaxNumber: string | null;
  certifiedEmail: string | null;
  website: string | null;
  email: string | null;
  legalMail: string | null;
  otherHeadquarterFunctions: string | null;
  reaRegistration: {
    reaNumber: string | null;
  } | null;
  vatNumber: string | null;
  legalEntityIdentifierCode: {
    code: string | null;
    sourceCode: string | null;
    source: string | null;
    expirationDate: string | null;
  } | null;
  companySign: string | null;
  euid: EuropeanUniqueIdentifier | null;
  transferOrigin: {
    chamberCode: string | null;
    reaNumber: string | null;
  } | null;
  supplementaryInformation: SupplementaryInfo | null;
}

export interface IncorporationActDetails {
  typeCode: string | null;
  type: string | null;
  repertoryNumber: string | null;
  notary: string | null;
  notaryLocality: string | null;
  notaryProvince: string | null;
}

export interface ActivityInfo {
  companyStartDate: string | null;
  primaryActivity: string | null;
  secondaryActivity: string | null;
  atecoClassifications: ActivityAtecoClassifications | null;
  certifications: CompanyCertifications | null;
  companyEmployees: EmployeeInfo[];
  employeesByMunicipality: MunicipalityEmployeeInfo[];
}

export interface ActivityAtecoClassifications {
  codingCode: string | null;
  coding: string | null;
  classifications: ActivityAtecoClassification[];
}

export interface ActivityAtecoClassification {
  activityCode: string | null;
  activity: string | null;
  relevanceCode: string | null;
  relevance: string | null;
  sourceCode: string | null;
  source: string | null;
}

export interface CompanyCertifications {
  lastUpdateDate: string | null;
  certifications: CompanyCertification[];
}

export interface CompanyCertification {
  accreditationSchemaCode: string | null;
  accreditationSchema: string | null;
  referenceStandard: string | null;
  certificateNumber: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  certifierName: string | null;
  certifierTaxCode: string | null;
}

export interface EmployeeInfo {
  informationTypeCode: string | null;
  informationType: string | null;
  year: string | null;
  declarationDate: string | null;
  surveyDate: string | null;
  monthlyDetails: EmployeeMonthlyDetail[];
  contractDistribution: unknown;
  workingHoursDistribution: unknown;
  qualificationDistribution: unknown;
}

export interface EmployeeMonthlyDetail {
  monthCode: string | null;
  numEmployees: number | null;
  numSelfEmployed: number | null;
  total: string | null;
}

export interface MunicipalityEmployeeInfo {
  municipalityCode: string | null;
  municipality: string | null;
  province: string | null;
  localUnits: string[];
  monthlyDetails: EmployeeMonthlyDetail[];
  averageValues: {
    employees: string | null;
    selfEmployed: string | null;
    total: string | null;
  } | null;
}

export interface LicensesAndRegisters {
  environmentalDeclarations: EnvironmentalDeclaration[];
}

export interface EnvironmentalDeclaration {
  typeCode: string | null;
  type: string | null;
  sourceCode: string | null;
  source: string | null;
  provinceSection: string | null;
  number: number | null;
  extraFields: Record<string, unknown>;
}

export interface OfficePeople {
  people: OfficePersonDetail[];
}

export interface OfficePersonDetail {
  index: string | null;
  isRegisteredRepresentative: string | null;
  isAdministrator: string | null;
  isAuditor: string | null;
  physicalPerson: {
    lastName: string | null;
    firstName: string | null;
    taxCode: string | null;
    gender: string | null;
    birthInfo: {
      date: string | null;
      city: string | null;
      province: string | null;
    } | null;
  } | null;
  legalPerson: {
    name: string | null;
    taxCode: string | null;
  } | null;
  certifiedEmail: string | null;
  address: Address | null;
  roleAssignmentGroups: RoleAssignmentGroup[];
}

export interface ShareholdersList {
  shareholdersReferenceDate: string | null;
  isLatestShareholdersList: string | null;
  practiceDetails: {
    practiceCode: string | null;
    filingTypeCode: string | null;
    filingType: string | null;
    deedDate: string | null;
    chamberCode: string | null;
    year: string | null;
    number: number | null;
    protocolDate: string | null;
    filingDate: string | null;
  } | null;
  shareCapital: ShareCapitalInfo | null;
  frames: ShareholderFrame[];
  notes: string | null;
}

export interface ShareholderFrame {
  composition: {
    currencyCode: string | null;
    currencyName: string | null;
    nominalValue: string | null;
    paidValue: string | null;
  } | null;
  holders: ShareholderHolder[];
}

export interface ShareholderHolder {
  isRepresentative: string | null;
  domicile: Address | null;
  holderIdentity: {
    typeCode: string | null;
    type: string | null;
    taxCode: string | null;
    name: string | null;
    lastName: string | null;
    firstName: string | null;
  } | null;
  participationRight: {
    rightTypeCode: string | null;
    rightType: string | null;
  } | null;
}

export interface ShareholdersTable {
  shareholders: unknown[];
}

export interface ChangesHistory {
  sessions: ChangeSession[];
}

export interface ChangeSession {
  movementCode: string | null;
  movement: string | null;
  filingDate: string | null;
  changes: ChangeEntry[];
}

export interface ChangeEntry {
  paragraphCode: string | null;
  effectiveDate: string | null;
  typeCode: string | null;
  type: string | null;
  changeCode: string | null;
  changeCodeDescription: string | null;
  text: string | null;
}

export interface FilingsTranscriptions {
  protocols: FilingProtocol[];
}

export interface FilingProtocol {
  protocolNumber: string | null;
  officeProtocolNumber: string | null;
  year: string | null;
  protocolDate: string | null;
  extraFields: Record<string, unknown>;
}

export interface PreviousHeadquartersHistory {
  entries: PreviousHeadquartersEntry[];
}

export interface PreviousHeadquartersEntry {
  chamberCode: string | null;
  reaNumber: string | null;
  changesHistory: ChangesHistory | null;
  filingsTranscriptions: FilingsTranscriptions | null;
}

export interface RegisterEnrollment {
  enrollmentNumber: string | null;
  provinceCode: string | null;
  chamberName: string | null;
  enrollmentDate: string | null;
  sections: unknown[];
}

export interface BylawsInfo {
  incorporationDate: string | null;
  companyEndDate: string | null;
  corporatePurpose: string | null;
  bylawsPowers: string | null;
}

export interface GovernanceAndControl {
  shareholders?: {
    shareholders: string | null;
    generalParterns: string | null;
    administrators: string | null;
  }
  administrationSystem: {
    code: string | null;
    text: string | null;
  } | null;
  accountingControlBody: AccountingControlBody | null;
  administrativeForms: GovernanceForms | null;
  activeAdministrativeForms: ActiveGovernanceForms | null;
  controlBodiesInCharge: ControlBodiesInCharge | null;
  auditingBoard: AuditingBoard | null;
  activeAuditingBoard: ActiveAuditingBoard | null;
}

export interface FinancialAssetInfo {
  shareCapital: ShareCapitalInfo | null;
}

export interface MergersSplitsTransfers {
  companySuccessions: unknown[];
}
