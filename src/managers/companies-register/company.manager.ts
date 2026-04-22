import {
  AnagraficaImpresa,
  ParsedBlocchiImpresaResponse,
} from 'src/types/aiws.types';
import { CompanySummary } from 'src/types/companies-register/company.types';
import {
  AIWSError,
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  pushAIWSError,
} from 'src/types/aiws-error.type';
import { CompanyRegistryBlocksSummary } from 'src/types/companies-register/administrative-data-company.types';

export class CompanyManager {
  private toYesNoFlag(value: string | null | undefined): boolean | undefined {
    return value === 'S' ? true : value === 'N' ? false : undefined;
  }

  private toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const numeric = Number(value);
    return Number.isNaN(numeric) ? null : numeric;
  }

  private mapAmountInfo(value?: {
    'c-valuta'?: string;
    valuta?: string;
    ammontare?: string;
    'ammontare-convertito-in-euro'?: string;
  }) {
    if (!value) return null;

    return {
      currencyCode: value['c-valuta'] ?? null,
      currencyName: value.valuta ?? null,
      amount: this.toNumber(value.ammontare),
      amountInEuro: this.toNumber(value['ammontare-convertito-in-euro']),
    };
  }

  private mapShareCapitalInfo(capital?: {
    'c-valuta'?: string;
    valuta?: string;
    ammontare?: string;
    deliberato?: { ammontare?: string };
    sottoscritto?: { ammontare?: string };
    versato?: { ammontare?: string };
    'n-azioni'?: string;
    'n-quote'?: string;
    'tipo-conferimenti'?: {
      c?: string;
      '#text'?: string;
    };
  }) {
    if (!capital) return null;

    return {
      currencyCode: capital['c-valuta'] ?? null,
      currencyName: capital.valuta ?? null,
      amount: this.toNumber(capital.ammontare),
      deliberatedAmount: this.toNumber(capital.deliberato?.ammontare),
      subscribedAmount: this.toNumber(capital.sottoscritto?.ammontare),
      paidAmount: this.toNumber(capital.versato?.ammontare),
      numShares: this.toNumber(capital['n-azioni']),
      numQuotas: this.toNumber(capital['n-quote']),
      conferimentTypes: capital['tipo-conferimenti']
        ? {
            code: capital['tipo-conferimenti'].c ?? null,
            description: this.getXmlText(capital['tipo-conferimenti']),
          }
        : null,
    };
  }

  private getXmlText(value?: {
    _text?: string;
    '#text'?: string;
  }): string | null {
    if (!value) return null;
    return value._text ?? value['#text'] ?? null;
  }

  private toArray<T>(value: T | T[] | undefined): T[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  private toSingleOrNull<T>(value: T | T[] | undefined): T | null {
    if (!value) return null;
    return Array.isArray(value) ? (value[0] ?? null) : value;
  }

  private mapAddress(address?: {
    via?: string;
    'n-civico'?: string;
    comune?: string;
    provincia?: string;
    cap?: string;
    'c-toponimo'?: string;
    toponimo?: string;
  }): {
    street: string | null;
    streetNumber: number | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    topographyCode: string | null;
    topographyName: string | null;
  } | null {
    if (!address) return null;

    return {
      street: address.via ?? null,
      streetNumber: this.toNumber(address['n-civico']),
      city: address.comune ?? null,
      province: address.provincia ?? null,
      postalCode: address.cap ?? null,
      topographyCode: address['c-toponimo'] ?? null,
      topographyName: address.toponimo ?? null,
    };
  }

  private mapShareCapital(capital?: {
    'c-valuta'?: string;
    valuta?: string;
    ammontare?: string;
    sottoscritto?: { ammontare?: string };
    versato?: { ammontare?: string };
  }) {
    if (!capital) return null;

    return {
      currencyCode: capital['c-valuta'] ?? null,
      currencyName: capital.valuta ?? null,
      amount: capital.ammontare ?? null,
      subscribedAmount: capital.sottoscritto?.ammontare ?? null,
      paidAmount: capital.versato?.ammontare ?? null,
    };
  }

  public async mapAnagraficaImpresaToCompanySummary(
    impresa: AnagraficaImpresa,
    errors: AIWSError = [],
  ): Promise<CompanySummary> {
    if (!impresa) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED,
        [],
        AIWS_ERROR_MESSAGES.COMPANY_SUMMARY_FETCH_FAILED,
      );
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
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED,
        ['companyName'],
        AIWS_ERROR_MESSAGES.COMPANY_SUMMARY_FETCH_FAILED,
      );
    }
    if (!impresa.PIva) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED,
        ['vatNumber'],
        AIWS_ERROR_MESSAGES.COMPANY_SUMMARY_FETCH_FAILED,
      );
    }
    if (!impresa.Cciaa) {
      pushAIWSError(
        errors,
        AIWS_ERROR_CODE.COMPANY_SUMMARY_FETCH_FAILED,
        [],
        AIWS_ERROR_MESSAGES.COMPANY_SUMMARY_FETCH_FAILED,
      );
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
      companyAtecoClassificationCode:
        impresa.ClassificazioneAteco?.CodCodifica || 0,
      companyAtecoClassificationDescription:
        impresa.ClassificazioneAteco?.DescCodifica || '',

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

  public async mapBlocchiImpresaToCompanyRegistryBlocksSummary(
    raw: ParsedBlocchiImpresaResponse,
  ): Promise<CompanyRegistryBlocksSummary> {
    const data = raw.Risposta.dati;
    const blocchiImpresa = data['blocchi-impresa'];
    const datiIdentificativi = blocchiImpresa['dati-identificativi'];
    const sintesiAttivita = blocchiImpresa['sintesi-attivita'];
    const classificazioneAteco = sintesiAttivita?.['classificazione-ateco'];

    const representativeSource =
      datiIdentificativi?.['persone-rappresentanti']?.[
        'persona-rappresentante'
      ];

    const representative = representativeSource
      ? this.toArray(representativeSource).map((item) => ({
          lastName: item.cognome ?? null,
          firstName: item.nome ?? null,
          role: item.carica ?? null,
          isRegisteredRepresentative: this.toYesNoFlag(
            item['f-rappresentante-ri'],
          ),
        }))
      : null;

    const financialSummaryRaw = blocchiImpresa['sintesi-cifre-impresa'];
    const headquartersInfoRaw = blocchiImpresa['info-sede'];
    const cancellationOrTransferRaw =
      blocchiImpresa['cancellazione-trasferimento'];
    const incorporationActRaw = blocchiImpresa['estremi-atto-costituzione'];
    const activityInfoRaw = blocchiImpresa['info-attivita'];
    const activityHistoryRaw = blocchiImpresa['storia-attivita'];
    const workforceHistoryRaw = blocchiImpresa['storia-addetti'];
    const licensesAndRegistersRaw = blocchiImpresa['albi-ruoli-licenze'];
    const officePeopleRaw = blocchiImpresa['persone-sede'];
    const localizationsRaw = blocchiImpresa.localizzazioni;
    const listedCompanyInfoRaw = blocchiImpresa['societa-quotata'];
    const shareholdersListRaw = blocchiImpresa['elenco-soci'];
    const shareholdersTableRaw = blocchiImpresa['tabella-elenco-soci'];
    const shareholdersBookAnnotationsRaw =
      blocchiImpresa['annotazioni-libro-soci'];
    const controllingSubjectsPracticesRaw =
      blocchiImpresa['pratiche-soggetti-controllanti'];
    const subsidiaryCompaniesTableRaw =
      blocchiImpresa['tabella-partecipate-impresa'];
    const changesHistoryRaw = blocchiImpresa.mad;
    const filingsTranscriptionsRaw = blocchiImpresa.trascrizioni;
    const previousHeadquartersHistoryRaw =
      blocchiImpresa['storia-sedi-precedenti'];
    const registerEnrollmentRaw = blocchiImpresa['iscrizione-ri'];
    const bylawsInfoRaw = blocchiImpresa['info-statuto'];
    const governanceAndControlRaw = blocchiImpresa['amministrazione-controllo'];
    const financialAssetInfoRaw =
      blocchiImpresa['info-patrimoniali-finanziarie'];
    const shareholdersAgreementsRaw = blocchiImpresa['patti-parasociali'];
    const businessNetworksRaw = blocchiImpresa['reti-imprese'];
    const insolvencyProceduresRaw = blocchiImpresa['procedure-concorsuali'];
    const legalFormChangesRaw = blocchiImpresa['variazioni-forma-giuridica'];
    const historicSupplementaryInfoRaw =
      blocchiImpresa['info-supplementari-storiche'];
    const mergersSplitsTransfersRaw =
      blocchiImpresa['ta-fusioni-scissioni-subentri'];

    const mapPracticeDetails = (practice?: {
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
    }) =>
      practice
        ? {
            practiceCode: practice['c-pratica'] ?? null,
            complianceTypeCode: practice['c-tipo-adempimento'] ?? null,
            complianceType: practice['tipo-adempimento'] ?? null,
            deedDate: practice['dt-atto'] ?? null,
            chamberCode: practice.cciaa ?? null,
            year: practice.anno ?? null,
            number: this.toNumber(practice.n),
            protocolDate: practice['dt-protocollo'] ?? null,
            filingDate: practice['dt-deposito'] ?? null,
            reconfirmationFlag:
              this.toYesNoFlag(practice['f-riconferma']) ?? null,
            declarationDate: practice['dt-dichiarazione'] ?? null,
            listTypeCode: practice['c-tipo-elenco'] ?? null,
            listType: practice['tipo-elenco'] ?? null,
            requestTypeCode: practice['c-tipo-richiesta'] ?? null,
            requestType: practice['tipo-richiesta'] ?? null,
          }
        : null;

    const mapConfirmedPracticeDetails = (practice?: {
      cciaa?: string;
      anno?: string;
      n?: string;
    }) =>
      practice
        ? {
            chamberCode: practice.cciaa ?? null,
            year: practice.anno ?? null,
            number: this.toNumber(practice.n),
          }
        : null;

    const mapDeedDetails = (deed?: {
      'c-tipo'?: string;
      tipo?: string;
      notaio?: string;
      tribunale?: string;
      'altre-indicazioni'?: string;
      'n-registrazione'?: string;
      'dt-registrazione'?: string;
      'localita-ufficio-registro'?: string;
      'provincia-ufficio-registro'?: string;
    }) =>
      deed
        ? {
            typeCode: deed['c-tipo'] ?? null,
            type: deed.tipo ?? null,
            notary: deed.notaio ?? null,
            court: deed.tribunale ?? null,
            otherIndications: deed['altre-indicazioni'] ?? null,
            registrationNumber: this.toNumber(deed['n-registrazione']),
            registrationDate: deed['dt-registrazione'] ?? null,
            registryOfficeLocality: deed['localita-ufficio-registro'] ?? null,
            registryOfficeProvince: deed['provincia-ufficio-registro'] ?? null,
          }
        : null;

    const mapDeclarations = (declarations?: {
      dichiarazione?:
        | {
            '#text'?: string;
            _text?: string;
            'c-tipo'?: string;
            tipo?: string;
            'dt-iscrizione'?: string;
          }
        | Array<{
            '#text'?: string;
            _text?: string;
            'c-tipo'?: string;
            tipo?: string;
            'dt-iscrizione'?: string;
          }>;
    }) =>
      declarations
        ? {
            declarations: this.toArray(declarations?.dichiarazione).map(
              (declaration) => ({
                text: this.getXmlText(declaration) ?? null,
                typeCode: declaration['c-tipo'] ?? null,
                type: declaration.tipo ?? null,
                enrollmentDate: declaration['dt-iscrizione'] ?? null,
              }),
            ),
          }
        : null;

    const mapShareComposition = (composition?: {
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
    }) =>
      composition
        ? {
            typeCode: composition['c-tipo'] ?? null,
            type: composition.tipo ?? null,
            number: this.toNumber(composition.n),
            currencyCode: composition['c-valuta'] ?? null,
            currency: composition.valuta ?? null,
            nominalValue: composition['valore-nominale'] ?? null,
            numShares: this.toNumber(composition['n-azioni']),
            numQuotas: this.toNumber(composition['n-quote']),
            unitValue: composition['valore-unitario'] ?? null,
            amountInEuros: composition['ammontare-convertito-in-euro'] ?? null,
            paidValue: composition['valore-versato'] ?? null,
          }
        : null;

    const mapFullAddress = (address?: {
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
    }) =>
      address
        ? {
            municipalityCode: address['c-comune'] ?? null,
            city: address.comune ?? null,
            province: address.provincia ?? null,
            provinceTer: address['provincia-ter'] ?? null,
            topographyCode: address['c-toponimo'] ?? null,
            topography: address.toponimo ?? null,
            street: address.via ?? null,
            streetNumber: this.toNumber(address['n-civico']),
            postalCode: address.cap ?? null,
            postalCodeTer: address['cap-ter'] ?? null,
            countryCode: address['c-stato'] ?? null,
            country: address.stato ?? null,
            hamlet: address.frazione ?? null,
            otherIndications: address['altre-indicazioni'] ?? null,
          }
        : null;

    const mapHolders = (holders?: { titolare?: unknown; note?: unknown }) =>
      holders
        ? {
            holders: this.toArray(holders.titolare).map((holder: any) => ({
              personalInfo: holder['anagrafica-titolare']
                ? {
                    typeCode: holder['anagrafica-titolare']?.['c-tipo'] ?? null,
                    type: holder['anagrafica-titolare']?.tipo ?? null,
                    taxCode:
                      holder['anagrafica-titolare']?.['c-fiscale'] ?? null,
                    citizenshipCode:
                      holder['anagrafica-titolare']?.['c-cittadinanza'] ?? null,
                    citizenship:
                      holder['anagrafica-titolare']?.cittadinanza ?? null,
                    name: holder['anagrafica-titolare']?.denominazione ?? null,
                    declaredName:
                      holder['anagrafica-titolare']?.[
                        'denominazione-denunciata'
                      ] ?? null,
                    lastName: holder['anagrafica-titolare']?.cognome ?? null,
                    firstName: holder['anagrafica-titolare']?.nome ?? null,
                    isClosed:
                      holder['anagrafica-titolare']?.['f-cessata'] ?? null,
                    cancellationDate:
                      holder['anagrafica-titolare']?.['dt-cancellazione'] ??
                      null,
                  }
                : null,
              domicile: holder.domicilio
                ? {
                    city: holder.domicilio?.comune ?? null,
                    province: holder.domicilio?.provincia ?? null,
                    provinceTer: holder.domicilio?.['provincia-ter'] ?? null,
                    street: holder.domicilio?.via ?? null,
                    streetNumber: this.toNumber(holder.domicilio?.['n-civico']),
                    postalCode: holder.domicilio?.cap ?? null,
                    postalCodeTer: holder.domicilio?.['cap-ter'] ?? null,
                    countryCode: holder.domicilio?.['c-stato'] ?? null,
                    country: holder.domicilio?.stato ?? null,
                    hamlet: holder.domicilio?.frazione ?? null,
                    careOf: holder.domicilio?.presso ?? null,
                  }
                : null,
              riDomicile: holder['domicilio-ri']
                ? {
                    city: holder['domicilio-ri']?.comune ?? null,
                    province: holder['domicilio-ri']?.provincia ?? null,
                    provinceTer:
                      holder['domicilio-ri']?.['provincia-ter'] ?? null,
                    street: holder['domicilio-ri']?.via ?? null,
                    streetNumber: this.toNumber(
                      holder['domicilio-ri']?.['n-civico'],
                    ),
                    postalCode: holder['domicilio-ri']?.cap ?? null,
                    postalCodeTer: holder['domicilio-ri']?.['cap-ter'] ?? null,
                    countryCode: holder['domicilio-ri']?.['c-stato'] ?? null,
                    country: holder['domicilio-ri']?.stato ?? null,
                    hamlet: holder['domicilio-ri']?.frazione ?? null,
                    careOf: holder['domicilio-ri']?.presso ?? null,
                  }
                : null,
              certifiedEmail: holder['indirizzo-posta-certificata'] ?? null,
              participationRight: holder['diritto-partecipazione']
                ? {
                    participationRoles: this.toArray(
                      holder['diritto-partecipazione']?.[
                        'ruolo-partecipazione'
                      ],
                    ).map((role) => ({
                      description: this.getXmlText(role) ?? null,
                      code: role.c ?? null,
                    })),
                    typeCode:
                      holder['diritto-partecipazione']?.['c-tipo'] ?? null,
                    type: holder['diritto-partecipazione']?.tipo ?? null,
                    fractionNumerator:
                      holder['diritto-partecipazione']?.[
                        'frazione-numeratore'
                      ] ?? null,
                    fractionDenominator:
                      holder['diritto-partecipazione']?.[
                        'frazione-denominatore'
                      ] ?? null,
                    percentage:
                      holder['diritto-partecipazione']?.percentuale ?? null,
                    currencyCode:
                      holder['diritto-partecipazione']?.['c-valuta'] ?? null,
                    currency: holder['diritto-partecipazione']?.valuta ?? null,
                    value: holder['diritto-partecipazione']?.valore ?? null,
                  }
                : null,
              notes: this.toArray(holder.note).map((item) => String(item)),
              statusCode: holder['c-situazione'] ?? null,
              status: holder.situazione ?? null,
              typeCode: holder['c-tipo'] ?? null,
              type: holder.tipo ?? null,
              representativeFlag:
                this.toYesNoFlag(holder['f-rappresentante']) ?? null,
            })),
            notes: this.toArray(holders.note).map((item) => String(item)),
          }
        : null;

    const mapCompanyWorkforce = (entry: {
      'c-tipo-informazione'?: string;
      'tipo-informazione'?: string;
      anno?: string;
      'dt-dichiarazione'?: string;
      'dt-rilevazione'?: string;
      'n-dipendenti'?: string;
      'n-indipendenti'?: string;
      'n-totale'?: string;
      'c-rilevazione-dipendenti'?: string;
      'info-mesi'?: {
        'info-mese'?:
          | {
              'c-mese'?: string;
              mese?: string;
              'n-dipendenti'?: string;
              'n-indipendenti'?: string;
              'n-totale'?: string;
              'n-collaboratori'?: string;
              'percentuale-dipendenti'?: string;
              'n-dip-no-agricoli'?: string;
            }
          | Array<{
              'c-mese'?: string;
              mese?: string;
              'n-dipendenti'?: string;
              'n-indipendenti'?: string;
              'n-totale'?: string;
              'n-collaboratori'?: string;
              'percentuale-dipendenti'?: string;
              'n-dip-no-agricoli'?: string;
            }>;
      };
      'valori-medi'?: {
        'valore-medio-dipendenti'?: string;
        'valore-medio-indipendenti'?: string;
        'valore-medio-totale'?: string;
        'valore-medio-collaboratori'?: string;
      };
      collaboratori?: unknown;
      'distribuzione-dipendenti'?: any;
    }) => ({
      monthlyDetails: this.toArray(entry['info-mesi']?.['info-mese']).map(
        (month) => ({
          monthCode: month['c-mese'] ?? null,
          month: month.mese ?? null,
          numEmployees: this.toNumber(month['n-dipendenti']),
          numSelfEmployed: this.toNumber(month['n-indipendenti']),
          total: this.toNumber(month['n-totale']),
          numCollaborators: this.toNumber(month['n-collaboratori']),
          employeePercentage: month['percentuale-dipendenti'] ?? null,
          numNonAgriculturalEmployees: this.toNumber(
            month['n-dip-no-agricoli'],
          ),
        }),
      ),
      averageValues: entry['valori-medi']
        ? {
            averageEmployees:
              entry['valori-medi']['valore-medio-dipendenti'] ?? null,
            averageSelfEmployed:
              entry['valori-medi']['valore-medio-indipendenti'] ?? null,
            averageTotal: entry['valori-medi']['valore-medio-totale'] ?? null,
            averageCollaborators:
              entry['valori-medi']['valore-medio-collaboratori'] ?? null,
          }
        : null,
      collaborators: entry.collaboratori
        ? { monthlyDetails: [], averageValues: null }
        : null,
      employeeDistribution: entry['distribuzione-dipendenti']
        ? {
            contractDistribution: entry['distribuzione-dipendenti']?.[
              'dipendenti-contratti'
            ]
              ? {
                  entries: this.toArray(
                    entry['distribuzione-dipendenti']?.[
                      'dipendenti-contratti'
                    ]?.['dipendenti-contratto'],
                  ).map((contractEntry) => ({
                    monthlyDetails: this.toArray(
                      contractEntry['info-mesi']?.['info-mese'],
                    ).map((month) => ({
                      monthCode: month['c-mese'] ?? null,
                      month: month.mese ?? null,
                      numEmployees: this.toNumber(month['n-dipendenti']),
                      numSelfEmployed: this.toNumber(month['n-indipendenti']),
                      total: this.toNumber(month['n-totale']),
                      numCollaborators: this.toNumber(month['n-collaboratori']),
                      employeePercentage:
                        month['percentuale-dipendenti'] ?? null,
                      numNonAgriculturalEmployees: this.toNumber(
                        month['n-dip-no-agricoli'],
                      ),
                    })),
                    contract: contractEntry.contratto ?? null,
                  })),
                }
              : null,
            workingHoursDistribution: entry['distribuzione-dipendenti']?.[
              'dipendenti-orari-lavoro'
            ]
              ? {
                  entries: this.toArray(
                    entry['distribuzione-dipendenti']?.[
                      'dipendenti-orari-lavoro'
                    ]?.['dipendenti-orario-lavoro'],
                  ).map((workingHoursEntry) => ({
                    monthlyDetails: this.toArray(
                      workingHoursEntry['info-mesi']?.['info-mese'],
                    ).map((month) => ({
                      monthCode: month['c-mese'] ?? null,
                      month: month.mese ?? null,
                      numEmployees: this.toNumber(month['n-dipendenti']),
                      numSelfEmployed: this.toNumber(month['n-indipendenti']),
                      total: this.toNumber(month['n-totale']),
                      numCollaborators: this.toNumber(month['n-collaboratori']),
                      employeePercentage:
                        month['percentuale-dipendenti'] ?? null,
                      numNonAgriculturalEmployees: this.toNumber(
                        month['n-dip-no-agricoli'],
                      ),
                    })),
                    workingHours: workingHoursEntry['orario-lavoro'] ?? null,
                  })),
                }
              : null,
            qualificationDistribution: entry['distribuzione-dipendenti']?.[
              'dipendenti-qualifiche'
            ]
              ? {
                  entries: this.toArray(
                    entry['distribuzione-dipendenti']?.[
                      'dipendenti-qualifiche'
                    ]?.['dipendenti-qualifica'],
                  ).map((qualificationEntry) => ({
                    monthlyDetails: this.toArray(
                      qualificationEntry['info-mesi']?.['info-mese'],
                    ).map((month) => ({
                      monthCode: month['c-mese'] ?? null,
                      month: month.mese ?? null,
                      numEmployees: this.toNumber(month['n-dipendenti']),
                      numSelfEmployed: this.toNumber(month['n-indipendenti']),
                      total: this.toNumber(month['n-totale']),
                      numCollaborators: this.toNumber(month['n-collaboratori']),
                      employeePercentage:
                        month['percentuale-dipendenti'] ?? null,
                      numNonAgriculturalEmployees: this.toNumber(
                        month['n-dip-no-agricoli'],
                      ),
                    })),
                    qualification: qualificationEntry.qualifica ?? null,
                  })),
                }
              : null,
            agriculturalWorkersFlag:
              this.toYesNoFlag(
                entry['distribuzione-dipendenti']?.['f-presenza-agricoli'],
              ) ?? null,
          }
        : null,
      informationTypeCode: entry['c-tipo-informazione'] ?? null,
      informationType: entry['tipo-informazione'] ?? null,
      year: entry.anno ?? null,
      declarationDate: entry['dt-dichiarazione'] ?? null,
      surveyDate: entry['dt-rilevazione'] ?? null,
      numEmployees: this.toNumber(entry['n-dipendenti']),
      numSelfEmployed: this.toNumber(entry['n-indipendenti']),
      total: this.toNumber(entry['n-totale']),
      employeeSurveyCode: entry['c-rilevazione-dipendenti'] ?? null,
    });

    return {
      recognition: {
        positionId: String(data.Riconoscimento?.IdentificativoPosizione ?? ''),
        returnedOutput: data.Riconoscimento?.OutputRestituiti ?? null,
      },
      identification: {
        activityStatus: {
          text: datiIdentificativi?.['stato-attivita']?.['#text'] ?? null,
          code: datiIdentificativi?.['stato-attivita']?.c ?? null,
        },
        legalForm: {
          text: datiIdentificativi?.['forma-giuridica']?.['#text'] ?? null,
          code: datiIdentificativi?.['forma-giuridica']?.c ?? null,
        },
        locationAddress: {
          street: datiIdentificativi?.['indirizzo-localizzazione']?.via ?? null,
          streetNumber: this.toNumber(
            datiIdentificativi?.['indirizzo-localizzazione']?.['n-civico'],
          ),
          city:
            datiIdentificativi?.['indirizzo-localizzazione']?.comune ?? null,
          province:
            datiIdentificativi?.['indirizzo-localizzazione']?.provincia ?? null,
          postalCode:
            datiIdentificativi?.['indirizzo-localizzazione']?.cap ?? null,
          topographyCode:
            datiIdentificativi?.['indirizzo-localizzazione']?.['c-toponimo'] ??
            null,
          topographyName:
            datiIdentificativi?.['indirizzo-localizzazione']?.toponimo ?? null,
        },
        certifiedEmail:
          datiIdentificativi?.['indirizzo-posta-certificata'] ?? null,
        representatives: {
          representative,
        },
        isInterchamberOffice:
          this.toYesNoFlag(datiIdentificativi?.['f-sede-intercamerale']) ??
          null,
        sourceCode: datiIdentificativi?.['c-fonte'] ?? null,
        sourceName: datiIdentificativi?.fonte ?? null,
        subjectType: datiIdentificativi?.['tipo-soggetto'] ?? null,
        subjectTypeDescription:
          datiIdentificativi?.['descrizione-tipo-soggetto'] ?? null,
        companyType: datiIdentificativi?.['tipo-impresa'] ?? null,
        companyTypeDescription:
          datiIdentificativi?.['descrizione-tipo-impresa'] ?? null,
        registrationDate: datiIdentificativi?.['dt-iscrizione-ri'] ?? null,
        constitutionDate: datiIdentificativi?.['dt-atto-costituzione'] ?? null,
        lastProtocolDate: datiIdentificativi?.['dt-ultimo-protocollo'] ?? null,
        lastProtocolProcessedDate:
          datiIdentificativi?.['dt-mod-ultimo-protocollo-evaso'] ?? null,
        companyName: datiIdentificativi?.denominazione ?? null,
        taxCode: datiIdentificativi?.['c-fiscale'] ?? null,
        vatNumber: datiIdentificativi?.['partita-iva'] ?? null,
        cciaaCode: datiIdentificativi?.['c-cciaa-competente'] ?? null,
        cciaaName: datiIdentificativi?.['cciaa-competente'] ?? null,
        cciaaAbbreviation: datiIdentificativi?.cciaa ?? null,
        reaNumber: this.toNumber(datiIdentificativi?.['n-rea']),
      },
      activitySummary: {
        mainActivityDescription:
          sintesiAttivita?.['attivita-prevalente-r'] ?? null,
        atecoClassification: {
          activityCode: classificazioneAteco?.['c-attivita'] ?? null,
          activityDescription: classificazioneAteco?.attivita ?? null,
          referenceDate: classificazioneAteco?.['dt-riferimento'] ?? null,
          relevanceCode: classificazioneAteco?.['c-importanza'] ?? null,
          relevanceDescription: classificazioneAteco?.importanza ?? null,
          sourceCode: classificazioneAteco?.['c-fonte'] ?? null,
          sourceDescription: classificazioneAteco?.fonte ?? null,
          naceCode: classificazioneAteco?.['c-nace'] ?? '',
          startDate: classificazioneAteco?.['dt-inizio'] ?? null,
        },
        startDate: sintesiAttivita?.['dt-inizio'] ?? null,
        aaActivityDescription: sintesiAttivita?.['attivita-aa-r'] ?? null,
        agriculturalActivityDescription:
          sintesiAttivita?.['attivita-agricola-r'] ?? null,
        environmentalRegistersFlag:
          this.toYesNoFlag(sintesiAttivita?.['f-albi-registri-ambientali']) ??
          null,
        importExportFlag:
          this.toYesNoFlag(sintesiAttivita?.['f-import-export']) ?? null,
        networkContractFlag:
          this.toYesNoFlag(sintesiAttivita?.['f-contratto-rete']) ?? null,
        pursuedActivityDescription:
          sintesiAttivita?.['attivita-esercitata-r'] ?? null,
        qualityCertificationsFlag:
          this.toYesNoFlag(sintesiAttivita?.['f-certificazioni-qualita']) ??
          null,
        ratingScore: sintesiAttivita?.['punteggio-rating-legalita'] ?? null,
        registersAndEnvironmentalRolesFlag:
          this.toYesNoFlag(sintesiAttivita?.['f-albi-ruoli-licenze']) ?? null,
        soaCertificationsFlag:
          this.toYesNoFlag(sintesiAttivita?.['f-certificazioni-qualita']) ??
          null,
      },
      financialSummary: financialSummaryRaw
        ? {
            numLocalizations:
              financialSummaryRaw['n-localizzazioni'] != undefined
                ? Number(financialSummaryRaw['n-localizzazioni'])
                : null,
            numAdministrators:
              financialSummaryRaw['n-amministratori'] != undefined
                ? Number(financialSummaryRaw['n-amministratori'])
                : null,
            numMayors:
              financialSummaryRaw['n-sindaci'] != undefined
                ? Number(financialSummaryRaw['n-sindaci'])
                : null,
            numOfficeHolders:
              financialSummaryRaw['n-titolari-cariche'] != undefined
                ? Number(financialSummaryRaw['n-titolari-cariche'])
                : null,
            numShareholders:
              financialSummaryRaw['n-soci'] != undefined
                ? Number(financialSummaryRaw['n-soci'])
                : null,
            employeesDate: financialSummaryRaw['dt-addetti'] ?? null,
            numEmployees:
              financialSummaryRaw['n-addetti'] != undefined
                ? Number(financialSummaryRaw['n-addetti'])
                : null,
            numHeadquartersTransfers:
              financialSummaryRaw['n-trasferimenti-sede'] != undefined
                ? Number(financialSummaryRaw['n-trasferimenti-sede'])
                : null,
            numShareTransfers:
              financialSummaryRaw['n-trasferimenti-quote'] != undefined
                ? Number(financialSummaryRaw['n-trasferimenti-quote'])
                : null,
            yearlyFilings: financialSummaryRaw['pratiche-anno']
              ? {
                  startDate:
                    financialSummaryRaw['pratiche-anno']?.['dt-inizio'] ?? null,
                  count:
                    financialSummaryRaw['pratiche-anno']?.n != undefined
                      ? Number(financialSummaryRaw['pratiche-anno'].n)
                      : null,
                }
              : null,
            shareCapital: this.mapShareCapitalInfo(
              financialSummaryRaw['capitale-sociale'],
            ),
            balanceSheetData: financialSummaryRaw['dati-bilancio']
              ? {
                  year: financialSummaryRaw['dati-bilancio']?.anno ?? null,
                  profitLoss: this.toNumber(
                    financialSummaryRaw['dati-bilancio']?.['utile-perdite'],
                  ),
                  revenue: this.toNumber(
                    financialSummaryRaw['dati-bilancio']?.ricavi,
                  ),
                  productionValue: this.toNumber(
                    financialSummaryRaw['dati-bilancio']?.['valore-produzione'],
                  ),
                }
              : null,
            consortiumFund: financialSummaryRaw['fondo-consortile']
              ? {
                  descriptions: financialSummaryRaw['fondo-consortile']?.[
                    'descrizioni'
                  ]
                    ? {
                        description:
                          this.toArray(
                            financialSummaryRaw['fondo-consortile']?.[
                              'descrizioni'
                            ]?.descrizione,
                          )[0] != undefined
                            ? String(
                                this.toArray(
                                  financialSummaryRaw['fondo-consortile']?.[
                                    'descrizioni'
                                  ]?.descrizione,
                                )[0],
                              )
                            : null,
                      }
                    : null,
                  currencyCode:
                    financialSummaryRaw['fondo-consortile']?.['c-valuta'] ??
                    null,
                  currencyName:
                    financialSummaryRaw['fondo-consortile']?.valuta ?? null,
                  amount: this.toNumber(
                    financialSummaryRaw['fondo-consortile']?.ammontare,
                  ),
                  amountInEuro: this.toNumber(
                    financialSummaryRaw['fondo-consortile']?.[
                      'ammontare-convertito-in-euro'
                    ],
                  ),
                }
              : null,
            flagControlledCompany:
              this.toYesNoFlag(financialSummaryRaw['f-controllata']) ?? null,
            flagCorporateHoldings:
              this.toYesNoFlag(financialSummaryRaw['f-partecipazioni']) ?? null,
            flagHistoricCorporateHoldings:
              this.toYesNoFlag(financialSummaryRaw['f-partecipazioni-sto']) ??
              null,
            investedCapital: this.mapAmountInfo(
              financialSummaryRaw['capitale-investito'],
            ),
            nominalValueInjections: this.mapAmountInfo(
              financialSummaryRaw['valore-nominale-conferimenti'],
            ),
            numOpenProtocols:
              financialSummaryRaw['n-protocolli-aperti'] != undefined
                ? Number(financialSummaryRaw['n-protocolli-aperti'])
                : null,
          }
        : null,
      headquartersInfo: headquartersInfoRaw
        ? {
            phoneNumber: headquartersInfoRaw.telefono?.n ?? null,
            faxNumber: headquartersInfoRaw.telex ?? null,
            telefaxNumber: headquartersInfoRaw.telefax?.n ?? null,
            certifiedEmail:
              headquartersInfoRaw['indirizzo-posta-certificata'] ?? null,
            website: headquartersInfoRaw['sito-internet'] ?? null,
            email: headquartersInfoRaw.email ?? null,
            legalMail: headquartersInfoRaw['legal-mail'] ?? null,
            otherHeadquarterFunctions:
              headquartersInfoRaw['altre-funzioni-sede'] ?? null,
            reaRegistration: headquartersInfoRaw['dati-iscrizione-rea-rd']
              ? {
                  reaNumber:
                    headquartersInfoRaw['dati-iscrizione-rea-rd']?.['n-rea'] ??
                    null,
                }
              : null,
            vatNumber: headquartersInfoRaw['partita-iva']?.['#text'] ?? null,
            legalEntityIdentifierCode: headquartersInfoRaw['codice-lei']
              ? {
                  code: headquartersInfoRaw['codice-lei']?.c ?? null,
                  sourceCode:
                    headquartersInfoRaw['codice-lei']?.['c-fonte'] ?? null,
                  source: headquartersInfoRaw['codice-lei']?.fonte ?? null,
                  expirationDate:
                    headquartersInfoRaw['codice-lei']?.['dt-scadenza'] ?? null,
                }
              : null,
            companySign: headquartersInfoRaw.insegna ?? null,
            euid: headquartersInfoRaw.euid
              ? {
                  euidCode: headquartersInfoRaw.euid?.['c-euid'] ?? null,
                  countryCode: headquartersInfoRaw.euid?.['c-stato'] ?? null,
                  country: headquartersInfoRaw.euid?.stato ?? null,
                  registerCode:
                    headquartersInfoRaw.euid?.['c-registro'] ?? null,
                  register: headquartersInfoRaw.euid?.registro ?? null,
                  registrationNumber: this.toNumber(
                    headquartersInfoRaw.euid?.['n-registrazione'],
                  ),
                  legalFormCode:
                    headquartersInfoRaw.euid?.['c-forma-giuridica'] ?? null,
                  legalForm:
                    headquartersInfoRaw.euid?.['forma-giuridica'] ?? null,
                }
              : null,
            transferOrigin: headquartersInfoRaw['provenienza-trasferimento']
              ? {
                  chamberCode:
                    headquartersInfoRaw['provenienza-trasferimento']?.cciaa ??
                    null,
                  reaNumber:
                    headquartersInfoRaw['provenienza-trasferimento']?.[
                      'n-rea'
                    ] ?? null,
                }
              : null,
            supplementaryInformation: {
              genericInfo:
                headquartersInfoRaw['informazioni-supplementari']?.[
                  'info-generiche'
                ] ?? null,
              jointPowers:
                headquartersInfoRaw['informazioni-supplementari']?.[
                  'poteri-congiunti'
                ] ?? null,
              locationInfo:
                headquartersInfoRaw['informazioni-supplementari']?.[
                  'info-localizzazione'
                ] ?? null,
              registryInfo:
                headquartersInfoRaw['informazioni-supplementari']?.[
                  'info-visura'
                ] ?? null,
            },
          }
        : null,
      cancellationOrTransfer: {
        activeLocalUnitTransfer: {
          reason:
            cancellationOrTransferRaw?.['trasferimento-sede-ul-attiva']
              ?.causale ?? null,
          date:
            cancellationOrTransferRaw?.['trasferimento-sede-ul-attiva']?.dt ??
            null,
          reasonCode:
            cancellationOrTransferRaw?.['trasferimento-sede-ul-attiva']?.[
              'c-causale'
            ] ?? null,
        },
        cancellation: {
          reason: cancellationOrTransferRaw?.cancellazione?.causale ?? null,
          reasonCode:
            cancellationOrTransferRaw?.cancellazione?.['c-causale'] ?? null,
          activityCessationDate:
            cancellationOrTransferRaw?.cancellazione?.[
              'dt-cessazione-attivita'
            ] ?? null,
          applicationDate:
            cancellationOrTransferRaw?.cancellazione?.['dt-domanda'] ?? null,
          cancellationDate:
            cancellationOrTransferRaw?.cancellazione?.['dt-cancellazione'] ??
            null,
          cessationDate:
            cancellationOrTransferRaw?.cancellazione?.['dt-cessazione'] ?? null,
          cessationInfo:
            cancellationOrTransferRaw?.cancellazione?.['info-cessazione'] ??
            null,
          deedDetails: {
            court:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']
                ?.tribunale ?? null,
            notary:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']
                ?.notaio ?? null,
            otherIndications:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']?.[
                'altre-indicazioni'
              ] ?? null,
            registrationDate:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']?.[
                'dt-registrazione'
              ] ?? null,
            registrationNumber: this.toNumber(
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']?.[
                'n-registrazione'
              ],
            ),
            registryOfficeLocality:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']?.[
                'localita-ufficio-registro'
              ] ?? null,
            registryOfficeProvince:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']?.[
                'provincia-ufficio-registro'
              ] ?? null,
            type:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']
                ?.tipo ?? null,
            typeCode:
              cancellationOrTransferRaw?.cancellazione?.['estremi-atto']?.[
                'c-tipo'
              ] ?? null,
          },
          notificationDate:
            cancellationOrTransferRaw?.cancellazione?.['dt-denuncia'] ?? null,
        },
        foreignOfficeAddress: {
          address:
            cancellationOrTransferRaw?.['indirizzo-sede-estero']?.indirizzo ??
            null,
          country:
            cancellationOrTransferRaw?.['indirizzo-sede-estero']?.stato ?? null,
          countryCode:
            cancellationOrTransferRaw?.['indirizzo-sede-estero']?.['c-stato'] ??
            null,
          transferInfo:
            cancellationOrTransferRaw?.['indirizzo-sede-estero']?.[
              'info-trasferimento'
            ] ?? null,
        },
        headquartersTransfer: {
          aaNumber: this.toNumber(
            cancellationOrTransferRaw?.['trasferimento-sede']?.['n-aa'],
          ),
          city:
            cancellationOrTransferRaw?.['trasferimento-sede']?.comune ?? null,
          province:
            cancellationOrTransferRaw?.['trasferimento-sede']?.provincia ??
            null,
          rdNumber: this.toNumber(
            cancellationOrTransferRaw?.['trasferimento-sede']?.['n-rd'],
          ),
          reaNumber: this.toNumber(
            cancellationOrTransferRaw?.['trasferimento-sede']?.['n-rea'],
          ),
          street:
            cancellationOrTransferRaw?.['trasferimento-sede']?.via ?? null,
          streetNumber: this.toNumber(
            cancellationOrTransferRaw?.['trasferimento-sede']?.['n-civico'],
          ),
          topography:
            cancellationOrTransferRaw?.['trasferimento-sede']?.toponimo ?? null,
          topographyCode:
            cancellationOrTransferRaw?.['trasferimento-sede']?.['c-toponimo'] ??
            null,
        },
        otherRegisterInfo: {
          cancellation: {
            activityCessationDate:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['dt-cessazione-attivita'] ?? null,
            cancellationDate:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['dt-cancellazione'] ?? null,
            cessationDate:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['dt-cessazione'] ?? null,
            cessationInfo:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['info-cessazione'] ?? null,
            applicationDate:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['dt-domanda'] ?? null,
            reason:
              cancellationOrTransferRaw?.['info-altro-registro']?.cancellazione
                ?.causale ?? null,
            reasonCode:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['c-causale'] ?? null,
            notificationDate:
              cancellationOrTransferRaw?.['info-altro-registro']
                ?.cancellazione?.['dt-denuncia'] ?? null,
            deedDetails: {
              court:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.tribunale ?? null,
              notary:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.notaio ?? null,
              otherIndications:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.['altre-indicazioni'] ??
                null,
              registrationDate:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.['dt-registrazione'] ??
                null,
              registrationNumber: this.toNumber(
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.['n-registrazione'],
              ),
              registryOfficeLocality:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.[
                  'localita-ufficio-registro'
                ] ?? null,
              registryOfficeProvince:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.[
                  'provincia-ufficio-registro'
                ] ?? null,
              type:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.tipo ?? null,
              typeCode:
                cancellationOrTransferRaw?.['info-altro-registro']
                  ?.cancellazione?.['estremi-atto']?.['c-tipo'] ?? null,
            },
          },
          chamberCode:
            cancellationOrTransferRaw?.['info-altro-registro']?.cciaa ?? null,
          otherRegisterTransfer: {
            type:
              cancellationOrTransferRaw?.['info-altro-registro']?.[
                'trasferimento-altro-registro'
              ]?.tipo ?? null,
            typeCode:
              cancellationOrTransferRaw?.['info-altro-registro']?.[
                'trasferimento-altro-registro'
              ]?.['c-tipo'] ?? null,
          },
        },
      },
      incorporationActDetails: incorporationActRaw
        ? {
            typeCode: incorporationActRaw['c-tipo'] ?? null,
            type: incorporationActRaw.tipo ?? null,
            repertoryNumber: incorporationActRaw['n-repertorio'] ?? null,
            notary: incorporationActRaw.notaio ?? null,
            notaryLocality: incorporationActRaw['localita-notaio'] ?? null,
            notaryProvince: incorporationActRaw['provincia-notaio'] ?? null,
          }
        : null,
      activityInfo: activityInfoRaw
        ? {
            familyWorkInfo: {
              numPermanentWorkers: this.toNumber(
                activityInfoRaw['lavoro-prestato-familiari-part']?.[
                  'n-lavoratori-tempo-indeter'
                ],
              ),
              numWorkdays: this.toNumber(
                activityInfoRaw['lavoro-prestato-familiari-part']?.[
                  'n-giornate'
                ],
              ),
            },
            participatingFamilyMembers: {
              entries: this.toArray(
                activityInfoRaw['familiari-partecipi']?.['familiare-partecipe'],
              ).map((item) => ({
                directFarmerFlag:
                  this.toYesNoFlag(item['f-coltivatore-diretto']) ?? null,
                firstName: item.nome ?? null,
                lastName: item.cognome ?? null,
                taxCode: item['c-fiscale'] ?? null,
              })),
            },
            pursuedActivity: activityInfoRaw['attivita-esercitata'] ?? null,
            secondaryActivity:
              activityInfoRaw['attivita-secondaria-esercitata'] ?? null,
            craftsActivityBolzano: {
              cancellation: {
                assessmentApplicationDate:
                  activityInfoRaw['attivita-aa-bz']?.['cancellazione-aa-bz']?.[
                    'dt-domanda-accertamento'
                  ] ?? null,
                effectDate:
                  activityInfoRaw['attivita-aa-bz']?.['cancellazione-aa-bz']?.[
                    'dt-effetto'
                  ] ?? null,
                reason:
                  activityInfoRaw['attivita-aa-bz']?.['cancellazione-aa-bz']
                    ?.causale ?? null,
                reasonCode:
                  activityInfoRaw['attivita-aa-bz']?.['cancellazione-aa-bz']?.[
                    'c-causale'
                  ] ?? null,
              },
              descriptions:
                activityInfoRaw['attivita-aa-bz']?.descrizione ?? null,
              isSecondaryActivityFlag:
                this.toYesNoFlag(
                  activityInfoRaw['attivita-aa-bz']?.['f-attivita-secondaria'],
                ) ?? null,
              startDate:
                activityInfoRaw['attivita-aa-bz']?.['dt-inizio'] ?? null,
              trades: {
                trades: this.toArray(
                  activityInfoRaw['attivita-aa-bz']?.['mestieri-aa']?.[
                    'mestiere-aa'
                  ],
                )?.map((trade) => ({
                  activityStartDate: trade['dt-inizio-attivita'] ?? null,
                  code: trade.c ?? null,
                  description: trade.descrizione ?? null,
                  furtherDescription: trade['ulteriore-descrizione'] ?? null,
                  tradeDescription: trade['#text'] ?? null,
                })),
              },
            },
            nonCraftsActivity: {
              cancellation: {
                assessmentApplicationDate:
                  activityInfoRaw['attivita-no-aa']?.['cancellazione-aa']?.[
                    'dt-domanda-accertamento'
                  ] ?? null,
                cessationDate:
                  activityInfoRaw['attivita-no-aa']?.['cancellazione-aa']?.[
                    'dt-cessazione'
                  ] ?? null,
                reason:
                  activityInfoRaw['attivita-no-aa']?.['cancellazione-aa']
                    ?.causale ?? null,
                reasonCode:
                  activityInfoRaw['attivita-no-aa']?.['cancellazione-aa']?.[
                    'c-causale'
                  ] ?? null,
                resolutionDate:
                  activityInfoRaw['attivita-no-aa']?.['cancellazione-aa']?.[
                    'dt-delibera'
                  ] ?? null,
              },
              categoryCode:
                activityInfoRaw['attivita-no-aa']?.['c-categoria'] ?? null,
              category: activityInfoRaw['attivita-no-aa']?.categoria ?? null,
              descriptions:
                activityInfoRaw['attivita-no-aa']?.descrizione ?? null,
              startDate:
                activityInfoRaw['attivita-no-aa']?.['dt-inizio'] ?? null,
              supplementaryInfo:
                activityInfoRaw['attivita-no-aa']?.[
                  'informazioni-supplementari-aa'
                ] ?? null,
            },
            agriculturalActivity: {
              description:
                activityInfoRaw['attivita-agricola']?.['#text'] ?? null,
              startDate:
                activityInfoRaw['attivita-agricola']?.['dt-inizio'] ?? null,
            },
            activityDetails: this.toArray(
              activityInfoRaw['dettagli-attivita'],
            ).map((item) => ({
              type: item.tipo ?? null,
              typeCode: item['c-tipo'] ?? null,
              details: this.toArray(item['dettaglio-attivita']).map(
                (detail) => ({
                  description: detail['#text'] ?? null,
                  detailCode: detail['c-dettaglio'] ?? null,
                }),
              ),
            })),
            atecoClassifications2002: {
              classifications: this.toArray(
                activityInfoRaw['classificazioni-ateco-2002']?.[
                  'classificazione-ateco-2002'
                ],
              ).map((classification) => ({
                activityCode: classification['c-attivita'] ?? null,
                activityDescription: classification.attivita ?? null,
                relevanceCode: classification['c-importanza'] ?? null,
                relevanceDescription: classification.importanza ?? null,
                startDate: classification['dt-inizio'] ?? null,
              })),
            },
            atecoClassifications: this.toArray(
              activityInfoRaw['classificazioni-ateco'],
            ).map((classificationGroup) => ({
              codingCode: classificationGroup['c-codifica'] ?? null,
              coding: classificationGroup.codifica ?? null,
              classifications: this.toArray(
                classificationGroup['classificazione-ateco'],
              ).map((classification) => ({
                activityCode: classification['c-attivita'] ?? null,
                activityDescription: classification.attivita ?? null,
                relevanceCode: classification['c-importanza'] ?? null,
                relevanceDescription: classification.importanza ?? null,
                naceCode: classification['c-nace'] ?? null,
                startDate: classification['dt-inizio'] ?? null,
                referenceDate: classification['dt-riferimento'] ?? null,
                sourceCode: classification['c-fonte'] ?? null,
                sourceDescription: classification.fonte ?? null,
              })),
            })),
            primaryActivity: activityInfoRaw['attivita-prevalente']
              ? {
                  description:
                    activityInfoRaw['attivita-prevalente']?.['#text'] ?? null,
                  notStartedFlag:
                    this.toYesNoFlag(
                      activityInfoRaw['attivita-prevalente']?.[
                        'f-attivita-non-iniziata'
                      ],
                    ) ?? null,
                }
              : null,
            qualificationCertifications: activityInfoRaw[
              'attestazioni-qualificazioni'
            ]
              ? {
                  certifications: this.toArray(
                    activityInfoRaw['attestazioni-qualificazioni']?.[
                      'attestazione-qualificazioni'
                    ],
                  ).map((item) => ({
                    workCategories: item['categorie-opere']
                      ? {
                          categories: this.toArray(
                            item['categorie-opere']?.['categoria-opere'],
                          ).map((category) => ({
                            categoryCode: category['c-categoria'] ?? null,
                            category: category.categoria ?? null,
                            classificationCode:
                              category['c-classificazione'] ?? null,
                            classification: category.classificazione ?? null,
                          })),
                          sourceCode:
                            item['categorie-opere']?.['c-fonte'] ?? null,
                        }
                      : null,
                    soaCertification: item.attestazione
                      ? {
                          qualityCertificate: item.attestazione?.[
                            'certificato-qualita'
                          ]
                            ? {
                                certifierName:
                                  item.attestazione?.['certificato-qualita']?.[
                                    'denominazione-odc'
                                  ] ?? null,
                                expiryDate:
                                  item.attestazione?.['certificato-qualita']?.[
                                    'dt-scadenza'
                                  ] ?? null,
                              }
                            : null,
                          sourceCode: item.attestazione?.['c-fonte'] ?? null,
                          soaIdentifierCode:
                            item.attestazione?.['c-identificativo-SOA'] ?? null,
                          name: item.attestazione?.denominazione ?? null,
                          certificationNumber: this.toNumber(
                            item.attestazione?.['n-attestazione'],
                          ),
                          issueDate: item.attestazione?.['dt-rilascio'] ?? null,
                          expiryDate:
                            item.attestazione?.['dt-scadenza'] ?? null,
                          regulation: item.attestazione?.regolamento ?? null,
                        }
                      : null,
                  })),
                }
              : null,
            organicCertifications: activityInfoRaw['certificazioni-bio']
              ? {
                  certifications: this.toArray(
                    activityInfoRaw['certificazioni-bio']?.[
                      'certificazione-bio'
                    ],
                  ).map((item) => ({
                    source: item.fonte ?? null,
                    lastUpdateDate: item['dt-ultimo-aggiornamento'] ?? null,
                    operatorCode: item['c-operatore'] ?? null,
                    operator: item.operatore ?? null,
                    subjectDate: item['dt-assoggettamento'] ?? null,
                    activity: item.attivita ?? null,
                    certificateNumber: this.toNumber(item['n-certificato']),
                    certifierCode: item['c-odc'] ?? null,
                    certifier: item.odc ?? null,
                    certifiedActivity: item['attivita-certificata'] ?? null,
                    conformityCertificateNumber: this.toNumber(
                      item['n-certificato-conformita'],
                    ),
                    expiryDate: item['dt-scadenza'] ?? null,
                  })),
                }
              : null,
            qualityCertifications: activityInfoRaw.certificazioni
              ? {
                  lastUpdateDate:
                    activityInfoRaw.certificazioni['dt-ultima-modifica'] ??
                    null,
                  certifications: this.toArray(
                    activityInfoRaw.certificazioni.certificazione,
                  ).map((item) => ({
                    sectors: {
                      sectors: this.toArray(item.settori?.settore).map(
                        (sector) => ({
                          code: sector.c ?? null,
                          description: sector['#text'] ?? null,
                        }),
                      ),
                    },
                    schemeCode: item['c-schema-accreditamento'] ?? null,
                    scheme: item['schema-accreditamento'] ?? null,
                    referenceStandard: item['norma-riferimento'] ?? null,
                    certificateNumber: this.toNumber(item['n-certificato']),
                    note: item.nota ?? null,
                    issueDate: item['dt-emissione'] ?? null,
                    certifierName: item['denominazione-odc'] ?? null,
                    certifierTaxCode: item['c-fiscale-odc'] ?? null,
                  })),
                }
              : null,
            conformityBodyAccreditations: activityInfoRaw['accreditamenti-odc']
              ? {
                  accreditations: this.toArray(
                    activityInfoRaw['accreditamenti-odc']?.[
                      'accreditamento-odc'
                    ],
                  ).map((item) => ({
                    schemeCode: item['c-schema-accreditamento'] ?? null,
                    scheme: item['schema-accreditamento'] ?? null,
                    certificateNumber: this.toNumber(item['n-certificato']),
                    issueDate: item['dt-emissione'] ?? null,
                    expiryDate: item['dt-scadenza'] ?? null,
                    downloadFile: item['file-download'] ?? null,
                  })),
                  lastUpdateDate:
                    activityInfoRaw['accreditamenti-odc']?.[
                      'dt-ultima-modifica'
                    ] ?? null,
                  website:
                    activityInfoRaw['accreditamenti-odc']?.['sito-internet'] ??
                    null,
                }
              : null,
            socialEnterprise: activityInfoRaw['impresa-sociale']
              ? {
                  goodsAndServices: activityInfoRaw['impresa-sociale']?.[
                    'beni-servizi'
                  ]
                    ? {
                        items: this.toArray(
                          activityInfoRaw['impresa-sociale']?.[
                            'beni-servizi'
                          ]?.['bene-servizio'],
                        ).map((item) => ({
                          description: item['#text'] ?? null,
                          code: item.c ?? null,
                        })),
                      }
                    : null,
                  activitySectors: activityInfoRaw['impresa-sociale']?.[
                    'settori-attivita'
                  ]
                    ? {
                        sectors: this.toArray(
                          activityInfoRaw['impresa-sociale']?.[
                            'settori-attivita'
                          ]?.['settore-attivita'],
                        ).map((item) => ({
                          description: item['#text'] ?? null,
                          code: item.c ?? null,
                        })),
                      }
                    : null,
                  numDisadvantagedWorkers: this.toNumber(
                    activityInfoRaw['impresa-sociale']?.[
                      'n-lavoratori-svantaggiati'
                    ],
                  ),
                  numDisabledWorkers: this.toNumber(
                    activityInfoRaw['impresa-sociale']?.[
                      'n-lavoratori-disabili'
                    ],
                  ),
                }
              : null,
            runts: activityInfoRaw.runts
              ? {
                  sections: activityInfoRaw.runts?.sezioni
                    ? {
                        sections: this.toArray(
                          activityInfoRaw.runts?.sezioni?.sezione,
                        ).map((item) => ({
                          code: item.c ?? null,
                          description: item.descrizione ?? null,
                          enrollmentDate: item['dt-iscrizione'] ?? null,
                          lastCommunicationDate:
                            item['dt-ultima-comunicazione'] ?? null,
                          directFarmerFlag:
                            this.toYesNoFlag(item['f-coltivatore-diretto']) ??
                            null,
                          aaChamberdCode: item['cciaa-aa'] ?? null,
                          aaNumber: this.toNumber(item['n-aa']),
                          pendingDecisionFlag:
                            this.toYesNoFlag(item['f-attesa-decisione']) ??
                            null,
                          effectDate: item['dt-decorrenza'] ?? null,
                        })),
                      }
                    : null,
                  id: activityInfoRaw.runts?.id ?? null,
                }
              : null,
            legalRating: activityInfoRaw['rating-legalita']
              ? {
                  sourceCode:
                    activityInfoRaw['rating-legalita']?.['c-fonte'] ?? null,
                  lastUpdateDate:
                    activityInfoRaw['rating-legalita']?.[
                      'dt-ultimo-aggiornamento'
                    ] ?? null,
                  score: activityInfoRaw['rating-legalita']?.punteggio ?? null,
                  identifier:
                    activityInfoRaw['rating-legalita']?.identificativo ?? null,
                  renewalDate:
                    activityInfoRaw['rating-legalita']?.['dt-rinnovo'] ?? null,
                }
              : null,
            companyWorkforce: this.toArray(
              activityInfoRaw['addetti-impresa'],
            ).map(mapCompanyWorkforce),
            municipalityWorkforce: this.toArray(
              activityInfoRaw['addetti-comuni'],
            ).map((entry) => ({
              entries: this.toArray(entry['addetti-comune']).map((item) => ({
                localUnits: this.toArray(
                  item['pro-localizzazioni']?.['pro-localizzazione'],
                ).map((value) => String(value)),
                monthlyDetails: this.toArray(
                  item['info-mesi']?.['info-mese'],
                ).map((month) => ({
                  monthCode: month['c-mese'] ?? null,
                  month: month.mese ?? null,
                  numEmployees: this.toNumber(month['n-dipendenti']),
                  numSelfEmployed: this.toNumber(month['n-indipendenti']),
                  total: this.toNumber(month['n-totale']),
                  numCollaborators: this.toNumber(month['n-collaboratori']),
                  employeePercentage: month['percentuale-dipendenti'] ?? null,
                  numNonAgriculturalEmployees: this.toNumber(
                    month['n-dip-no-agricoli'],
                  ),
                })),
                averageValues: item['valori-medi']
                  ? {
                      averageEmployees:
                        item['valori-medi']?.['valore-medio-dipendenti'] ??
                        null,
                      averageSelfEmployed:
                        item['valori-medi']?.['valore-medio-indipendenti'] ??
                        null,
                      averageTotal:
                        item['valori-medi']?.['valore-medio-totale'] ?? null,
                      averageCollaborators:
                        (item['valori-medi'] as any)?.[
                          'valore-medio-collaboratori'
                        ] ?? null,
                    }
                  : null,
                municipalityCode: item['c-comune'] ?? null,
                municipality: item.comune ?? null,
                province: item.provincia ?? null,
                provinceTer: (item as any)['provincia-ter'] ?? null,
              })),
            })),
            activityStartDate:
              activityInfoRaw['dt-inizio-attivita-impresa'] ?? null,
            startDate: activityInfoRaw['dt-inizio'] ?? null,
            statusCode: activityInfoRaw['c-stato'] ?? null,
            status: activityInfoRaw.stato ?? null,
          }
        : null,
      activityHistory: activityHistoryRaw
        ? {
            atecoClassifications2002: activityHistoryRaw[
              'classificazioni-ateco-2002'
            ]
              ? {
                  classifications: this.toArray(
                    activityHistoryRaw['classificazioni-ateco-2002']?.[
                      'classificazione-ateco-2002'
                    ],
                  ).map((classification) => ({
                    activityCode: classification['c-attivita'] ?? null,
                    activityDescription: classification.attivita ?? null,
                    relevanceCode: classification['c-importanza'] ?? null,
                    relevanceDescription: classification.importanza ?? null,
                    startDate: classification['dt-inizio'] ?? null,
                  })),
                }
              : null,
            atecoClassifications: this.toArray(
              activityHistoryRaw['classificazioni-ateco'],
            ).map((classificationGroup) => ({
              codingCode: classificationGroup['c-codifica'] ?? null,
              coding: classificationGroup.codifica ?? null,
              classifications: this.toArray(
                classificationGroup['classificazione-ateco'],
              ).map((classification) => ({
                activityCode: classification['c-attivita'] ?? null,
                activityDescription: classification.attivita ?? null,
                relevanceCode: classification['c-importanza'] ?? null,
                relevanceDescription: classification.importanza ?? null,
                naceCode: classification['c-nace'] ?? null,
                startDate: classification['dt-inizio'] ?? null,
                referenceDate: classification['dt-riferimento'] ?? null,
                sourceCode: classification['c-fonte'] ?? null,
                sourceDescription: classification.fonte ?? null,
              })),
            })),
          }
        : null,
      workforceHistory: workforceHistoryRaw
        ? {
            entries: this.toArray(workforceHistoryRaw['addetti-impresa']).map(
              mapCompanyWorkforce,
            ),
          }
        : null,
      licensesAndRegisters: licensesAndRegistersRaw
        ? {
            craftsData: licensesAndRegistersRaw['dati-artigiani']
              ? {
                  craftsActivity: licensesAndRegistersRaw['dati-artigiani']?.[
                    'attivita-aa'
                  ]
                    ? {
                        description:
                          this.getXmlText(
                            licensesAndRegistersRaw['dati-artigiani']?.[
                              'attivita-aa'
                            ],
                          ) ?? null,
                        enrollmentStartDate:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'attivita-aa'
                          ]?.['dt-iscrizione-inizio'] ?? null,
                        startDate:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'attivita-aa'
                          ]?.['dt-inizio'] ?? null,
                      }
                    : null,
                  supplementaryInfo:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'informazioni-supplementari-aa'
                    ] ?? null,
                  cancellation: licensesAndRegistersRaw['dati-artigiani']?.[
                    'cancellazione-aa'
                  ]
                    ? {
                        reasonCode:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'cancellazione-aa'
                          ]?.['c-causale'] ?? null,
                        reason:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'cancellazione-aa'
                          ]?.causale ?? null,
                        assessmentApplicationDate:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'cancellazione-aa'
                          ]?.['dt-domanda-accertamento'] ?? null,
                        resolutionDate:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'cancellazione-aa'
                          ]?.['dt-delibera'] ?? null,
                        cessationDate:
                          licensesAndRegistersRaw['dati-artigiani']?.[
                            'cancellazione-aa'
                          ]?.['dt-cessazione'] ?? null,
                      }
                    : null,
                  suppressedRegisterFlag:
                    this.toYesNoFlag(
                      licensesAndRegistersRaw['dati-artigiani']?.[
                        'f-albo-soppresso'
                      ],
                    ) ?? null,
                  lawReferenceCode:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'c-riferimento-legge'
                    ] ?? null,
                  number: this.toNumber(
                    licensesAndRegistersRaw['dati-artigiani']?.n,
                  ),
                  categoryCode:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'c-categoria'
                    ] ?? null,
                  category:
                    licensesAndRegistersRaw['dati-artigiani']?.categoria ??
                    null,
                  province:
                    licensesAndRegistersRaw['dati-artigiani']?.provincia ??
                    null,
                  assessmentEnrollmentDate:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'dt-iscrizione-accertamento'
                    ] ?? null,
                  applicationDate:
                    licensesAndRegistersRaw['dati-artigiani']?.['dt-domanda'] ??
                    null,
                  assessmentApplicationDate:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'dt-domanda-accertamento'
                    ] ?? null,
                  enrollmentDate:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'dt-iscrizione'
                    ] ?? null,
                  resolutionDate:
                    licensesAndRegistersRaw['dati-artigiani']?.[
                      'dt-delibera'
                    ] ?? null,
                }
              : null,
            professionalRecognitions: licensesAndRegistersRaw[
              'riconoscimenti-professionali'
            ]
              ? {
                  recognitions: this.toArray(
                    licensesAndRegistersRaw['riconoscimenti-professionali']?.[
                      'riconoscimento-professionale'
                    ],
                  ).map((item) => ({
                    text: this.getXmlText(item) ?? null,
                    orderDate: item['dt-provvedimento'] ?? null,
                    enrollmentNumber: this.toNumber(item['n-iscrizione']),
                  })),
                }
              : null,
            installerAuthorizations: licensesAndRegistersRaw[
              'abilitazioni-impiantisti'
            ]
              ? {
                  authorizations: this.toArray(
                    licensesAndRegistersRaw['abilitazioni-impiantisti']?.[
                      'abilitazione-impiantisti'
                    ],
                  ).map((item) => ({
                    qualificationCode: item['c-qualifica'] ?? null,
                    qualification: item.qualifica ?? null,
                    letter: item.lettera ?? null,
                    letterDescription: item['descrizione-lettera'] ?? null,
                    letters: item.lettere ?? null,
                    limitations: item.limitazioni ?? null,
                    allCompanyActivitiesFlag:
                      this.toYesNoFlag(item['f-tutte-attivita-impresa']) ??
                      null,
                    province: item.provincia ?? null,
                    number: this.toNumber(item.n),
                    assessmentDate: item['dt-accertamento'] ?? null,
                    enrollmentDate: item['dt-iscrizione'] ?? null,
                    issuingBodyCode: item['c-ente-rilascio'] ?? null,
                    issuingBody: item['ente-rilascio'] ?? null,
                  })),
                  lawReferenceCode:
                    licensesAndRegistersRaw['abilitazioni-impiantisti']?.[
                      'c-riferimento-legge'
                    ] ?? null,
                  lawReference:
                    licensesAndRegistersRaw['abilitazioni-impiantisti']?.[
                      'riferimento-legge'
                    ] ?? null,
                }
              : null,
            cleaningAuthorization: licensesAndRegistersRaw[
              'abilitazione-pulizia'
            ]
              ? {
                  tierCode:
                    licensesAndRegistersRaw['abilitazione-pulizia']?.[
                      'c-fascia'
                    ] ?? null,
                  tier:
                    licensesAndRegistersRaw['abilitazione-pulizia']?.fascia ??
                    null,
                  volumeCode:
                    licensesAndRegistersRaw['abilitazione-pulizia']?.[
                      'c-volume'
                    ] ?? null,
                  volume:
                    licensesAndRegistersRaw['abilitazione-pulizia']?.volume ??
                    null,
                  notificationDate:
                    licensesAndRegistersRaw['abilitazione-pulizia']?.[
                      'dt-denuncia'
                    ] ?? null,
                  additionalDetails:
                    licensesAndRegistersRaw['abilitazione-pulizia']?.[
                      'ulteriori-specifiche'
                    ] ?? null,
                }
              : null,
            porteringAuthorization: licensesAndRegistersRaw[
              'abilitazione-facchinaggio'
            ]
              ? {
                  tierCode:
                    licensesAndRegistersRaw['abilitazione-facchinaggio']?.[
                      'c-fascia'
                    ] ?? null,
                  tier:
                    licensesAndRegistersRaw['abilitazione-facchinaggio']
                      ?.fascia ?? null,
                  volumeCode:
                    licensesAndRegistersRaw['abilitazione-facchinaggio']?.[
                      'c-volume'
                    ] ?? null,
                  volume:
                    licensesAndRegistersRaw['abilitazione-facchinaggio']
                      ?.volume ?? null,
                  notificationDate:
                    licensesAndRegistersRaw['abilitazione-facchinaggio']?.[
                      'dt-denuncia'
                    ] ?? null,
                  additionalDetails:
                    licensesAndRegistersRaw['abilitazione-facchinaggio']?.[
                      'ulteriori-specifiche'
                    ] ?? null,
                }
              : null,
            roles: licensesAndRegistersRaw.ruoli
              ? {
                  roles: this.toArray(licensesAndRegistersRaw.ruoli?.ruolo).map(
                    (item) => ({
                      roleCancellation: item['cancellazione-ruolo']
                        ? {
                            reasonCode:
                              item['cancellazione-ruolo']?.['c-causale'] ??
                              null,
                            reason:
                              item['cancellazione-ruolo']?.causale ?? null,
                            applicationDate:
                              item['cancellazione-ruolo']?.['dt-domanda'] ??
                              null,
                            resolutionDate:
                              item['cancellazione-ruolo']?.['dt-delibera'] ??
                              null,
                            cessationDate:
                              item['cancellazione-ruolo']?.['dt-cessazione'] ??
                              null,
                          }
                        : null,
                      typeCode: item['c-tipo'] ?? null,
                      type: item.tipo ?? null,
                      categoryCode: item['c-categoria'] ?? null,
                      category: item.categoria ?? null,
                      qualificationCode: item['c-qualifica'] ?? null,
                      qualification: item.qualifica ?? null,
                      formCode: item['c-forma'] ?? null,
                      form: item.forma ?? null,
                      number: this.toNumber(item.n),
                      enrollmentDate: item['dt-iscrizione'] ?? null,
                      issuingBodyCode: item['c-ente-rilascio'] ?? null,
                      issuingBody: item['ente-rilascio'] ?? null,
                      province: item.provincia ?? null,
                    }),
                  ),
                }
              : null,
            preciousMetalsRegister: licensesAndRegistersRaw['registro-preziosi']
              ? {
                  qualification: licensesAndRegistersRaw['registro-preziosi']
                    ?.qualifica
                    ? {
                        code:
                          licensesAndRegistersRaw['registro-preziosi']
                            ?.qualifica?.c ?? null,
                      }
                    : null,
                  qualifications: licensesAndRegistersRaw['registro-preziosi']
                    ?.qualifiche
                    ? {
                        qualification: licensesAndRegistersRaw[
                          'registro-preziosi'
                        ]?.qualifiche?.qualifica
                          ? {
                              code:
                                licensesAndRegistersRaw['registro-preziosi']
                                  ?.qualifiche?.qualifica?.c ?? null,
                            }
                          : null,
                      }
                    : null,
                  publicSecurityAuthorization: licensesAndRegistersRaw[
                    'registro-preziosi'
                  ]?.['autorizzazione-ps']
                    ? {
                        number: this.toNumber(
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'autorizzazione-ps'
                          ]?.n,
                        ),
                        date:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'autorizzazione-ps'
                          ]?.dt ?? null,
                      }
                    : null,
                  taxStamp: licensesAndRegistersRaw['registro-preziosi']?.[
                    'tassa-cg'
                  ]
                    ? {
                        number: this.toNumber(
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'tassa-cg'
                          ]?.n,
                        ),
                        date:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'tassa-cg'
                          ]?.dt ?? null,
                      }
                    : null,
                  brand:
                    licensesAndRegistersRaw['registro-preziosi']?.marchio ??
                    null,
                  roleCancellation: licensesAndRegistersRaw[
                    'registro-preziosi'
                  ]?.['cancellazione-ruolo']
                    ? {
                        reasonCode:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'cancellazione-ruolo'
                          ]?.['c-causale'] ?? null,
                        reason:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'cancellazione-ruolo'
                          ]?.causale ?? null,
                        applicationDate:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'cancellazione-ruolo'
                          ]?.['dt-domanda'] ?? null,
                        resolutionDate:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'cancellazione-ruolo'
                          ]?.['dt-delibera'] ?? null,
                        cessationDate:
                          licensesAndRegistersRaw['registro-preziosi']?.[
                            'cancellazione-ruolo'
                          ]?.['dt-cessazione'] ?? null,
                      }
                    : null,
                  number: this.toNumber(
                    licensesAndRegistersRaw['registro-preziosi']?.n,
                  ),
                  applicationDate:
                    licensesAndRegistersRaw['registro-preziosi']?.[
                      'dt-domanda'
                    ] ?? null,
                }
              : null,
            businessStartNotifications: licensesAndRegistersRaw[
              'denunce-inizio-attivita'
            ]
              ? {
                  notifications: this.toArray(
                    licensesAndRegistersRaw['denunce-inizio-attivita']?.[
                      'denuncia-inizio-attivita'
                    ],
                  ).map((item) => ({
                    typeCode: item['c-tipo'] ?? null,
                    type: item.tipo ?? null,
                    notificationDate: item['dt-denuncia'] ?? null,
                    issuingBodyCode: item['c-ente-rilascio'] ?? null,
                    issuingBody: item['ente-rilascio'] ?? null,
                  })),
                }
              : null,
            licenses: licensesAndRegistersRaw.licenze
              ? {
                  licenses: this.toArray(
                    licensesAndRegistersRaw.licenze?.licenza,
                  ).map((item) => ({
                    undocumentedInfo: item['info-non-documentata'] ?? null,
                    bakeryLicense: item['molini-panificatori']
                      ? {
                          bakerySection: item['molini-panificatori']
                            ?.panificatori
                            ? {
                                plantCharacteristics1: item[
                                  'molini-panificatori'
                                ]?.panificatori?.['caratteristiche-impianto-1']
                                  ? {
                                      nominalCapacityQuintals:
                                        item['molini-panificatori']
                                          ?.panificatori?.[
                                          'caratteristiche-impianto-1'
                                        ]?.['quintali-potenza-nominale'] ??
                                        null,
                                      heatingType:
                                        item['molini-panificatori']
                                          ?.panificatori?.[
                                          'caratteristiche-impianto-1'
                                        ]?.['tipo-riscaldamento'] ?? null,
                                      fuelType:
                                        item['molini-panificatori']
                                          ?.panificatori?.[
                                          'caratteristiche-impianto-1'
                                        ]?.['tipo-combustibile'] ?? null,
                                    }
                                  : null,
                                plantCharacteristics2: item[
                                  'molini-panificatori'
                                ]?.panificatori?.['caratteristiche-impianto-2']
                                  ? {
                                      nominalCapacityQuintals:
                                        item['molini-panificatori']
                                          ?.panificatori?.[
                                          'caratteristiche-impianto-2'
                                        ]?.['quintali-potenza-nominale'] ??
                                        null,
                                      heatingType:
                                        item['molini-panificatori']
                                          ?.panificatori?.[
                                          'caratteristiche-impianto-2'
                                        ]?.['tipo-riscaldamento'] ?? null,
                                      fuelType:
                                        item['molini-panificatori']
                                          ?.panificatori?.[
                                          'caratteristiche-impianto-2'
                                        ]?.['tipo-combustibile'] ?? null,
                                    }
                                  : null,
                                equipment: item['molini-panificatori']
                                  ?.panificatori?.apparecchi
                                  ? {
                                      kneaders: this.toNumber(
                                        item['molini-panificatori']
                                          ?.panificatori?.apparecchi?.[
                                          'n-impastatrici'
                                        ],
                                      ),
                                      shaping: this.toNumber(
                                        item['molini-panificatori']
                                          ?.panificatori?.apparecchi?.[
                                          'n-formatrici'
                                        ],
                                      ),
                                      breadstickMachines: this.toNumber(
                                        item['molini-panificatori']
                                          ?.panificatori?.apparecchi?.[
                                          'n-grissinatrici'
                                        ],
                                      ),
                                      dividers: this.toNumber(
                                        item['molini-panificatori']
                                          ?.panificatori?.apparecchi?.[
                                          'n-spezzatrici'
                                        ],
                                      ),
                                      laminators: this.toNumber(
                                        item['molini-panificatori']
                                          ?.panificatori?.apparecchi?.[
                                          'n-laminatoi'
                                        ],
                                      ),
                                    }
                                  : null,
                              }
                            : null,
                          millSection: item['molini-panificatori']?.molini
                            ? {
                                cerealCapacities: item['molini-panificatori']
                                  ?.molini?.['potenze-cereali-macchinari']
                                  ? {
                                      entries: this.toArray(
                                        item['molini-panificatori']?.molini?.[
                                          'potenze-cereali-macchinari'
                                        ]?.['potenza-cereali-macchinari'],
                                      ).map((capacity) => ({
                                        machinery: capacity.macchinari
                                          ? {
                                              characteristic1:
                                                capacity.macchinari?.[
                                                  'caratteristica-1'
                                                ] ?? null,
                                              characteristic2:
                                                capacity.macchinari?.[
                                                  'caratteristica-2'
                                                ] ?? null,
                                              characteristic3:
                                                capacity.macchinari?.[
                                                  'caratteristica-3'
                                                ] ?? null,
                                              characteristic4:
                                                capacity.macchinari?.[
                                                  'caratteristica-4'
                                                ] ?? null,
                                              cleaningMachinesFlag:
                                                this.toYesNoFlag(
                                                  capacity.macchinari?.[
                                                    'f-apparecchi-pulitura'
                                                  ],
                                                ) ?? null,
                                            }
                                          : null,
                                        nominalCapacityQuintals:
                                          capacity[
                                            'quintali-potenza-nominale'
                                          ] ?? null,
                                        actualCapacityQuintals:
                                          capacity['quintali-potenza-reale'] ??
                                          null,
                                        cerealType:
                                          capacity['tipo-cereale'] ?? null,
                                        otherCerealType:
                                          capacity['altro-tipo-cereale'] ??
                                          null,
                                      })),
                                    }
                                  : null,
                                storage: item['molini-panificatori']?.molini
                                  ?.stoccaggio
                                  ? {
                                      warehouses:
                                        item['molini-panificatori']?.molini
                                          ?.stoccaggio?.magazzini ?? null,
                                      silos:
                                        item['molini-panificatori']?.molini
                                          ?.stoccaggio?.silos ?? null,
                                    }
                                  : null,
                                category:
                                  item['molini-panificatori']?.molini
                                    ?.categoria ?? null,
                              }
                            : null,
                          typeCode:
                            item['molini-panificatori']?.['c-tipo'] ?? null,
                          type: item['molini-panificatori']?.tipo ?? null,
                          number: this.toNumber(item['molini-panificatori']?.n),
                          enrollmentDate:
                            item['molini-panificatori']?.['dt-iscrizione'] ??
                            null,
                          status: item['molini-panificatori']?.stato ?? null,
                          management:
                            item['molini-panificatori']?.conduzione ?? null,
                          name:
                            item['molini-panificatori']?.denominazione ?? null,
                          startDate:
                            item['molini-panificatori']?.[
                              'dt-inizio-rapporto'
                            ] ?? null,
                          endDate:
                            item['molini-panificatori']?.['dt-fine-rapporto'] ??
                            null,
                        }
                      : null,
                    licenseAuthorization: item['licenza-autorizzazione']
                      ? {
                          issuingAuthorityCode:
                            item['licenza-autorizzazione']?.[
                              'c-autorita-rilascio'
                            ] ?? null,
                          issuingAuthority:
                            item['licenza-autorizzazione']?.[
                              'autorita-rilascio'
                            ] ?? null,
                          number: this.toNumber(
                            item['licenza-autorizzazione']?.n,
                          ),
                          enrollmentDate:
                            item['licenza-autorizzazione']?.['dt-iscrizione'] ??
                            null,
                          code: item['licenza-autorizzazione']?.c ?? null,
                          type: item['licenza-autorizzazione']?.tipo ?? null,
                        }
                      : null,
                    licenseIndex: item['p-licenza'] ?? null,
                    undocumentedFlag:
                      this.toYesNoFlag(item['f-non-documentata']) ?? null,
                    undocumentedCode: item['c-non-documentata'] ?? null,
                  })),
                }
              : null,
            moralRequirements: licensesAndRegistersRaw[
              'requisiti-morali-professionali'
            ]
              ? {
                  requirements: this.toArray(
                    licensesAndRegistersRaw['requisiti-morali-professionali']?.[
                      'requisito-morale-professionale'
                    ],
                  ).map((item) => ({
                    typeCode: item['c-tipo'] ?? null,
                    type: item.tipo ?? null,
                    statusCode: item['c-stato'] ?? null,
                    status: item.stato ?? null,
                    entityCode: item['c-ente'] ?? null,
                    entity: item.ente ?? null,
                    notificationDate: item['dt-denuncia'] ?? null,
                    assessmentDate: item['dt-accertamento'] ?? null,
                    expiryDate: item['dt-decadenza'] ?? null,
                    additionalDetails: item['ulteriori-specifiche'] ?? null,
                  })),
                }
              : null,
            retailTrade: licensesAndRegistersRaw['commercio-dettaglio']
              ? {
                  additionalInfo: licensesAndRegistersRaw[
                    'commercio-dettaglio'
                  ]?.['integrazione-informazioni']
                    ? {
                        specialTables: licensesAndRegistersRaw[
                          'commercio-dettaglio'
                        ]?.['integrazione-informazioni']?.['tabelle-speciali']
                          ? {
                              text:
                                this.getXmlText(
                                  licensesAndRegistersRaw[
                                    'commercio-dettaglio'
                                  ]?.['integrazione-informazioni']?.[
                                    'tabelle-speciali'
                                  ],
                                ) ?? null,
                              pharmacyFlag:
                                this.toYesNoFlag(
                                  licensesAndRegistersRaw[
                                    'commercio-dettaglio'
                                  ]?.['integrazione-informazioni']?.[
                                    'tabelle-speciali'
                                  ]?.['f-farmacia'],
                                ) ?? null,
                              tobaccoSalesFlag:
                                this.toYesNoFlag(
                                  licensesAndRegistersRaw[
                                    'commercio-dettaglio'
                                  ]?.['integrazione-informazioni']?.[
                                    'tabelle-speciali'
                                  ]?.['f-vendita-generi-monopolio'],
                                ) ?? null,
                              fuelSalesFlag:
                                this.toYesNoFlag(
                                  licensesAndRegistersRaw[
                                    'commercio-dettaglio'
                                  ]?.['integrazione-informazioni']?.[
                                    'tabelle-speciali'
                                  ]?.['f-vendita-carburanti'],
                                ) ?? null,
                              squareMeters:
                                licensesAndRegistersRaw[
                                  'commercio-dettaglio'
                                ]?.['integrazione-informazioni']?.[
                                  'tabelle-speciali'
                                ]?.mq ?? null,
                            }
                          : null,
                        notes: this.toArray(
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.note,
                        ).map((note) => String(note)),
                        businessCessation: licensesAndRegistersRaw[
                          'commercio-dettaglio'
                        ]?.['integrazione-informazioni']?.[
                          'cessazione-esercizio'
                        ]
                          ? {
                              notes: this.toArray(
                                licensesAndRegistersRaw[
                                  'commercio-dettaglio'
                                ]?.['integrazione-informazioni']?.[
                                  'cessazione-esercizio'
                                ]?.note,
                              ).map((note) => String(note)),
                              cessationDate:
                                licensesAndRegistersRaw[
                                  'commercio-dettaglio'
                                ]?.['integrazione-informazioni']?.[
                                  'cessazione-esercizio'
                                ]?.['dt-cessazione'] ?? null,
                              effectDate:
                                licensesAndRegistersRaw[
                                  'commercio-dettaglio'
                                ]?.['integrazione-informazioni']?.[
                                  'cessazione-esercizio'
                                ]?.['dt-decorrenza'] ?? null,
                            }
                          : null,
                        insertionDate:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['dt-inserimento'] ?? null,
                        effectDate:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['dt-decorrenza'] ?? null,
                        requestTypeCode:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['c-tipo-domanda'] ?? null,
                        requestType:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['tipo-domanda'] ?? null,
                        authorizationNumber: this.toNumber(
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['n-autorizzazione'],
                        ),
                        presentationDate:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['dt-presentazione'] ?? null,
                        municipalityCode:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['c-comune-presentazione'] ?? null,
                        municipality:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['comune-presentazione'] ?? null,
                        province:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['provincia-presentazione'] ?? null,
                        protocolNumber: this.toNumber(
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['n-protocollo'],
                        ),
                        facilityTypeCode:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['c-struttura-esercizio'] ?? null,
                        facilityType:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['struttura-esercizio'] ?? null,
                        foodSalesAreaSqm:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['mq-vendita-alimentare'] ?? null,
                        nonFoodSalesAreaSqm:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['mq-vendita-non-alimentare'] ?? null,
                        facilityAreaSqm:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['mq-esercizio'] ?? null,
                        shoppingCenter:
                          licensesAndRegistersRaw['commercio-dettaglio']?.[
                            'integrazione-informazioni'
                          ]?.['centro-commerciale'] ?? null,
                      }
                    : null,
                  declarationDate:
                    licensesAndRegistersRaw['commercio-dettaglio']?.[
                      'dt-dichiarazione'
                    ] ?? null,
                  salesArea:
                    licensesAndRegistersRaw['commercio-dettaglio']?.[
                      'superficie-vendita'
                    ] ?? null,
                  sectorCode:
                    licensesAndRegistersRaw['commercio-dettaglio']?.[
                      'c-settore-merceologico'
                    ] ?? null,
                  sector:
                    licensesAndRegistersRaw['commercio-dettaglio']?.[
                      'settore-merceologico'
                    ] ?? null,
                }
              : null,
            cooperativeSociety: licensesAndRegistersRaw['societa-cooperativa']
              ? {
                  presentationDate:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'dt-presentazione'
                    ] ?? null,
                  enrollmentNumber: this.toNumber(
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'n-iscrizione'
                    ],
                  ),
                  enrollmentDate:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'dt-iscrizione'
                    ] ?? null,
                  sectionCode:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'c-sezione'
                    ] ?? null,
                  section:
                    licensesAndRegistersRaw['societa-cooperativa']?.sezione ??
                    null,
                  subSectionCode:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'c-sotto-sezione'
                    ] ?? null,
                  subSection:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'sotto-sezione'
                    ] ?? null,
                  categoryCode:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'c-categoria'
                    ] ?? null,
                  category:
                    licensesAndRegistersRaw['societa-cooperativa']?.categoria ??
                    null,
                  activityCategoryCode:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'c-categoria-attivita-eserc'
                    ] ?? null,
                  activityCategory:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'categoria-attivita-esercitata'
                    ] ?? null,
                  governanceTypeCode:
                    licensesAndRegistersRaw['societa-cooperativa']?.[
                      'c-tipo-forma-amministrativa'
                    ] ?? null,
                  numShareholders: this.toNumber(
                    licensesAndRegistersRaw['societa-cooperativa']?.['n-soci'],
                  ),
                }
              : null,
            regionalCooperativeRegister: licensesAndRegistersRaw[
              'albo-regionale-coop-sociali'
            ]
              ? {
                  sections: licensesAndRegistersRaw[
                    'albo-regionale-coop-sociali'
                  ]?.sezioni
                    ? {
                        sections: this.toArray(
                          licensesAndRegistersRaw['albo-regionale-coop-sociali']
                            ?.sezioni?.sezione,
                        ).map((section) => ({
                          code: section.c ?? null,
                          description: section.descrizione ?? null,
                          enrollmentDate: section['dt-iscrizione'] ?? null,
                          lastCommunicationDate:
                            section['dt-ultima-comunicazione'] ?? null,
                          directFarmerFlag:
                            this.toYesNoFlag(
                              section['f-coltivatore-diretto'],
                            ) ?? null,
                          aaChamberdCode: section['cciaa-aa'] ?? null,
                          aaNumber: this.toNumber(section['n-aa']),
                          pendingDecisionFlag:
                            this.toYesNoFlag(section['f-attesa-decisione']) ??
                            null,
                          effectDate: section['dt-decorrenza'] ?? null,
                        })),
                      }
                    : null,
                  interventionAreas: licensesAndRegistersRaw[
                    'albo-regionale-coop-sociali'
                  ]?.['aree-intervento']
                    ? {
                        areas: this.toArray(
                          licensesAndRegistersRaw[
                            'albo-regionale-coop-sociali'
                          ]?.['aree-intervento']?.['area-intervento'],
                        ).map((area) => ({
                          description: this.getXmlText(area) ?? null,
                          code: area.c ?? null,
                        })),
                      }
                    : null,
                  registerDescription:
                    licensesAndRegistersRaw['albo-regionale-coop-sociali']?.[
                      'desc-albo'
                    ] ?? null,
                  enrollmentDate:
                    licensesAndRegistersRaw['albo-regionale-coop-sociali']?.[
                      'dt-iscrizione'
                    ] ?? null,
                  cancellationDate:
                    licensesAndRegistersRaw['albo-regionale-coop-sociali']?.[
                      'dt-cancellazione'
                    ] ?? null,
                }
              : null,
            brandAssignees: licensesAndRegistersRaw['assegnatari-marchio']
              ? {
                  enrollment: licensesAndRegistersRaw['assegnatari-marchio']
                    ?.iscrizione
                    ? {
                        typeCode:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.['c-tipo'] ?? null,
                        type:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.tipo ?? null,
                        enrollmentDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.['dt-iscrizione'] ?? null,
                        brandNumber: this.toNumber(
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.['n-marchio'],
                        ),
                        chamberCode:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.cciaa ?? null,
                        assignmentDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.['dt-assegnazione'] ?? null,
                        categoryCode:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.['c-categoria'] ?? null,
                        category:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.iscrizione?.categoria ?? null,
                      }
                    : null,
                  cancellation: licensesAndRegistersRaw['assegnatari-marchio']
                    ?.cancellazione
                    ? {
                        deedDetails: licensesAndRegistersRaw[
                          'assegnatari-marchio'
                        ]?.cancellazione?.['estremi-atto']
                          ? {
                              court:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']
                                  ?.tribunale ?? null,
                              notary:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.notaio ??
                                null,
                              otherIndications:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.[
                                  'altre-indicazioni'
                                ] ?? null,
                              registrationDate:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.[
                                  'dt-registrazione'
                                ] ?? null,
                              registrationNumber: this.toNumber(
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.[
                                  'n-registrazione'
                                ],
                              ),
                              registryOfficeLocality:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.[
                                  'localita-ufficio-registro'
                                ] ?? null,
                              registryOfficeProvince:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.[
                                  'provincia-ufficio-registro'
                                ] ?? null,
                              type:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.tipo ??
                                null,
                              typeCode:
                                licensesAndRegistersRaw['assegnatari-marchio']
                                  ?.cancellazione?.['estremi-atto']?.[
                                  'c-tipo'
                                ] ?? null,
                            }
                          : null,
                        cessationInfo:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['info-cessazione'] ?? null,
                        cancellationDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['dt-cancellazione'] ?? null,
                        cessationDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['dt-cessazione'] ?? null,
                        applicationDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['dt-domanda'] ?? null,
                        notificationDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['dt-denuncia'] ?? null,
                        reasonCode:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['c-causale'] ?? null,
                        reason:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.causale ?? null,
                        activityCessationDate:
                          licensesAndRegistersRaw['assegnatari-marchio']
                            ?.cancellazione?.['dt-cessazione-attivita'] ?? null,
                      }
                    : null,
                }
              : null,
            environmentalDeclarations: {
              declarations: this.toArray(
                licensesAndRegistersRaw['dichiarazioni-ambientali']?.[
                  'dichiarazione-ambientale'
                ],
              ).map((item) => ({
                registrationDetails: {
                  details: this.toArray(
                    item['dettagli-iscrizione']?.['dettaglio-iscrizione'],
                  ).map((detail) => ({
                    startDate: detail['dt-inizio'] ?? null,
                    issueDate: detail['dt-emissione'] ?? null,
                    expiryDate: detail['dt-scadenza'] ?? null,
                    detailStatus: detail['stato-dettaglio'] ?? null,
                    statusStartDate: detail['dt-inizio-stato'] ?? null,
                    statusEndDate: detail['dt-fine-stato'] ?? null,
                    additionalDetails: {
                      details: this.toArray(
                        detail['ulteriori-dettagli']?.['ulteriore-dettaglio'],
                      ).map((additionalDetail) => ({
                        text: additionalDetail['#text'] ?? null,
                        typeCode: additionalDetail['c-tipo'] ?? null,
                        type: additionalDetail.tipo ?? null,
                      })),
                    },
                  })),
                },
                typeCode: item['c-tipo'] ?? null,
                type: item.tipo ?? null,
                sourceCode: item['c-fonte'] ?? null,
                source: item.fonte ?? null,
                provinceSection: item['provincia-sezione'] ?? null,
                province: item.provincia ?? null,
                number: this.toNumber(item.n),
                year: item.anno ?? null,
                firstEnrollmentDate: item['dt-prima-iscrizione'] ?? null,
                enrollmentDate: item['dt-iscrizione'] ?? null,
                cancellationDate: item['dt-cancellazione'] ?? null,
                enrollmentStatus: item['stato-iscrizione'] ?? null,
                statusStartDate: item['dt-inizio-stato'] ?? null,
                statusEndDate: item['dt-fine-stato'] ?? null,
              })),
            },
          }
        : null,
      officePeople: {
        people: this.toArray(officePeopleRaw?.persona).map((persona) => ({
          index: persona.progressivo ?? null,
          isRegisteredRepresentative: persona['f-rappresentante-ri'] ?? null,
          isAdministrator: persona['f-amministratore'] ?? null,
          isAuditor: persona['f-sindaco'] ?? null,
          physicalPerson: persona['persona-fisica']
            ? {
                lastName: persona['persona-fisica'].cognome ?? null,
                firstName: persona['persona-fisica'].nome ?? null,
                taxCode: persona['persona-fisica']['c-fiscale'] ?? null,
                gender: persona['persona-fisica'].sesso ?? null,
                birthInfo: persona['persona-fisica']['estremi-nascita']
                  ? {
                      date:
                        persona['persona-fisica']['estremi-nascita']?.dt ??
                        null,
                      city:
                        persona['persona-fisica']['estremi-nascita']?.comune ??
                        null,
                      province:
                        persona['persona-fisica']['estremi-nascita']
                          ?.provincia ?? null,
                    }
                  : null,
              }
            : null,
          legalPerson: persona['persona-giuridica']
            ? {
                name: persona['persona-giuridica'].denominazione ?? null,
                taxCode: persona['persona-giuridica']['c-fiscale'] ?? null,
              }
            : null,
          certifiedEmail: persona['indirizzo-posta-certificata'] ?? null,
          address: this.mapAddress(persona.indirizzo),
          roleAssignmentGroups: this.toArray(
            persona['atti-conferimento-cariche']?.['atto-conferimento-cariche'],
          ).map((group) => ({
            groupIndex: group['p-gruppo-cariche'] ?? null,
            roles: {
              role: this.toArray(group.cariche?.carica).map((role) => ({
                roleIndex: role['p-carica'] ?? null,
                roleCode: role['c-carica'] ?? null,
                registrationDate: role['dt-iscrizione'] ?? null,
                appointmentDate: role['dt-atto-nomina'] ?? null,
                durationCode: role['c-durata'] ?? null,
                durationDescription: role['descrizione-durata'] ?? null,
                referenceBalanceDate: role['dt-riferimento-bilancio'] ?? null,
                presentationDate: role['dt-presentazione'] ?? null,
              })),
            },
          })),
        })),
      },
      localizations: localizationsRaw
        ? {
            locations: this.toArray(localizationsRaw.localizzazione).map(
              (location) => ({
                subTypes: location['sotto-tipi']
                  ? {
                      subTypes: this.toArray(
                        location['sotto-tipi']?.['sotto-tipo'],
                      ).map((subType) => ({
                        description: this.getXmlText(subType) ?? null,
                        code: subType.c ?? null,
                      })),
                    }
                  : null,
                address: location['indirizzo-localizzazione']
                  ? {
                      municipalityCode:
                        location['indirizzo-localizzazione']?.['c-comune'] ??
                        null,
                      city:
                        location['indirizzo-localizzazione']?.comune ?? null,
                      province:
                        location['indirizzo-localizzazione']?.provincia ??
                        null,
                      provinceTer:
                        location['indirizzo-localizzazione']?.[
                          'provincia-ter'
                        ] ?? null,
                      topographyCode:
                        location['indirizzo-localizzazione']?.['c-toponimo'] ??
                        null,
                      topography:
                        location['indirizzo-localizzazione']?.toponimo ?? null,
                      street: location['indirizzo-localizzazione']?.via ?? null,
                      streetNumber: this.toNumber(
                        location['indirizzo-localizzazione']?.['n-civico'],
                      ),
                      postalCode:
                        location['indirizzo-localizzazione']?.cap ?? null,
                      postalCodeTer:
                        location['indirizzo-localizzazione']?.['cap-ter'] ??
                        null,
                      countryCode:
                        location['indirizzo-localizzazione']?.['c-stato'] ??
                        null,
                      country:
                        location['indirizzo-localizzazione']?.stato ?? null,
                      hamlet:
                        location['indirizzo-localizzazione']?.frazione ?? null,
                      otherIndications:
                        location['indirizzo-localizzazione']?.[
                          'altre-indicazioni'
                        ] ?? null,
                      roadRegistryCode:
                        location['indirizzo-localizzazione']?.['c-stradario'] ??
                        null,
                      zoneCode:
                        location['indirizzo-localizzazione']?.['c-zona'] ??
                        null,
                      thirdPartyHeadquartersFlag:
                        this.toYesNoFlag(
                          location['indirizzo-localizzazione']?.[
                            'f-sede-presso-terzi'
                          ],
                        ) ?? null,
                    }
                  : null,
                phoneNumber: location.telefono?.n ?? null,
                telex: location.telex ?? null,
                telefaxNumber: location.telefax?.n ?? null,
                outOfProvinceHq: location['sede-fuori-provincia']
                  ? {
                      reaNumber: this.toNumber(
                        location['sede-fuori-provincia']?.['n-rea'],
                      ),
                      rdNumber: this.toNumber(
                        location['sede-fuori-provincia']?.['n-rd'],
                      ),
                      aaNumber: this.toNumber(
                        location['sede-fuori-provincia']?.['n-aa'],
                      ),
                      chamberCode:
                        location['sede-fuori-provincia']?.cciaa ?? null,
                    }
                  : null,
                secondaryRegisteredOffice: location['sede-secondaria-rs']
                  ? {
                      secondaryOfficeNumber: this.toNumber(
                        location['sede-secondaria-rs']?.['n-sede-secondaria'],
                      ),
                      courtMunicipalityCode:
                        location['sede-secondaria-rs']?.[
                          'c-comune-tribunale'
                        ] ?? null,
                      courtMunicipality:
                        location['sede-secondaria-rs']?.[
                          'comune-tribunale'
                        ] ?? null,
                      courtProvince:
                        location['sede-secondaria-rs']?.[
                          'provincia-tribunale'
                        ] ?? null,
                      enrollmentDate:
                        location['sede-secondaria-rs']?.['dt-iscrizione'] ??
                        null,
                    }
                  : null,
                predecessorCompany: location['impresa-subentrata']
                  ? {
                      name: location['impresa-subentrata']?.denominazione ?? null,
                      taxCode:
                        location['impresa-subentrata']?.['c-fiscale'] ?? null,
                      chamberCode:
                        location['impresa-subentrata']?.cciaa ?? null,
                      reaNumber: this.toNumber(
                        location['impresa-subentrata']?.['n-rea'],
                      ),
                      rdNumber: this.toNumber(
                        location['impresa-subentrata']?.['n-rd'],
                      ),
                      riNumber: this.toNumber(
                        location['impresa-subentrata']?.['n-ri'],
                      ),
                      successionTitleCode:
                        location['impresa-subentrata']?.['c-titolo-subentro'] ??
                        null,
                      successionTitle:
                        location['impresa-subentrata']?.['titolo-subentro'] ??
                        null,
                    }
                  : null,
                pursuedActivity: location['attivita-esercitata'] ?? null,
                secondaryActivity:
                  location['attivita-secondaria-esercitata'] ?? null,
                craftsActivityBolzano: location['attivita-aa-bz']
                  ? {
                      trades: location['attivita-aa-bz']?.['mestieri-aa']
                        ? {
                            trades: this.toArray(
                              location['attivita-aa-bz']?.['mestieri-aa']?.[
                                'mestiere-aa'
                              ],
                            ).map((trade) => ({
                              description: this.getXmlText(trade) ?? null,
                              code: trade.c ?? null,
                              tradeDescription: trade.descrizione ?? null,
                              furtherDescription:
                                trade['ulteriore-descrizione'] ?? null,
                              activityStartDate:
                                trade['dt-inizio-attivita'] ?? null,
                            })),
                          }
                        : null,
                      descriptions:
                        location['attivita-aa-bz']?.descrizione ?? null,
                      cancellation: location['attivita-aa-bz']?.[
                        'cancellazione-aa-bz'
                      ]
                        ? {
                            reasonCode:
                              location['attivita-aa-bz']?.[
                                'cancellazione-aa-bz'
                              ]?.['c-causale'] ?? null,
                            reason:
                              location['attivita-aa-bz']?.[
                                'cancellazione-aa-bz'
                              ]?.causale ?? null,
                            assessmentApplicationDate:
                              location['attivita-aa-bz']?.[
                                'cancellazione-aa-bz'
                              ]?.['dt-domanda-accertamento'] ?? null,
                            effectDate:
                              location['attivita-aa-bz']?.[
                                'cancellazione-aa-bz'
                              ]?.['dt-effetto'] ?? null,
                          }
                        : null,
                      startDate: location['attivita-aa-bz']?.['dt-inizio'] ?? null,
                      isSecondaryActivityFlag:
                        this.toYesNoFlag(
                          location['attivita-aa-bz']?.[
                            'f-attivita-secondaria'
                          ],
                        ) ?? null,
                    }
                  : null,
                nonCraftsActivity: location['attivita-no-aa']
                  ? {
                      cancellation: location['attivita-no-aa']?.[
                        'cancellazione-aa'
                      ]
                        ? {
                            reasonCode:
                              location['attivita-no-aa']?.['cancellazione-aa']?.[
                                'c-causale'
                              ] ?? null,
                            reason:
                              location['attivita-no-aa']?.['cancellazione-aa']
                                ?.causale ?? null,
                            assessmentApplicationDate:
                              location['attivita-no-aa']?.['cancellazione-aa']?.[
                                'dt-domanda-accertamento'
                              ] ?? null,
                            resolutionDate:
                              location['attivita-no-aa']?.['cancellazione-aa']?.[
                                'dt-delibera'
                              ] ?? null,
                            cessationDate:
                              location['attivita-no-aa']?.['cancellazione-aa']?.[
                                'dt-cessazione'
                              ] ?? null,
                          }
                        : null,
                      categoryCode:
                        location['attivita-no-aa']?.['c-categoria'] ?? null,
                      category: location['attivita-no-aa']?.categoria ?? null,
                      descriptions:
                        location['attivita-no-aa']?.descrizione ?? null,
                      startDate: location['attivita-no-aa']?.['dt-inizio'] ?? null,
                      supplementaryInfo:
                        location['attivita-no-aa']?.[
                          'informazioni-supplementari-aa'
                        ] ?? null,
                    }
                  : null,
                activityDetails: this.toArray(
                  location['dettagli-attivita'],
                ).map((item) => ({
                  typeCode: item['c-tipo'] ?? null,
                  type: item.tipo ?? null,
                  details: this.toArray(item['dettaglio-attivita']).map(
                    (detail) => ({
                      description: this.getXmlText(detail) ?? null,
                      detailCode: detail['c-dettaglio'] ?? null,
                    }),
                  ),
                })),
                atecoClassifications2002: location[
                  'classificazioni-ateco-2002'
                ]
                  ? {
                      classifications: this.toArray(
                        location['classificazioni-ateco-2002']?.[
                          'classificazione-ateco-2002'
                        ],
                      ).map((classification) => ({
                        activityCode: classification['c-attivita'] ?? null,
                        activityDescription: classification.attivita ?? null,
                        relevanceCode: classification['c-importanza'] ?? null,
                        relevanceDescription: classification.importanza ?? null,
                        startDate: classification['dt-inizio'] ?? null,
                      })),
                    }
                  : null,
                atecoClassifications: this.toArray(
                  location['classificazioni-ateco'],
                ).map((classificationGroup) => ({
                  classifications: this.toArray(
                    classificationGroup['classificazione-ateco'],
                  ).map((classification) => ({
                    activityCode: classification['c-attivita'] ?? null,
                    activityDescription: classification.attivita ?? null,
                    relevanceCode: classification['c-importanza'] ?? null,
                    relevanceDescription: classification.importanza ?? null,
                    naceCode: classification['c-nace'] ?? null,
                    startDate: classification['dt-inizio'] ?? null,
                    referenceDate: classification['dt-riferimento'] ?? null,
                    sourceCode: classification['c-fonte'] ?? null,
                    sourceDescription: classification.fonte ?? null,
                  })),
                  codingCode: classificationGroup['c-codifica'] ?? null,
                  coding: classificationGroup.codifica ?? null,
                })),
                licensesAndRegisters: location['albi-ruoli-licenze']
                  ? {
                      craftsData: null,
                      professionalRecognitions: null,
                      installerAuthorizations: null,
                      cleaningAuthorization: null,
                      porteringAuthorization: null,
                      roles: null,
                      preciousMetalsRegister: null,
                      businessStartNotifications: null,
                      licenses: null,
                      moralRequirements: null,
                      retailTrade: null,
                      cooperativeSociety: null,
                      regionalCooperativeRegister: null,
                      brandAssignees: null,
                      environmentalDeclarations: location[
                        'albi-ruoli-licenze'
                      ]?.['dichiarazioni-ambientali']
                        ? {
                            declarations: this.toArray(
                              location['albi-ruoli-licenze']?.[
                                'dichiarazioni-ambientali'
                              ]?.['dichiarazione-ambientale'],
                            ).map((item) => ({
                              registrationDetails: {
                                details: this.toArray(
                                  item['dettagli-iscrizione']?.[
                                    'dettaglio-iscrizione'
                                  ],
                                ).map((detail) => ({
                                  startDate: detail['dt-inizio'] ?? null,
                                  issueDate: detail['dt-emissione'] ?? null,
                                  expiryDate: detail['dt-scadenza'] ?? null,
                                  detailStatus: detail['stato-dettaglio'] ?? null,
                                  statusStartDate:
                                    detail['dt-inizio-stato'] ?? null,
                                  statusEndDate: detail['dt-fine-stato'] ?? null,
                                  additionalDetails: {
                                    details: this.toArray(
                                      detail['ulteriori-dettagli']?.[
                                        'ulteriore-dettaglio'
                                      ],
                                    ).map((additionalDetail) => ({
                                      text:
                                        this.getXmlText(additionalDetail) ??
                                        null,
                                      typeCode:
                                        additionalDetail['c-tipo'] ?? null,
                                      type: additionalDetail.tipo ?? null,
                                    })),
                                  },
                                })),
                              },
                              typeCode: item['c-tipo'] ?? null,
                              type: item.tipo ?? null,
                              sourceCode: item['c-fonte'] ?? null,
                              source: item.fonte ?? null,
                              provinceSection: item['provincia-sezione'] ?? null,
                              province: item.provincia ?? null,
                              number: this.toNumber(item.n),
                              year: item.anno ?? null,
                              firstEnrollmentDate:
                                item['dt-prima-iscrizione'] ?? null,
                              enrollmentDate: item['dt-iscrizione'] ?? null,
                              cancellationDate: item['dt-cancellazione'] ?? null,
                              enrollmentStatus: item['stato-iscrizione'] ?? null,
                              statusStartDate: item['dt-inizio-stato'] ?? null,
                              statusEndDate: item['dt-fine-stato'] ?? null,
                            })),
                          }
                        : null,
                    }
                  : null,
                people: location.persone
                  ? {
                      people: this.toArray(location.persone?.persona).map(
                        (persona) => ({
                          physicalPerson: persona['persona-fisica']
                            ? {
                                birthDetails: persona['persona-fisica']?.[
                                  'estremi-nascita'
                                ]
                                  ? {
                                      date:
                                        persona['persona-fisica']?.[
                                          'estremi-nascita'
                                        ]?.dt ?? null,
                                      municipalityCode:
                                        persona['persona-fisica']?.[
                                          'estremi-nascita'
                                        ]?.['c-comune'] ?? null,
                                      city:
                                        persona['persona-fisica']?.[
                                          'estremi-nascita'
                                        ]?.comune ?? null,
                                      province:
                                        persona['persona-fisica']?.[
                                          'estremi-nascita'
                                        ]?.provincia ?? null,
                                      countryCode:
                                        persona['persona-fisica']?.[
                                          'estremi-nascita'
                                        ]?.['c-stato'] ?? null,
                                      country:
                                        persona['persona-fisica']?.[
                                          'estremi-nascita'
                                        ]?.stato ?? null,
                                    }
                                  : null,
                                fiscalDomicile: mapFullAddress(
                                  persona['persona-fisica']?.[
                                    'domicilio-fiscale'
                                  ],
                                ),
                                honoraryTitles: persona['persona-fisica']?.[
                                  'titoli-onorifici'
                                ]
                                  ? {
                                      titles: this.toArray(
                                        persona['persona-fisica']?.[
                                          'titoli-onorifici'
                                        ]?.['titolo-onorifico'],
                                      ).map((title) => ({
                                        text: this.getXmlText(title) ?? null,
                                        code: title.c ?? null,
                                      })),
                                    }
                                  : null,
                                lastName:
                                  persona['persona-fisica']?.cognome ?? null,
                                firstName:
                                  persona['persona-fisica']?.nome ?? null,
                                taxCode:
                                  persona['persona-fisica']?.['c-fiscale'] ??
                                  null,
                                gender: persona['persona-fisica']?.sesso ?? null,
                                citizenshipCode:
                                  persona['persona-fisica']?.[
                                    'c-cittadinanza'
                                  ] ?? null,
                                citizenship:
                                  persona['persona-fisica']?.cittadinanza ??
                                  null,
                                legalCapacityCode:
                                  persona['persona-fisica']?.[
                                    'c-capacita-di-agire'
                                  ] ?? null,
                                legalCapacity:
                                  persona['persona-fisica']?.[
                                    'capacita-di-agire'
                                  ] ?? null,
                                educationTitleCode:
                                  persona['persona-fisica']?.[
                                    'c-titolo-studio'
                                  ] ?? null,
                                educationTitle:
                                  persona['persona-fisica']?.[
                                    'titolo-studio'
                                  ] ?? null,
                                previousOccupationCode:
                                  persona['persona-fisica']?.[
                                    'c-precedente-occupazione'
                                  ] ?? null,
                                previousOccupation:
                                  persona['persona-fisica']?.[
                                    'precedente-occupazione'
                                  ] ?? null,
                              }
                            : null,
                          legalPerson: persona['persona-giuridica']
                            ? {
                                reaNumber: this.toNumber(
                                  persona['persona-giuridica']?.['n-rea'],
                                ),
                                rdNumber: this.toNumber(
                                  persona['persona-giuridica']?.['n-rd'],
                                ),
                                chamberCode:
                                  persona['persona-giuridica']?.cciaa ?? null,
                                name:
                                  persona['persona-giuridica']?.denominazione ??
                                  null,
                                riName:
                                  persona['persona-giuridica']?.[
                                    'denominazione-ri'
                                  ] ?? null,
                                taxCode:
                                  persona['persona-giuridica']?.['c-fiscale'] ??
                                  null,
                                incorporationDate:
                                  persona['persona-giuridica']?.[
                                    'dt-costituzione'
                                  ] ?? null,
                                incorporationStatusCode:
                                  persona['persona-giuridica']?.[
                                    'c-stato-costituzione'
                                  ] ?? null,
                                incorporationStatus:
                                  persona['persona-giuridica']?.[
                                    'stato-costituzione'
                                  ] ?? null,
                              }
                            : null,
                          shareholderInfo: persona['informazioni-socio']
                            ? {
                                info: this.toArray(
                                  persona['informazioni-socio']?.[
                                    'informazione-socio'
                                  ],
                                ).map((info) => ({
                                  text: this.getXmlText(info) ?? null,
                                  typeCode: info['c-tipo'] ?? null,
                                  type: info.tipo ?? null,
                                })),
                              }
                            : null,
                          certifiedEmail:
                            persona['indirizzo-posta-certificata'] ?? null,
                          address: mapFullAddress(persona.indirizzo),
                          riAddress: mapFullAddress(persona['indirizzo-ri']),
                          quota: persona.quota
                            ? {
                                currencyCode: persona.quota?.['c-valuta'] ?? null,
                                currency: persona.quota?.valuta ?? null,
                                value: persona.quota?.valore ?? null,
                                amountInEuros:
                                  persona.quota?.[
                                    'ammontare-convertito-in-euro'
                                  ] ?? null,
                                percentage: persona.quota?.percentuale ?? null,
                              }
                            : null,
                          roleAppointmentDeeds: null,
                          bankruptcy: null,
                          installerAuthorizations: null,
                          personRoles: persona['ruoli-persona']
                            ? {
                                roles: this.toArray(
                                  persona['ruoli-persona']?.['ruolo-persona'],
                                ).map((role) => ({
                                  reaSection: role['f-sezione-rea'] ?? null,
                                  typeCode: role['c-tipo'] ?? null,
                                  type: role.tipo ?? null,
                                  categoryCode: role['c-categoria'] ?? null,
                                  category: role.categoria ?? null,
                                  qualificationCode:
                                    role['c-qualifica'] ?? null,
                                  qualification: role.qualifica ?? null,
                                  formCode: role['c-forma'] ?? null,
                                  form: role.forma ?? null,
                                  number: this.toNumber(role.n),
                                  enrollmentDate:
                                    role['dt-iscrizione'] ?? null,
                                  issuingBodyCode:
                                    role['c-ente-rilascio'] ?? null,
                                  issuingBody: role['ente-rilascio'] ?? null,
                                  province: role.provincia ?? null,
                                })),
                              }
                            : null,
                          licenses: null,
                          index: persona.progressivo ?? null,
                          reaRepresentativeFlag:
                            this.toYesNoFlag(persona['f-rappresentante-rea']) ??
                            null,
                          riRepresentativeFlag:
                            this.toYesNoFlag(persona['f-rappresentante-ri']) ??
                            null,
                          aeRepresentativeFlag:
                            this.toYesNoFlag(persona['f-rappresentante-ae']) ??
                            null,
                          administratorFlag:
                            this.toYesNoFlag(persona['f-amministratore']) ??
                            null,
                          auditorFlag:
                            this.toYesNoFlag(persona['f-sindaco']) ?? null,
                          electorFlag:
                            this.toYesNoFlag(persona['f-elettore']) ?? null,
                          modificationType: persona['tipo-modifica'] ?? null,
                          lastName: persona.cognome ?? null,
                          firstName: persona.nome ?? null,
                          taxCode: persona['c-fiscale'] ?? null,
                          chamberCode: persona.cciaa ?? null,
                          rdNumber: this.toNumber(persona['n-rd']),
                          reaNumber: this.toNumber(persona['n-rea']),
                          signatureDepositedFlag:
                            this.toYesNoFlag(persona['f-firma-depositata']) ??
                            null,
                          pcoAuthorizedFlag:
                            this.toYesNoFlag(persona['f-incaricato-pco']) ??
                            null,
                        }),
                      ),
                    }
                  : null,
                supplementaryInfo: location['informazioni-supplementari']
                  ? {
                      jointPowers:
                        location['informazioni-supplementari']?.[
                          'poteri-congiunti'
                        ] ?? null,
                      registryInfo:
                        location['informazioni-supplementari']?.[
                          'info-visura'
                        ] ?? null,
                      genericInfo:
                        location['informazioni-supplementari']?.[
                          'info-generiche'
                        ] ?? null,
                      locationInfo:
                        location['informazioni-supplementari']?.[
                          'info-localizzazione'
                        ] ?? null,
                    }
                  : null,
                locationCessation: location['cessazione-localizzazione']
                  ? {
                      deedDetails: mapDeedDetails(
                        location['cessazione-localizzazione']?.['estremi-atto'],
                      ),
                      cessationInfo:
                        location['cessazione-localizzazione']?.[
                          'info-cessazione'
                        ] ?? null,
                      cessationDate:
                        location['cessazione-localizzazione']?.[
                          'dt-cessazione'
                        ] ?? null,
                      applicationDate:
                        location['cessazione-localizzazione']?.['dt-domanda'] ??
                        null,
                      notificationDate:
                        location['cessazione-localizzazione']?.['dt-denuncia'] ??
                        null,
                      reasonCode:
                        location['cessazione-localizzazione']?.['c-causale'] ??
                        null,
                      reason:
                        location['cessazione-localizzazione']?.causale ?? null,
                    }
                  : null,
                locationTransfer: location['trasferimento-localizzazione']
                  ? {
                      city:
                        location['trasferimento-localizzazione']?.comune ??
                        null,
                      province:
                        location['trasferimento-localizzazione']?.provincia ??
                        null,
                    }
                  : null,
                successorCompany: location['impresa-subentrante']
                  ? {
                      name:
                        location['impresa-subentrante']?.denominazione ?? null,
                      taxCode:
                        location['impresa-subentrante']?.['c-fiscale'] ?? null,
                      chamberCode:
                        location['impresa-subentrante']?.cciaa ?? null,
                      reaNumber: this.toNumber(
                        location['impresa-subentrante']?.['n-rea'],
                      ),
                      rdNumber: this.toNumber(
                        location['impresa-subentrante']?.['n-rd'],
                      ),
                      riNumber: this.toNumber(
                        location['impresa-subentrante']?.['n-ri'],
                      ),
                      successionTitleCode:
                        location['impresa-subentrante']?.[
                          'c-titolo-subentro'
                        ] ?? null,
                      successionTitle:
                        location['impresa-subentrante']?.['titolo-subentro'] ??
                        null,
                    }
                  : null,
                index: location.progressivo ?? null,
                reducedDataFlag:
                  this.toYesNoFlag(location['f-dati-ridotti']) ?? null,
                typeCode: location['c-tipo'] ?? null,
                type: location.tipo ?? null,
                enrollmentTypeCode: location['c-tipo-iscrizione'] ?? null,
                enrollmentType: location['tipo-iscrizione'] ?? null,
                name: location.denominazione ?? null,
                sign: location.insegna ?? null,
                openingDate: location['dt-apertura'] ?? null,
                cessationFlag: this.toYesNoFlag(location['f-cessazione']) ?? null,
                euidCode: location['c-euid'] ?? null,
                accountingRecordsFlag:
                  this.toYesNoFlag(location['f-scritture-contabili']) ?? null,
              }),
            ),
          }
        : null,
      listedCompanyInfo: listedCompanyInfoRaw
        ? {
            fromYear: listedCompanyInfoRaw['anno-dal'] ?? null,
            toYear: listedCompanyInfoRaw['anno-al'] ?? null,
            market: listedCompanyInfoRaw.mercato ?? null,
            sourceCode: listedCompanyInfoRaw['c-fonte'] ?? null,
            source: listedCompanyInfoRaw.fonte ?? null,
            lastUpdateDate:
              listedCompanyInfoRaw['dt-ultimo-aggiornamento'] ?? null,
            lastFinancialStatementDate:
              listedCompanyInfoRaw['dt-ultimo-deposito-es'] ?? null,
          }
        : null,
      shareholdersList: shareholdersListRaw
        ? {
            practiceDetails: mapPracticeDetails(
              shareholdersListRaw['estremi-pratica'],
            ),
            confirmedPracticeDetails: mapConfirmedPracticeDetails(
              shareholdersListRaw['estremi-pratica-riconfermata'],
            ),
            shareCapital: shareholdersListRaw['capitale-sociale']
              ? {
                  authorizedAmount: shareholdersListRaw['capitale-sociale']
                    ?.deliberato
                    ? {
                        amount:
                          shareholdersListRaw['capitale-sociale']?.deliberato
                            ?.ammontare ?? null,
                        amountInEuros:
                          shareholdersListRaw['capitale-sociale']?.deliberato?.[
                            'ammontare-convertito-in-euro'
                          ] ?? null,
                      }
                    : null,
                  subscribedAmount: shareholdersListRaw['capitale-sociale']
                    ?.sottoscritto
                    ? {
                        amount:
                          shareholdersListRaw['capitale-sociale']?.sottoscritto
                            ?.ammontare ?? null,
                        amountInEuros:
                          shareholdersListRaw['capitale-sociale']
                            ?.sottoscritto?.['ammontare-convertito-in-euro'] ??
                          null,
                      }
                    : null,
                  paidAmount: shareholdersListRaw['capitale-sociale']?.versato
                    ? {
                        amount:
                          shareholdersListRaw['capitale-sociale']?.versato
                            ?.ammontare ?? null,
                        amountInEuros:
                          shareholdersListRaw['capitale-sociale']?.versato?.[
                            'ammontare-convertito-in-euro'
                          ] ?? null,
                      }
                    : null,
                  contributionType: shareholdersListRaw['capitale-sociale']?.[
                    'tipo-conferimenti'
                  ]
                    ? {
                        description: this.getXmlText(
                          shareholdersListRaw['capitale-sociale']?.[
                            'tipo-conferimenti'
                          ],
                        ),
                        code:
                          shareholdersListRaw['capitale-sociale']?.[
                            'tipo-conferimenti'
                          ]?.c ?? null,
                      }
                    : null,
                  currencyCode:
                    shareholdersListRaw['capitale-sociale']?.['c-valuta'] ??
                    null,
                  currency:
                    shareholdersListRaw['capitale-sociale']?.valuta ?? null,
                  amount:
                    shareholdersListRaw['capitale-sociale']?.ammontare ?? null,
                  numShares: this.toNumber(
                    shareholdersListRaw['capitale-sociale']?.['n-azioni'],
                  ),
                  numQuotas: this.toNumber(
                    shareholdersListRaw['capitale-sociale']?.['n-quote'],
                  ),
                }
              : null,
            frames: shareholdersListRaw.riquadri
              ? {
                  frames: this.toArray(
                    shareholdersListRaw.riquadri?.riquadro,
                  ).map((frame) => ({
                    deedType: frame['tipo-atto']
                      ? {
                          description: this.getXmlText(frame['tipo-atto']),
                          code: frame['tipo-atto']?.c ?? null,
                        }
                      : null,
                    shareComposition: mapShareComposition(
                      frame['composizione-quote'],
                    ),
                    shareRestrictions: this.toArray(frame['vincoli-quote']).map(
                      (item) => String(item),
                    ),
                    holders: mapHolders(frame.titolari),
                    participationRights: frame['diritti-partecipazione']
                      ? {
                          rights: this.toArray(
                            frame['diritti-partecipazione']?.[
                              'diritto-partecipazione'
                            ],
                          ).map((right) => ({
                            participationRoles: this.toArray(
                              right['ruolo-partecipazione'],
                            ).map((role) => ({
                              description: this.getXmlText(role) ?? null,
                              code: role.c ?? null,
                            })),
                            typeCode: right['c-tipo'] ?? null,
                            type: right.tipo ?? null,
                            fractionNumerator:
                              right['frazione-numeratore'] ?? null,
                            fractionDenominator:
                              right['frazione-denominatore'] ?? null,
                            percentage: right.percentuale ?? null,
                            currencyCode: right['c-valuta'] ?? null,
                            currency: right.valuta ?? null,
                            value: right.valore ?? null,
                          })),
                        }
                      : null,
                    notes: this.toArray(frame.note).map((item) => String(item)),
                    code: frame.c ?? null,
                    occurrences: this.toNumber(frame['n-ricorrenze']),
                    annotationDate: frame['dt-annotazione'] ?? null,
                    eventDate: frame['dt-evento'] ?? null,
                  })),
                }
              : null,
            notes: this.toArray(shareholdersListRaw.note).map((item) =>
              String(item),
            ),
            confirmedPracticeNotes: this.toArray(
              shareholdersListRaw['note-pratica-riconfermata'],
            ).map((item) => String(item)),
            shareholdersFromDate:
              shareholdersListRaw['dt-soci-titolari-dal'] ?? null,
            shareholdersToDate:
              shareholdersListRaw['dt-soci-titolari-al'] ?? null,
            consortiumFlag:
              this.toYesNoFlag(shareholdersListRaw['f-consorzio']) ?? null,
            latestShareholdersListFlag:
              this.toYesNoFlag(shareholdersListRaw['f-ultimo-elenco-soci']) ??
              null,
            lawReferenceCode:
              shareholdersListRaw['c-riferimento-legge'] ?? null,
            lawReference: shareholdersListRaw['riferimento-legge'] ?? null,
          }
        : null,
      shareholdersTable: {
        shareholders: {
          shareholders: this.toArray(shareholdersTableRaw?.soci?.socio).map(
            (shareholder) => ({
              personalInfo: shareholder['anagrafica-titolare']
                ? {
                    typeCode:
                      shareholder['anagrafica-titolare']?.['c-tipo'] ?? null,
                    type: shareholder['anagrafica-titolare']?.tipo ?? null,
                    taxCode:
                      shareholder['anagrafica-titolare']?.['c-fiscale'] ?? null,
                    citizenshipCode:
                      shareholder['anagrafica-titolare']?.['c-cittadinanza'] ??
                      null,
                    citizenship:
                      shareholder['anagrafica-titolare']?.cittadinanza ?? null,
                    name:
                      shareholder['anagrafica-titolare']?.denominazione ?? null,
                    declaredName:
                      shareholder['anagrafica-titolare']?.[
                        'denominazione-denunciata'
                      ] ?? null,
                    lastName:
                      shareholder['anagrafica-titolare']?.cognome ?? null,
                    firstName: shareholder['anagrafica-titolare']?.nome ?? null,
                    isClosed:
                      shareholder['anagrafica-titolare']?.['f-cessata'] ?? null,
                    cancellationDate:
                      shareholder['anagrafica-titolare']?.[
                        'dt-cancellazione'
                      ] ?? null,
                  }
                : null,
              sharesAndRights: {
                rights: this.toArray(
                  shareholder['quote-diritti']?.['quota-diritto'],
                ).map((right) => ({
                  rightTypeCode: right['c-tipo-diritto'] ?? null,
                  rightType: right['tipo-diritto'] ?? null,
                  numShares: this.toNumber(right['n-azioni']),
                  nominalValue: right['valore-nominale'] ?? null,
                  capitalPercentage: right['percentuale-capitale'] ?? null,
                })),
              },
            }),
          ),
        },
        shareholderNotes: {
          notes: this.toArray(
            shareholdersTableRaw?.['note-elenco-soci']?.['nota-elenco-soci'],
          ).map((note) => ({
            text: this.getXmlText(note) ?? null,
            code: note.c ?? null,
          })),
        },
      },
      shareholdersBookAnnotations: shareholdersBookAnnotationsRaw
        ? {
            annotations: this.toArray(
              shareholdersBookAnnotationsRaw['annotazione-libro-soci'],
            ).map((annotation) => ({
              practiceDetails: mapPracticeDetails(
                annotation['estremi-pratica'],
              ),
              confirmedPracticeDetails: mapConfirmedPracticeDetails(
                annotation['estremi-pratica-riconfermata'],
              ),
              transferFrames: annotation['riquadri-trasferimento']
                ? {
                    frames: this.toArray(
                      annotation['riquadri-trasferimento']?.[
                        'riquadro-trasferimento'
                      ],
                    ).map((frame) => ({
                      deedType: frame['tipo-atto']
                        ? {
                            description: this.getXmlText(frame['tipo-atto']),
                            code: frame['tipo-atto']?.c ?? null,
                          }
                        : null,
                      shareComposition: mapShareComposition(
                        frame['composizione-quote'],
                      ),
                      shareRestrictions: this.toArray(
                        frame['vincoli-quote'],
                      ).map((item) => String(item)),
                      holders: mapHolders(frame.titolari),
                      notes: this.toArray(frame.note).map((item) =>
                        String(item),
                      ),
                      annotationDate: frame['dt-annotazione'] ?? null,
                      eventDate: frame['dt-evento'] ?? null,
                    })),
                  }
                : null,
              notes: this.toArray(annotation.note).map((item) => String(item)),
            })),
          }
        : null,
      controllingSubjectsPractices: controllingSubjectsPracticesRaw
        ? {
            practices: this.toArray(
              controllingSubjectsPracticesRaw['pratica-soggetti-controllanti'],
            ).map((practice) => ({
              practiceDetails: mapPracticeDetails(practice['estremi-pratica']),
              controllingSubjects: practice['soggetti-controllanti']
                ? {
                    subjects: this.toArray(
                      practice['soggetti-controllanti']?.[
                        'soggetto-controllante'
                      ],
                    ).map((subject) => ({
                      notes: this.toArray(subject.note).map((item) =>
                        String(item),
                      ),
                      name: subject.denominazione ?? null,
                      taxCode: subject['c-fiscale'] ?? null,
                      incorporationDate: subject['dt-costituzione'] ?? null,
                      countryCode: subject['c-stato'] ?? null,
                      country: subject.stato ?? null,
                      chamberCode: subject.cciaa ?? null,
                      reaNumber: this.toNumber(subject['n-rea']),
                      referenceDate: subject['dt-riferimento'] ?? null,
                      declarationTypeCode:
                        subject['c-tipo-dichiarazione'] ?? null,
                      declarationType: subject['tipo-dichiarazione'] ?? null,
                      controlTypeCode: subject['c-tipo-controllo'] ?? null,
                      controlType: subject['tipo-controllo'] ?? null,
                    })),
                  }
                : null,
              notes: this.toArray(practice.note).map((item) => String(item)),
            })),
            flagInfo:
              this.toYesNoFlag(
                controllingSubjectsPracticesRaw['f-presenza-info'],
              ) ?? null,
          }
        : null,
      subsidiaryCompaniesTable: subsidiaryCompaniesTableRaw
        ? this.toArray(subsidiaryCompaniesTableRaw).map((table) => ({
            subsidiaries: this.toArray(table.partecipata).map((subsidiary) => ({
              sharesAndRights: {
                rights: this.toArray(
                  subsidiary['quote-diritti-impresa']?.[
                    'quota-diritto-impresa'
                  ],
                ).map((right) => ({
                  rightTypeCode: right['c-tipo-diritto'] ?? null,
                  rightType: right['tipo-diritto'] ?? null,
                  numShares: this.toNumber((right as any)['n-azioni']),
                  nominalValue: right['valore-nominale'] ?? null,
                  capitalPercentage: right['percentuale-capitale'] ?? null,
                })),
              },
              participationNotes: {
                notes: this.toArray(
                  (subsidiary as any)['note-partecipazione']?.[
                    'nota-partecipazione'
                  ],
                ).map((note) => ({
                  text: this.getXmlText(note) ?? null,
                  code: note.c ?? null,
                })),
              },
              taxCode: subsidiary['c-fiscale'] ?? null,
              name: subsidiary.denominazione ?? null,
              consortiumFlag:
                this.toYesNoFlag((subsidiary as any)['f-consorzio']) ?? null,
              cooperativeFlag:
                this.toYesNoFlag((subsidiary as any)['f-cooperativa']) ?? null,
              closedFlag:
                this.toYesNoFlag((subsidiary as any)['f-cessata']) ?? null,
              cancellationDate: (subsidiary as any)['dt-cancellazione'] ?? null,
              participationStartDate:
                subsidiary['dt-inizio-partecipazione'] ?? null,
              participationEndDate:
                (subsidiary as any)['dt-fine-partecipazione'] ?? null,
            })),
            typeCode: table['c-tipo-partecipate'] ?? null,
            type: table['tipo-partecipate'] ?? null,
          }))
        : null,
      changesHistory: {
        sessions: this.toArray(
          changesHistoryRaw?.['sessioni-rd-rea']?.['sessione-rd-rea'],
        ).map((session) => ({
          movementCode: session['c-movimentazione'] ?? null,
          movement: session.movimentazione ?? null,
          filingDate: session['dt-denuncia'] ?? null,
          changes: this.toArray(session.modifiche?.modifica).map((change) => ({
            paragraphCode: change['p-modifica'] ?? null,
            effectiveDate: change['dt-effetto'] ?? null,
            typeCode: change['c-tipo'] ?? null,
            type: change.tipo ?? null,
            changeCode: change['c-modifica'] ?? null,
            changeCodeDescription: change['descrizione-c-modifica'] ?? null,
            text: this.getXmlText(change) ?? null,
          })),
        })),
      },
      transcriptions: {
        registeredOfficeProtocols: {
          protocols: this.toArray(
            filingsTranscriptionsRaw?.['protocolli-rs']?.['protocollo-rs'],
          ).map((protocol) => ({
            deed: protocol.atto
              ? {
                  notaryDetails: protocol.atto['estremi-notarili']
                    ? {
                        formCode:
                          protocol.atto['estremi-notarili']?.['c-forma'] ??
                          null,
                        form: protocol.atto['estremi-notarili']?.forma ?? null,
                        notary:
                          protocol.atto['estremi-notarili']?.notaio ?? null,
                        repertoryNumber: this.toNumber(
                          protocol.atto['estremi-notarili']?.['n-repertorio'],
                        ),
                        notaryLocality:
                          protocol.atto['estremi-notarili']?.[
                            'localita-notaio'
                          ] ?? null,
                        notaryProvince:
                          protocol.atto['estremi-notarili']?.[
                            'provincia-notaio'
                          ] ?? null,
                      }
                    : null,
                  homologation: protocol.atto.omologazione
                    ? {
                        homologationDate:
                          protocol.atto.omologazione?.['dt-omologazione'] ??
                          null,
                        number: this.toNumber(protocol.atto.omologazione?.n),
                      }
                    : null,
                  registration: protocol.atto.registrazione
                    ? {
                        registrationDate:
                          protocol.atto.registrazione?.['dt-registrazione'] ??
                          null,
                        number: this.toNumber(protocol.atto.registrazione?.n),
                        registryOffice:
                          protocol.atto.registrazione?.['ufficio-registro'] ??
                          null,
                        registryOfficeProvince:
                          protocol.atto.registrazione?.[
                            'provincia-ufficio-registro'
                          ] ?? null,
                      }
                    : null,
                  chamberFiling: protocol.atto['presentazione-cciaa']
                    ? {
                        presentationDate:
                          protocol.atto['presentazione-cciaa']?.[
                            'dt-presentazione'
                          ] ?? null,
                        protocolNumber: this.toNumber(
                          protocol.atto['presentazione-cciaa']?.[
                            'n-protocollo'
                          ],
                        ),
                      }
                    : null,
                  enrollmentModification: protocol.atto['iscrizione-modifica']
                    ? {
                        enrollmentTypeCode:
                          protocol.atto['iscrizione-modifica']?.[
                            'c-tipo-iscrizione'
                          ] ?? null,
                        enrollmentType:
                          protocol.atto['iscrizione-modifica']?.[
                            'tipo-iscrizione'
                          ] ?? null,
                        filingDate:
                          protocol.atto['iscrizione-modifica']?.[
                            'dt-deposito'
                          ] ?? null,
                        enrollmentDate:
                          protocol.atto['iscrizione-modifica']?.[
                            'dt-iscrizione'
                          ] ?? null,
                        correctionFlag:
                          this.toYesNoFlag(
                            protocol.atto['iscrizione-modifica']?.[
                              'f-rettifica'
                            ],
                          ) ?? null,
                        correctionDate:
                          protocol.atto['iscrizione-modifica']?.[
                            'dt-rettifica'
                          ] ?? null,
                      }
                    : null,
                  code: protocol.atto?.c ?? null,
                  typeCode: protocol.atto?.['c-tipo'] ?? null,
                  type: protocol.atto?.tipo ?? null,
                  typeDescription: protocol.atto?.['descrizione-tipo'] ?? null,
                  deedDate: protocol.atto?.['dt-atto'] ?? null,
                }
              : null,
            registeredOfficeTranscriptions: protocol['trascrizioni-rs']
              ? {
                  transcriptions: this.toArray(
                    protocol['trascrizioni-rs']?.['trascrizione-rs'],
                  ).map((transcription) => ({
                    person: (transcription.persona as any) ?? null,
                    transcriptionType: transcription['tipo-trascrizione']
                      ? {
                          text:
                            this.getXmlText(
                              transcription['tipo-trascrizione'],
                            ) ?? null,
                          transcriptionTypeCode:
                            transcription['tipo-trascrizione']?.[
                              'c-tipo-trascrizione'
                            ] ?? null,
                          modificationTypeCode:
                            transcription['tipo-trascrizione']?.[
                              'c-tipo-modifica'
                            ] ?? null,
                          modificationType:
                            transcription['tipo-trascrizione']?.[
                              'tipo-modifica'
                            ] ?? null,
                        }
                      : null,
                    descriptions: {
                      descriptions: this.toArray(
                        transcription.descrizioni?.descrizione,
                      ).map((item) => String(item)),
                    },
                    transcriptionIndex: transcription['p-trascrizione'] ?? null,
                    modificationTypeCode:
                      transcription['c-tipo-modifica'] ?? null,
                    modificationType: transcription['tipo-modifica'] ?? null,
                  })),
                }
              : null,
            referenceNumber: this.toNumber(protocol['n-riferimento']),
            orderRegisterNumber: this.toNumber(protocol['n-registro-ordine']),
            orderRegisterYear: protocol['anno-registro-ordine'] ?? null,
            courtMunicipalityCode: protocol['c-comune-tribunale'] ?? null,
            court: protocol.tribunale ?? null,
            courtProvince: protocol['provincia-tribunale'] ?? null,
          })),
        },
        registerProtocols: {
          protocols: this.toArray(
            filingsTranscriptionsRaw?.['protocolli-ri']?.['protocollo-ri'],
          ).map((protocol) => ({
            templatesAndTranscriptions: protocol['modelli-trascrizioni']
              ? {
                  templates: {
                    templates: this.toArray(
                      protocol['modelli-trascrizioni']?.modelli?.modello,
                    ).map((template) => ({
                      frames: template.riquadri ? { frames: [] } : null,
                      code: template.c ?? null,
                      occurrences: this.toNumber(template['n-ricorrenze']),
                    })),
                  },
                  registerTranscriptions: protocol['modelli-trascrizioni']?.[
                    'trascrizioni-ri'
                  ]
                    ? {
                        transcriptions: this.toArray(
                          protocol['modelli-trascrizioni']?.[
                            'trascrizioni-ri'
                          ]?.['trascrizione-ri'],
                        ).map((transcription) => ({
                          person: (transcription.persona as any) ?? null,
                          transcriptionType: transcription['tipo-trascrizione']
                            ? {
                                text:
                                  this.getXmlText(
                                    transcription['tipo-trascrizione'],
                                  ) ?? null,
                                transcriptionTypeCode:
                                  transcription['tipo-trascrizione']?.[
                                    'c-tipo-trascrizione'
                                  ] ?? null,
                                modificationTypeCode:
                                  transcription['tipo-trascrizione']?.[
                                    'c-tipo-modifica'
                                  ] ?? null,
                                modificationType:
                                  transcription['tipo-trascrizione']?.[
                                    'tipo-modifica'
                                  ] ?? null,
                              }
                            : null,
                          descriptions: {
                            descriptions: this.toArray(
                              transcription.descrizioni?.descrizione,
                            ).map((item) => String(item)),
                          },
                          enrollmentModification: transcription[
                            'iscrizione-modifica'
                          ]
                            ? {
                                enrollmentTypeCode:
                                  transcription['iscrizione-modifica']?.[
                                    'c-tipo-iscrizione'
                                  ] ?? null,
                                enrollmentType:
                                  transcription['iscrizione-modifica']?.[
                                    'tipo-iscrizione'
                                  ] ?? null,
                                filingDate:
                                  transcription['iscrizione-modifica']?.[
                                    'dt-deposito'
                                  ] ?? null,
                                enrollmentDate:
                                  transcription['iscrizione-modifica']?.[
                                    'dt-iscrizione'
                                  ] ?? null,
                                correctionFlag:
                                  this.toYesNoFlag(
                                    transcription['iscrizione-modifica']?.[
                                      'f-rettifica'
                                    ],
                                  ) ?? null,
                                correctionDate:
                                  transcription['iscrizione-modifica']?.[
                                    'dt-rettifica'
                                  ] ?? null,
                              }
                            : null,
                          transcriptionIndex:
                            transcription['p-trascrizione'] ?? null,
                          modificationTypeCode:
                            transcription['c-tipo-modifica'] ?? null,
                          modificationType:
                            transcription['tipo-modifica'] ?? null,
                        })),
                      }
                    : null,
                }
              : null,
            deedTranscriptions: protocol['atti-trascrizioni']
              ? {
                  transcriptions: this.toArray(
                    protocol['atti-trascrizioni']?.['atto-trascrizioni'],
                  ).map((item) => ({
                    deed: item.atto
                      ? {
                          notaryDetails: item.atto['estremi-notarili']
                            ? {
                                formCode:
                                  item.atto['estremi-notarili']?.['c-forma'] ??
                                  null,
                                form:
                                  item.atto['estremi-notarili']?.forma ?? null,
                                notary:
                                  item.atto['estremi-notarili']?.notaio ?? null,
                                repertoryNumber: this.toNumber(
                                  item.atto['estremi-notarili']?.[
                                    'n-repertorio'
                                  ],
                                ),
                                notaryLocality:
                                  item.atto['estremi-notarili']?.[
                                    'localita-notaio'
                                  ] ?? null,
                                notaryProvince:
                                  item.atto['estremi-notarili']?.[
                                    'provincia-notaio'
                                  ] ?? null,
                              }
                            : null,
                          homologation: item.atto.omologazione
                            ? {
                                homologationDate:
                                  item.atto.omologazione?.['dt-omologazione'] ??
                                  null,
                                number: this.toNumber(
                                  item.atto.omologazione?.n,
                                ),
                              }
                            : null,
                          registration: item.atto.registrazione
                            ? {
                                registrationDate:
                                  item.atto.registrazione?.[
                                    'dt-registrazione'
                                  ] ?? null,
                                number: this.toNumber(
                                  item.atto.registrazione?.n,
                                ),
                                registryOffice:
                                  item.atto.registrazione?.[
                                    'ufficio-registro'
                                  ] ?? null,
                                registryOfficeProvince:
                                  item.atto.registrazione?.[
                                    'provincia-ufficio-registro'
                                  ] ?? null,
                              }
                            : null,
                          chamberFiling: item.atto['presentazione-cciaa']
                            ? {
                                presentationDate:
                                  item.atto['presentazione-cciaa']?.[
                                    'dt-presentazione'
                                  ] ?? null,
                                protocolNumber: this.toNumber(
                                  item.atto['presentazione-cciaa']?.[
                                    'n-protocollo'
                                  ],
                                ),
                              }
                            : null,
                          enrollmentModification: item.atto[
                            'iscrizione-modifica'
                          ]
                            ? {
                                enrollmentTypeCode:
                                  item.atto['iscrizione-modifica']?.[
                                    'c-tipo-iscrizione'
                                  ] ?? null,
                                enrollmentType:
                                  item.atto['iscrizione-modifica']?.[
                                    'tipo-iscrizione'
                                  ] ?? null,
                                filingDate:
                                  item.atto['iscrizione-modifica']?.[
                                    'dt-deposito'
                                  ] ?? null,
                                enrollmentDate:
                                  item.atto['iscrizione-modifica']?.[
                                    'dt-iscrizione'
                                  ] ?? null,
                                correctionFlag:
                                  this.toYesNoFlag(
                                    item.atto['iscrizione-modifica']?.[
                                      'f-rettifica'
                                    ],
                                  ) ?? null,
                                correctionDate:
                                  item.atto['iscrizione-modifica']?.[
                                    'dt-rettifica'
                                  ] ?? null,
                              }
                            : null,
                          code: item.atto.c ?? null,
                          typeCode: item.atto['c-tipo'] ?? null,
                          type: item.atto.tipo ?? null,
                          typeDescription:
                            item.atto['descrizione-tipo'] ?? null,
                          deedDate: item.atto['dt-atto'] ?? null,
                        }
                      : null,
                    registerTranscriptions: item['trascrizioni-ri']
                      ? {
                          transcriptions: this.toArray(
                            item['trascrizioni-ri']?.['trascrizione-ri'],
                          ).map((transcription) => ({
                            person: (transcription.persona as any) ?? null,
                            transcriptionType: transcription[
                              'tipo-trascrizione'
                            ]
                              ? {
                                  text:
                                    this.getXmlText(
                                      transcription['tipo-trascrizione'],
                                    ) ?? null,
                                  transcriptionTypeCode:
                                    transcription['tipo-trascrizione']?.[
                                      'c-tipo-trascrizione'
                                    ] ?? null,
                                  modificationTypeCode:
                                    transcription['tipo-trascrizione']?.[
                                      'c-tipo-modifica'
                                    ] ?? null,
                                  modificationType:
                                    transcription['tipo-trascrizione']?.[
                                      'tipo-modifica'
                                    ] ?? null,
                                }
                              : null,
                            descriptions: {
                              descriptions: this.toArray(
                                transcription.descrizioni?.descrizione,
                              ).map((desc) => String(desc)),
                            },
                            enrollmentModification: transcription[
                              'iscrizione-modifica'
                            ]
                              ? {
                                  enrollmentTypeCode:
                                    transcription['iscrizione-modifica']?.[
                                      'c-tipo-iscrizione'
                                    ] ?? null,
                                  enrollmentType:
                                    transcription['iscrizione-modifica']?.[
                                      'tipo-iscrizione'
                                    ] ?? null,
                                  filingDate:
                                    transcription['iscrizione-modifica']?.[
                                      'dt-deposito'
                                    ] ?? null,
                                  enrollmentDate:
                                    transcription['iscrizione-modifica']?.[
                                      'dt-iscrizione'
                                    ] ?? null,
                                  correctionFlag:
                                    this.toYesNoFlag(
                                      transcription['iscrizione-modifica']?.[
                                        'f-rettifica'
                                      ],
                                    ) ?? null,
                                  correctionDate:
                                    transcription['iscrizione-modifica']?.[
                                      'dt-rettifica'
                                    ] ?? null,
                                }
                              : null,
                            transcriptionIndex:
                              transcription['p-trascrizione'] ?? null,
                            modificationTypeCode:
                              transcription['c-tipo-modifica'] ?? null,
                            modificationType:
                              transcription['tipo-modifica'] ?? null,
                          })),
                        }
                      : null,
                  })),
                }
              : null,
            protocolNumber: this.toNumber(protocol['n-protocollo']),
            officeProtocolNumber: this.toNumber(
              protocol['n-protocollo-ufficio'],
            ),
            year: protocol.anno ?? null,
            protocolDate: protocol['dt-protocollo'] ?? null,
            interchamberCommunicationNumber: this.toNumber(
              protocol['n-comunicazione-intercamerale'],
            ),
            interchamberProtocolNumber: this.toNumber(
              protocol['n-protocollo-intercamerale'],
            ),
            interchamberCommunicationYear:
              protocol['anno-comunicazione-intercam'] ?? null,
            interchamberProtocolYear:
              protocol['anno-protocollo-intercam'] ?? null,
            companyTaxCode: protocol['cf-impresa'] ?? null,
            chamberName: protocol['denom-cciaa'] ?? null,
            preEnrollmentDeedFlag:
              this.toYesNoFlag(protocol['f-atto-pre-iscrizione']) ?? null,
            notificationDate: protocol['dt-denuncia'] ?? null,
          })),
        },
      },
      previousHeadquartersHistory: {
        entries: this.toArray(
          previousHeadquartersHistoryRaw?.['storia-sede-precedente'],
        ).map((entry) => ({
          chamberCode: entry.cciaa ?? null,
          reaNumber: entry['n-rea'] ?? null,
          changesHistory: {
            sessions: this.toArray(
              entry.mad?.['sessioni-rd-rea']?.['sessione-rd-rea'],
            ).map((session) => ({
              movementCode: session['c-movimentazione'] ?? null,
              movement: session.movimentazione ?? null,
              filingDate: session['dt-denuncia'] ?? null,
              changes: this.toArray(session.modifiche?.modifica).map(
                (change) => ({
                  paragraphCode: change['p-modifica'] ?? null,
                  effectiveDate: change['dt-effetto'] ?? null,
                  typeCode: change['c-tipo'] ?? null,
                  type: change.tipo ?? null,
                  changeCode: change['c-modifica'] ?? null,
                  changeCodeDescription:
                    change['descrizione-c-modifica'] ?? null,
                  text: this.getXmlText(change) ?? null,
                }),
              ),
            })),
          },
          filingsTranscriptions: {
            protocols: this.toArray(
              entry.trascrizioni?.['protocolli-ri']?.['protocollo-ri'],
            ).map((protocol) => ({
              protocolNumber: protocol['n-protocollo'] ?? null,
              officeProtocolNumber: protocol['n-protocollo-ufficio'] ?? null,
              year: protocol.anno ?? null,
              protocolDate: protocol['dt-protocollo'] ?? null,
              extraFields: Object.entries(protocol).reduce<
                Record<string, unknown>
              >((acc, [key, value]) => {
                if (
                  ![
                    'n-protocollo',
                    'n-protocollo-ufficio',
                    'anno',
                    'dt-protocollo',
                  ].includes(key)
                ) {
                  acc[key] = value;
                }
                return acc;
              }, {}),
            })),
          },
        })),
      },
      registerEnrollment: registerEnrollmentRaw
        ? {
            sections: registerEnrollmentRaw.sezioni
              ? {
                  sections: this.toArray(
                    registerEnrollmentRaw.sezioni?.sezione,
                  ).map((section) => ({
                    code: section.c ?? null,
                    description: section.descrizione ?? null,
                    enrollmentDate: section['dt-iscrizione'] ?? null,
                    lastCommunicationDate:
                      section['dt-ultima-comunicazione'] ?? null,
                    directFarmerFlag:
                      this.toYesNoFlag(section['f-coltivatore-diretto']) ??
                      null,
                    aaChamberdCode: section['cciaa-aa'] ?? null,
                    aaNumber: this.toNumber(section['n-aa']),
                    pendingDecisionFlag:
                      this.toYesNoFlag(section['f-attesa-decisione']) ?? null,
                    effectDate: section['dt-decorrenza'] ?? null,
                  })),
                }
              : null,
            riAnnotationNumber: this.toNumber(
              registerEnrollmentRaw['n-annotazione-ri'],
            ),
            riEnrollmentNumber: this.toNumber(
              registerEnrollmentRaw['n-iscrizione-ri'],
            ),
            taxCodeNumber: this.toNumber(registerEnrollmentRaw['n-c-fiscale']),
            oldRiAnnotationNumber: this.toNumber(
              registerEnrollmentRaw['n-annotazione-ri-old'],
            ),
            oldRiEnrollmentNumber: this.toNumber(
              registerEnrollmentRaw['n-iscrizione-ri-old'],
            ),
            riProvince: registerEnrollmentRaw['provincia-ri'] ?? null,
            competentChamber: registerEnrollmentRaw['cciaa-competente'] ?? null,
            oldRiEnrollmentNumberCode:
              registerEnrollmentRaw['c-n-iscrizione-ri-old'] ?? null,
            enrollmentDate: registerEnrollmentRaw['dt-iscrizione'] ?? null,
            annotationDate: registerEnrollmentRaw['dt-annotazione'] ?? null,
          }
        : null,
      bylawsDetails: bylawsInfoRaw
        ? {
            companyDuration: bylawsInfoRaw['durata-societa']
              ? {
                  fiscalYearMaturity: bylawsInfoRaw['durata-societa']?.[
                    'scadenza-esercizi'
                  ]
                    ? {
                        firstFiscalYearDate:
                          bylawsInfoRaw['durata-societa']?.[
                            'scadenza-esercizi'
                          ]?.['dt-primo-esercizio'] ?? null,
                        subsequentFiscalYears:
                          bylawsInfoRaw['durata-societa']?.[
                            'scadenza-esercizi'
                          ]?.['esercizi-successivi'] ?? null,
                        balanceExtensionMonths:
                          bylawsInfoRaw['durata-societa']?.[
                            'scadenza-esercizi'
                          ]?.['mesi-proroga-bilancio'] ?? null,
                        balanceExtensionDays:
                          bylawsInfoRaw['durata-societa']?.[
                            'scadenza-esercizi'
                          ]?.['giorni-proroga-bilancio'] ?? null,
                      }
                    : null,
                  endDate:
                    bylawsInfoRaw['durata-societa']?.['dt-termine'] ?? null,
                  indefiniteDurationFlag:
                    this.toYesNoFlag(
                      bylawsInfoRaw['durata-societa']?.[
                        'f-durata-indeterminata'
                      ],
                    ) ?? null,
                  extensionTypeCode:
                    bylawsInfoRaw['durata-societa']?.['c-tipo-proroga'] ?? null,
                  extensionType:
                    bylawsInfoRaw['durata-societa']?.['tipo-proroga'] ?? null,
                  tacitExtensionYears: this.toNumber(
                    bylawsInfoRaw['durata-societa']?.['n-anni-proroga-tacita'],
                  ),
                }
              : null,
            registeredOfficeRegistration: bylawsInfoRaw['iscrizione-rs']
              ? {
                  enrollmentDate:
                    bylawsInfoRaw['iscrizione-rs']?.['dt-iscrizione'] ?? null,
                  rsNumber: this.toNumber(
                    bylawsInfoRaw['iscrizione-rs']?.['n-rs'],
                  ),
                  volumeNumber: this.toNumber(
                    bylawsInfoRaw['iscrizione-rs']?.['n-volume'],
                  ),
                  caseFileNumber: this.toNumber(
                    bylawsInfoRaw['iscrizione-rs']?.['n-fascicolo'],
                  ),
                  courtLocality:
                    bylawsInfoRaw['iscrizione-rs']?.['localita-tribunale'] ??
                    null,
                  courtProvince:
                    bylawsInfoRaw['iscrizione-rs']?.['provincia-tribunale'] ??
                    null,
                }
              : null,
            corporatePurpose: bylawsInfoRaw['oggetto-sociale'] ?? null,
            powers: bylawsInfoRaw.poteri
              ? {
                  bylawsPowers:
                    bylawsInfoRaw.poteri?.['poteri-statuto'] ?? null,
                  rolePowers: this.toArray(
                    bylawsInfoRaw.poteri?.['poteri-carica'],
                  ).map((role) => ({
                    text: this.getXmlText(role) ?? null,
                    roleCode: role['c-carica'] ?? null,
                    role: role.carica ?? null,
                  })),
                  partnershipAgreementPowers:
                    bylawsInfoRaw.poteri?.['poteri-patti-sociali'] ?? null,
                  partnerPowers: bylawsInfoRaw.poteri?.['poteri-soci'] ?? null,
                  jointPowers:
                    bylawsInfoRaw.poteri?.['poteri-congiunti'] ?? null,
                  liabilityLimitations: bylawsInfoRaw.poteri?.[
                    'limitazioni-responsabilita'
                  ]
                    ? {
                        text:
                          this.getXmlText(
                            bylawsInfoRaw.poteri?.[
                              'limitazioni-responsabilita'
                            ],
                          ) ?? null,
                        inBylawsFlag:
                          this.toYesNoFlag(
                            bylawsInfoRaw.poteri?.[
                              'limitazioni-responsabilita'
                            ]?.['f-presenza-nello-statuto'],
                          ) ?? null,
                      }
                    : null,
                  profitLossDistributions: bylawsInfoRaw.poteri?.[
                    'ripartizioni-utili-perdite'
                  ]
                    ? {
                        text:
                          this.getXmlText(
                            bylawsInfoRaw.poteri?.[
                              'ripartizioni-utili-perdite'
                            ],
                          ) ?? null,
                        inBylawsFlag:
                          this.toYesNoFlag(
                            bylawsInfoRaw.poteri?.[
                              'ripartizioni-utili-perdite'
                            ]?.['f-presenza-nello-statuto'],
                          ) ?? null,
                      }
                    : null,
                }
              : null,
            references: bylawsInfoRaw.riferimenti
              ? {
                  bylawsClauses: bylawsInfoRaw.riferimenti?.clausole
                    ? {
                        withdrawal: bylawsInfoRaw.riferimenti?.clausole?.recesso
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole?.recesso,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.recesso?.['f-presenza-nello-statuto'],
                                ) ?? null,
                            }
                          : null,
                        exclusion: bylawsInfoRaw.riferimenti?.clausole
                          ?.esclusione
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.esclusione,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.esclusione?.['f-presenza-nello-statuto'],
                                ) ?? null,
                            }
                          : null,
                        approval: bylawsInfoRaw.riferimenti?.clausole
                          ?.gradimento
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.gradimento,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.gradimento?.['f-presenza-nello-statuto'],
                                ) ?? null,
                            }
                          : null,
                        preemption: bylawsInfoRaw.riferimenti?.clausole
                          ?.prelazione
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.prelazione,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.prelazione?.['f-presenza-nello-statuto'],
                                ) ?? null,
                            }
                          : null,
                        limitation: bylawsInfoRaw.riferimenti?.clausole
                          ?.limitazione
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.limitazione,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.limitazione?.['f-presenza-nello-statuto'],
                                ) ?? null,
                            }
                          : null,
                        arbitration: bylawsInfoRaw.riferimenti?.clausole
                          ?.compromissorie
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.compromissorie,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole
                                    ?.compromissorie?.[
                                    'f-presenza-nello-statuto'
                                  ],
                                ) ?? null,
                            }
                          : null,
                        other: bylawsInfoRaw.riferimenti?.clausole?.altre
                          ? {
                              text:
                                this.getXmlText(
                                  bylawsInfoRaw.riferimenti?.clausole?.altre,
                                ) ?? null,
                              inBylawsFlag:
                                this.toYesNoFlag(
                                  bylawsInfoRaw.riferimenti?.clausole?.altre?.[
                                    'f-presenza-nello-statuto'
                                  ],
                                ) ?? null,
                            }
                          : null,
                      }
                    : null,
                  bylawsAmendments:
                    bylawsInfoRaw.riferimenti?.['modifiche-statutarie'] ?? null,
                  bylawsDeposit:
                    bylawsInfoRaw.riferimenti?.['deposito-statuto'] ?? null,
                  bylawsModification:
                    bylawsInfoRaw.riferimenti?.['modifica-statuto'] ?? null,
                  companyAggregation:
                    bylawsInfoRaw.riferimenti?.['aggregazione-imprese'] ?? null,
                  courtOrders:
                    bylawsInfoRaw.riferimenti?.['provvedimenti-giudice'] ??
                    null,
                  deferredEffects:
                    bylawsInfoRaw.riferimenti?.['effetti-differiti'] ?? null,
                  arbitration: bylawsInfoRaw.riferimenti?.arbitrato ?? null,
                  suspensiveConditions:
                    bylawsInfoRaw.riferimenti?.['condizioni-sospensive'] ??
                    null,
                  conservatorOrders:
                    bylawsInfoRaw.riferimenti?.['provvedimenti-conservatore'] ??
                    null,
                  authorityOrders:
                    bylawsInfoRaw.riferimenti?.['provvedimenti-autorita'] ??
                    null,
                  corporateGroups:
                    bylawsInfoRaw.riferimenti?.['gruppi-societari'] ?? null,
                  participationAgreements:
                    bylawsInfoRaw.riferimenti?.['accordi-partecipazione'] ??
                    null,
                  networkContract:
                    bylawsInfoRaw.riferimenti?.['contratto-rete'] ?? null,
                  translatedDeeds:
                    bylawsInfoRaw.riferimenti?.['atti-tradotti'] ?? null,
                  startUpDeclarations: bylawsInfoRaw.riferimenti?.[
                    'dichiarazioni-start-up'
                  ]
                    ? {
                        declarations: this.toArray(
                          bylawsInfoRaw.riferimenti?.[
                            'dichiarazioni-start-up'
                          ]?.['dichiarazione-start-up'],
                        ).map((item) => ({
                          text: this.getXmlText(item) ?? null,
                          typeCode: item['c-tipo'] ?? null,
                          type: item.tipo ?? null,
                        })),
                      }
                    : null,
                  incubatorDeclarations: bylawsInfoRaw.riferimenti?.[
                    'dichiarazioni-incubatore'
                  ]
                    ? {
                        declarations: this.toArray(
                          bylawsInfoRaw.riferimenti?.[
                            'dichiarazioni-incubatore'
                          ]?.['dichiarazione-incubatore'],
                        ).map((item) => ({
                          text: this.getXmlText(item) ?? null,
                          typeCode: item['c-tipo'] ?? null,
                          type: item.tipo ?? null,
                        })),
                      }
                    : null,
                  smeDeclarations: bylawsInfoRaw.riferimenti?.[
                    'dichiarazioni-pmi'
                  ]
                    ? {
                        declarations: this.toArray(
                          bylawsInfoRaw.riferimenti?.['dichiarazioni-pmi']?.[
                            'dichiarazione-pmi'
                          ],
                        ).map((item) => ({
                          text: this.getXmlText(item) ?? null,
                          typeCode: item['c-tipo'] ?? null,
                          type: item.tipo ?? null,
                        })),
                      }
                    : null,
                  schoolWorkDeclarations: bylawsInfoRaw.riferimenti?.[
                    'dichiarazioni-scuola-lavoro'
                  ]
                    ? {
                        declarations: this.toArray(
                          bylawsInfoRaw.riferimenti?.[
                            'dichiarazioni-scuola-lavoro'
                          ]?.['dichiarazione-scuola-lavoro'],
                        ).map((item) => ({
                          text: this.getXmlText(item) ?? null,
                          typeCode: item['c-tipo'] ?? null,
                          type: item.tipo ?? null,
                        })),
                      }
                    : null,
                }
              : null,
            declarations: mapDeclarations(bylawsInfoRaw.dichiarazioni),
            nameAbbreviation: bylawsInfoRaw['sigla-denominazione'] ?? null,
            foundationDate: bylawsInfoRaw['dt-fondazione'] ?? null,
            uniqueCommunicationDate:
              bylawsInfoRaw['dt-comunicazione-unica'] ?? null,
            incorporationDeedDate:
              bylawsInfoRaw['dt-atto-costituzione'] ?? null,
            incorporationDate:
              bylawsInfoRaw['dt-costituzione'] ??
              bylawsInfoRaw['dt-atto-costituzione'] ??
              null,
          }
        : null,
      businessNetworks: businessNetworksRaw
        ? {
            networks: this.toArray(businessNetworksRaw['rete-imprese']).map(
              (network) => ({
                referenceCompany: network['impresa-riferimento']
                  ? {
                      name:
                        network['impresa-riferimento']?.denominazione ?? null,
                      taxCode:
                        network['impresa-riferimento']?.['c-fiscale'] ?? null,
                    }
                  : null,
                repertoryNumber: this.toNumber(network['n-repertorio']),
                registrationNumber: this.toNumber(network['n-registrazione']),
                networkName: network.denominazione ?? null,
                taxCode: network['c-fiscale'] ?? null,
              }),
            ),
          }
        : null,
      governanceAndControl: governanceAndControlRaw
        ? {
            administrationSystem: governanceAndControlRaw[
              'sistema-amministrazione'
            ]
              ? {
                  code:
                    governanceAndControlRaw['sistema-amministrazione']?.c ??
                    null,
                  text: this.getXmlText(
                    governanceAndControlRaw['sistema-amministrazione'],
                  ),
                }
              : null,
            accountingControlBody: governanceAndControlRaw[
              'soggetto-controllo-contabile'
            ]
              ? {
                  code:
                    governanceAndControlRaw['soggetto-controllo-contabile']
                      ?.c ?? null,
                  text: this.getXmlText(
                    governanceAndControlRaw['soggetto-controllo-contabile'],
                  ),
                }
              : null,
            administrativeForms: {
              entries: this.toArray(
                governanceAndControlRaw['forme-amministrative']?.[
                  'forma-amministrativa'
                ],
              ).map((entry) => ({
                text: this.getXmlText(entry),
                code: entry.c ?? null,
                activeFlag: this.toYesNoFlag(entry['f-in-carica']) ?? null,
                controlBodyFlag:
                  this.toYesNoFlag(entry['f-organo-controllo']) ?? null,
                minAdministrators: this.toNumber(entry['n-min-amministratori']),
                maxAdministrators: this.toNumber(entry['n-max-amministratori']),
              })),
            },
            activeAdministrativeForms: {
              entries: this.toArray(
                governanceAndControlRaw['forme-amministrative-in-carica']?.[
                  'forma-amministrativa-in-carica'
                ],
              ).map((entry) => ({
                text: this.getXmlText(entry),
                code: entry.c ?? null,
                numActiveAdministrators: this.toNumber(
                  entry['n-amministratori-in-carica'],
                ),
                yearsOfOffice: entry['anni-durata'] ?? null,
                durationCode: entry['c-durata'] ?? null,
                duration: entry.durata ?? null,
                officeStartDate: entry['dt-inizio-carica'] ?? null,
                officeEndDate: entry['dt-fine-carica'] ?? null,
              })),
            },
            controlBodiesInCharge: {
              entries: this.toArray(
                governanceAndControlRaw['organi-controllo-in-carica']?.[
                  'forma-amministrativa-in-carica'
                ],
              ).map((entry) => ({
                text: this.getXmlText(entry),
                code: entry.c ?? null,
                numActiveAdministrators: this.toNumber(
                  entry['n-amministratori-in-carica'],
                ),
                yearsOfOffice: entry['anni-durata'] ?? null,
                durationCode: entry['c-durata'] ?? null,
                duration: entry.durata ?? null,
                officeStartDate: entry['dt-inizio-carica'] ?? null,
                officeEndDate: entry['dt-fine-carica'] ?? null,
              })),
            },
            auditingBoard: governanceAndControlRaw['collegio-sindacale']
              ? {
                  numEffectiveMembers: this.toNumber(
                    governanceAndControlRaw['collegio-sindacale']?.[
                      'n-effettivi'
                    ],
                  ),
                  numAlternateMembers: this.toNumber(
                    governanceAndControlRaw['collegio-sindacale']?.[
                      'n-supplenti'
                    ],
                  ),
                  minMembers: this.toNumber(
                    governanceAndControlRaw['collegio-sindacale']?.['n-min'],
                  ),
                  maxMembers: this.toNumber(
                    governanceAndControlRaw['collegio-sindacale']?.['n-max'],
                  ),
                }
              : null,
            activeAuditingBoard: governanceAndControlRaw[
              'collegio-sindacale-in-carica'
            ]
              ? {
                  numActiveMembers: this.toNumber(
                    governanceAndControlRaw['collegio-sindacale-in-carica']?.[
                      'n-in-carica'
                    ],
                  ),
                  yearsOfOffice:
                    governanceAndControlRaw['collegio-sindacale-in-carica']?.[
                      'anni-durata'
                    ] ?? null,
                  durationCode:
                    governanceAndControlRaw['collegio-sindacale-in-carica']?.[
                      'c-durata'
                    ] ?? null,
                  duration:
                    governanceAndControlRaw['collegio-sindacale-in-carica']
                      ?.durata ?? null,
                  officeStartDate:
                    governanceAndControlRaw['collegio-sindacale-in-carica']?.[
                      'dt-inizio-carica'
                    ] ?? null,
                  officeEndDate:
                    governanceAndControlRaw['collegio-sindacale-in-carica']?.[
                      'dt-fine-carica'
                    ] ?? null,
                }
              : null,
          }
        : null,
      financialAndAssetInfo: financialAssetInfoRaw
        ? {
            investedCapital: financialAssetInfoRaw['capitale-investito']
              ? {
                  currencyCode:
                    financialAssetInfoRaw['capitale-investito']?.['c-valuta'] ??
                    null,
                  currency:
                    financialAssetInfoRaw['capitale-investito']?.valuta ?? null,
                  amount:
                    financialAssetInfoRaw['capitale-investito']?.ammontare ??
                    null,
                  amountInEuros:
                    financialAssetInfoRaw['capitale-investito']?.[
                      'ammontare-convertito-in-euro'
                    ] ?? null,
                }
              : null,
            consortiumFund: financialAssetInfoRaw['fondo-consortile']
              ? {
                  descriptions: financialAssetInfoRaw['fondo-consortile']?.[
                    'descrizioni'
                  ]
                    ? {
                        descriptions: this.toArray(
                          financialAssetInfoRaw['fondo-consortile']?.[
                            'descrizioni'
                          ]?.descrizione,
                        ).map((item) => String(item)),
                      }
                    : null,
                  currencyCode:
                    financialAssetInfoRaw['fondo-consortile']?.['c-valuta'] ??
                    null,
                  currency:
                    financialAssetInfoRaw['fondo-consortile']?.valuta ?? null,
                  amount:
                    financialAssetInfoRaw['fondo-consortile']?.ammontare ??
                    null,
                  amountInEuros:
                    financialAssetInfoRaw['fondo-consortile']?.[
                      'ammontare-convertito-in-euro'
                    ] ?? null,
                }
              : null,
            contributionNominalValue: financialAssetInfoRaw[
              'valore-nominale-conferimenti'
            ]
              ? {
                  currencyCode:
                    financialAssetInfoRaw['valore-nominale-conferimenti']?.[
                      'c-valuta'
                    ] ?? null,
                  currency:
                    financialAssetInfoRaw['valore-nominale-conferimenti']
                      ?.valuta ?? null,
                  amount:
                    financialAssetInfoRaw['valore-nominale-conferimenti']
                      ?.ammontare ?? null,
                  amountInEuros:
                    financialAssetInfoRaw['valore-nominale-conferimenti']?.[
                      'ammontare-convertito-in-euro'
                    ] ?? null,
                }
              : null,
            shareCapital: financialAssetInfoRaw['capitale-sociale']
              ? {
                  authorizedAmount: financialAssetInfoRaw['capitale-sociale']
                    ?.deliberato
                    ? {
                        amount:
                          financialAssetInfoRaw['capitale-sociale']?.deliberato
                            ?.ammontare ?? null,
                        amountInEuros:
                          financialAssetInfoRaw['capitale-sociale']
                            ?.deliberato?.['ammontare-convertito-in-euro'] ??
                          null,
                      }
                    : null,
                  subscribedAmount: financialAssetInfoRaw['capitale-sociale']
                    ?.sottoscritto
                    ? {
                        amount:
                          financialAssetInfoRaw['capitale-sociale']
                            ?.sottoscritto?.ammontare ?? null,
                        amountInEuros:
                          financialAssetInfoRaw['capitale-sociale']
                            ?.sottoscritto?.['ammontare-convertito-in-euro'] ??
                          null,
                      }
                    : null,
                  paidAmount: financialAssetInfoRaw['capitale-sociale']?.versato
                    ? {
                        amount:
                          financialAssetInfoRaw['capitale-sociale']?.versato
                            ?.ammontare ?? null,
                        amountInEuros:
                          financialAssetInfoRaw['capitale-sociale']?.versato?.[
                            'ammontare-convertito-in-euro'
                          ] ?? null,
                      }
                    : null,
                  contributionType: financialAssetInfoRaw['capitale-sociale']?.[
                    'tipo-conferimenti'
                  ]
                    ? {
                        description: this.getXmlText(
                          financialAssetInfoRaw['capitale-sociale']?.[
                            'tipo-conferimenti'
                          ],
                        ),
                        code:
                          financialAssetInfoRaw['capitale-sociale']?.[
                            'tipo-conferimenti'
                          ]?.c ?? null,
                      }
                    : null,
                  currencyCode:
                    financialAssetInfoRaw['capitale-sociale']?.['c-valuta'] ??
                    null,
                  currency:
                    financialAssetInfoRaw['capitale-sociale']?.valuta ?? null,
                  amount:
                    financialAssetInfoRaw['capitale-sociale']?.ammontare ??
                    null,
                  numShares: this.toNumber(
                    financialAssetInfoRaw['capitale-sociale']?.['n-azioni'],
                  ),
                  numQuotas: this.toNumber(
                    financialAssetInfoRaw['capitale-sociale']?.['n-quote'],
                  ),
                }
              : null,
            shareComposition: mapShareComposition(
              financialAssetInfoRaw['composizione-quote'],
            ),
            benefitContributions: financialAssetInfoRaw['conferimenti-benefici']
              ? {
                  text:
                    this.getXmlText(
                      financialAssetInfoRaw['conferimenti-benefici'],
                    ) ?? null,
                  inBylawsFlag:
                    this.toYesNoFlag(
                      financialAssetInfoRaw['conferimenti-benefici']?.[
                        'f-presenza-nello-statuto'
                      ],
                    ) ?? null,
                }
              : null,
            financialInstruments: financialAssetInfoRaw['strumenti-finanziari']
              ? {
                  ordinaryShares:
                    financialAssetInfoRaw['strumenti-finanziari']?.[
                      'azioni-ordinarie'
                    ] ?? null,
                  otherShares:
                    financialAssetInfoRaw['strumenti-finanziari']?.[
                      'altre-azioni'
                    ] ?? null,
                  bonds:
                    financialAssetInfoRaw['strumenti-finanziari']?.[
                      'obbligazioni'
                    ] ?? null,
                  convertibleBonds:
                    financialAssetInfoRaw['strumenti-finanziari']?.[
                      'obbligazioni-convertibili'
                    ] ?? null,
                  debtSecurities:
                    financialAssetInfoRaw['strumenti-finanziari']?.[
                      'titoli-debito'
                    ] ?? null,
                  otherInstruments:
                    financialAssetInfoRaw['strumenti-finanziari']?.[
                      'altri-strumenti'
                    ] ?? null,
                }
              : null,
            capitalReduction:
              financialAssetInfoRaw['diminuzione-capitale'] ?? null,
            shareOffer: financialAssetInfoRaw['offerta-azioni'] ?? null,
            earlyConversion:
              financialAssetInfoRaw['anticipata-conversione'] ?? null,
            specificProjectAssets: financialAssetInfoRaw[
              'patrimonio-specifico-affare'
            ]
              ? {
                  constitutionDeed:
                    financialAssetInfoRaw['patrimonio-specifico-affare']?.[
                      'costituzione'
                    ] ?? null,
                  modification: financialAssetInfoRaw[
                    'patrimonio-specifico-affare'
                  ]?.modifica
                    ? {
                        text:
                          this.getXmlText(
                            financialAssetInfoRaw['patrimonio-specifico-affare']
                              ?.modifica,
                          ) ?? null,
                        modificationIndex:
                          financialAssetInfoRaw['patrimonio-specifico-affare']
                            ?.modifica?.['p-modifica'] ?? null,
                        typeCode:
                          financialAssetInfoRaw['patrimonio-specifico-affare']
                            ?.modifica?.['c-tipo'] ?? null,
                        type:
                          financialAssetInfoRaw['patrimonio-specifico-affare']
                            ?.modifica?.tipo ?? null,
                        effectDate:
                          financialAssetInfoRaw['patrimonio-specifico-affare']
                            ?.modifica?.['dt-effetto'] ?? null,
                        modificationCode:
                          financialAssetInfoRaw['patrimonio-specifico-affare']
                            ?.modifica?.['c-modifica'] ?? null,
                        modificationCodeDescription:
                          financialAssetInfoRaw['patrimonio-specifico-affare']
                            ?.modifica?.['descrizione-c-modifica'] ?? null,
                      }
                    : null,
                  cessationDeed:
                    financialAssetInfoRaw['patrimonio-specifico-affare']?.[
                      'cessazione'
                    ] ?? null,
                }
              : null,
            specificProjectFinancing: financialAssetInfoRaw[
              'finanziamento-specifico-affare'
            ]
              ? {
                  constitutionDeed:
                    financialAssetInfoRaw['finanziamento-specifico-affare']?.[
                      'costituzione'
                    ] ?? null,
                  modification: financialAssetInfoRaw[
                    'finanziamento-specifico-affare'
                  ]?.modifica
                    ? {
                        text:
                          this.getXmlText(
                            financialAssetInfoRaw[
                              'finanziamento-specifico-affare'
                            ]?.modifica,
                          ) ?? null,
                        modificationIndex:
                          financialAssetInfoRaw[
                            'finanziamento-specifico-affare'
                          ]?.modifica?.['p-modifica'] ?? null,
                        typeCode:
                          financialAssetInfoRaw[
                            'finanziamento-specifico-affare'
                          ]?.modifica?.['c-tipo'] ?? null,
                        type:
                          financialAssetInfoRaw[
                            'finanziamento-specifico-affare'
                          ]?.modifica?.tipo ?? null,
                        effectDate:
                          financialAssetInfoRaw[
                            'finanziamento-specifico-affare'
                          ]?.modifica?.['dt-effetto'] ?? null,
                        modificationCode:
                          financialAssetInfoRaw[
                            'finanziamento-specifico-affare'
                          ]?.modifica?.['c-modifica'] ?? null,
                        modificationCodeDescription:
                          financialAssetInfoRaw[
                            'finanziamento-specifico-affare'
                          ]?.modifica?.['descrizione-c-modifica'] ?? null,
                      }
                    : null,
                  cessationDeed:
                    financialAssetInfoRaw['finanziamento-specifico-affare']?.[
                      'cessazione'
                    ] ?? null,
                }
              : null,
            balanceSheetData: financialAssetInfoRaw['dati-bilanci']
              ? {
                  entries: this.toArray(
                    financialAssetInfoRaw['dati-bilanci']?.['dati-bilancio'],
                  ).map((entry) => ({
                    year: entry.anno ?? null,
                    profitOrLoss: entry['utile-perdite'] ?? null,
                    revenues: entry.ricavi ?? null,
                    productionValue: entry['valore-produzione'] ?? null,
                  })),
                }
              : null,
            hasInfoFlag:
              this.toYesNoFlag(financialAssetInfoRaw['f-presenza-info']) ??
              null,
          }
        : null,
      shareholdersAgreements: shareholdersAgreementsRaw
        ? {
            votingRights:
              shareholdersAgreementsRaw['esercizio-diritto-voto'] ?? null,
            shareTransfer:
              shareholdersAgreementsRaw['trasferimento-azioni-partecip'] ??
              null,
            dominantInfluence:
              shareholdersAgreementsRaw['esercizio-influenza-dominante'] ??
              null,
            other: shareholdersAgreementsRaw.altro ?? null,
          }
        : null,
      insolvencyProcedures: insolvencyProceduresRaw
        ? {
            procedures: this.toArray(
              insolvencyProceduresRaw['procedura-concorsuale'],
            ).map((procedure) => ({
              deedDetails: mapDeedDetails(procedure['estremi-atto']),
              declarations: mapDeclarations(procedure.dichiarazioni),
              receiverCommunications: procedure['comunicazioni-curatore']
                ? {
                    communications: this.toArray(
                      procedure['comunicazioni-curatore']?.[
                        'comunicazione-curatore'
                      ],
                    ).map((communication) => ({
                      hearingDetails: communication['estremi-udienza']
                        ? {
                            hearingDate:
                              communication['estremi-udienza']?.[
                                'dt-udienza'
                              ] ?? null,
                            deadlineDate:
                              communication['estremi-udienza']?.[
                                'dt-termine'
                              ] ?? null,
                            location:
                              communication['estremi-udienza']?.luogo ?? null,
                          }
                        : null,
                      court: communication.tribunale ?? null,
                      orderNumber: this.toNumber(
                        communication['n-provvedimento'],
                      ),
                      orderDate: communication['dt-provvedimento'] ?? null,
                      judgeName: communication['nome-giudice'] ?? null,
                      judgeSurname: communication['cognome-giudice'] ?? null,
                    })),
                  }
                : null,
              classCode: procedure.cl ?? null,
              typeCode: procedure['c-tipo'] ?? null,
              type: procedure.tipo ?? null,
              procedureEnrollmentDate:
                procedure['dt-iscrizione-procedura'] ?? null,
              orderDate: procedure['dt-provvedimento'] ?? null,
              deedDate: procedure['dt-atto'] ?? null,
              deadlineDate: procedure['dt-termine'] ?? null,
              homologationDate: procedure['dt-omologazione'] ?? null,
              closureDate: procedure['dt-chiusura'] ?? null,
              executionDate: procedure['dt-esecuzione'] ?? null,
              revocationDate: procedure['dt-revoca'] ?? null,
              hearingDate: procedure['dt-udienza'] ?? null,
            })),
            flagInfo:
              this.toYesNoFlag(insolvencyProceduresRaw['f-presenza-info']) ??
              null,
          }
        : null,
      legalFormChanges: legalFormChangesRaw
        ? {
            changes: this.toArray(
              legalFormChangesRaw['variazione-forma-giuridica'],
            ).map((change) => ({
              deedDetails: mapDeedDetails(change['estremi-atto']),
              changeIndex: change['p-variazione'] ?? null,
              oldCode: change['c-old'] ?? null,
              oldValue: change.old ?? null,
              newCode: change['c-new'] ?? null,
              newValue: change.new ?? null,
              deedDate: change['dt-atto'] ?? null,
            })),
          }
        : null,
      historicSupplementaryInfo: historicSupplementaryInfoRaw
        ? {
            memorandumDescription:
              historicSupplementaryInfoRaw['descrizioni-atto-costitutivo'] ??
              null,
            historicNews:
              historicSupplementaryInfoRaw['notizie-storiche'] ?? null,
          }
        : null,
      corporateRestructuring: {
        companyTransfers: mergersSplitsTransfersRaw?.['trasferimenti-azienda']
          ? {
              transfers: this.toArray(
                mergersSplitsTransfersRaw?.['trasferimenti-azienda']?.[
                  'trasferimento-azienda'
                ],
              ).map((transfer) => ({
                practiceDetails: mapPracticeDetails(
                  transfer['estremi-pratica'],
                ),
                deedInfo: transfer['informazioni-atto']
                  ? {
                      holders: transfer['informazioni-atto']?.titolari
                        ? {
                            holders: [],
                            notes: this.toArray(
                              transfer['informazioni-atto']?.titolari?.note,
                            ).map((item) => String(item)),
                          }
                        : null,
                      repertoryNumber: this.toNumber(
                        transfer['informazioni-atto']?.['n-repertorio'],
                      ),
                      notary: transfer['informazioni-atto']?.notaio ?? null,
                      purposeCode:
                        transfer['informazioni-atto']?.['c-oggetto'] ?? null,
                      purpose: transfer['informazioni-atto']?.oggetto ?? null,
                    }
                  : null,
                notes: this.toArray(transfer.note).map((note) => String(note)),
              })),
            }
          : null,
        mergersAndSplits: mergersSplitsTransfersRaw?.['fusioni-scissioni']
          ? {
              entries: this.toArray(
                mergersSplitsTransfersRaw?.['fusioni-scissioni']?.[
                  'fusione-scissione'
                ],
              ).map((entry) => ({
                events: entry.eventi
                  ? {
                      events: this.toArray(entry.eventi?.evento).map(
                        (event) => ({
                          companyIndex: event['p-societa'] ?? null,
                          name: event.denominazione ?? null,
                          taxCode: event['c-fiscale'] ?? null,
                          city: event.comune ?? null,
                          chamberCode: event.cciaa ?? null,
                          reaNumber: this.toNumber(event['n-rea']),
                          rdNumber: this.toNumber(event['n-rd']),
                          rsNumber: this.toNumber(event['n-rs']),
                          courtCode: event['c-tribunale'] ?? null,
                          court: event.tribunale ?? null,
                          province: event.provincia ?? null,
                          riNumber: this.toNumber(event['n-ri']),
                          euidCode: event['c-euid'] ?? null,
                        }),
                      ),
                    }
                  : null,
                declarations: mapDeclarations(entry.dichiarazioni),
                mergerIndex: entry['p-fusione'] ?? null,
                typeCode: entry['c-tipo'] ?? null,
                type: entry.tipo ?? null,
                approvalCode: entry['c-approvazione'] ?? null,
                approval: entry.approvazione ?? null,
                eventCode: entry['c-evento'] ?? null,
                event: entry.evento ?? null,
                enrollmentDate: entry['dt-iscrizione'] ?? null,
                modificationDate: entry['dt-modifica'] ?? null,
                deedDate: entry['dt-atto'] ?? null,
                resolutionDate: entry['dt-delibera'] ?? null,
                revocationDeedDate: entry['dt-atto-revoca'] ?? null,
                executionDeedDate: entry['dt-atto-esecuzione'] ?? null,
              })),
            }
          : null,
        declarations: mapDeclarations(mergersSplitsTransfersRaw?.dichiarazioni),
        businessSuccessions: {
          predecessor: mergersSplitsTransfersRaw?.['subentri-impresa']?.[
            'impresa-subentrata'
          ]
            ? {
                name:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.denominazione ?? null,
                taxCode:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.['c-fiscale'] ?? null,
                chamberCode:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.cciaa ?? null,
                reaNumber: this.toNumber(
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.['n-rea'],
                ),
                rdNumber: this.toNumber(
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.['n-rd'],
                ),
                riNumber: this.toNumber(
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.['n-ri'],
                ),
                successionTitleCode:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.['c-titolo-subentro'] ?? null,
                successionTitle:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrata'
                  ]?.['titolo-subentro'] ?? null,
              }
            : null,
          successions: this.toArray(
            mergersSplitsTransfersRaw?.['subentri-impresa']?.subentri?.subentro,
          ).map((item) => ({
            typeCode: item['c-tipo'] ?? null,
            type: item.tipo ?? null,
            name: item.denominazione ?? null,
            taxCode: item['c-fiscale'] ?? null,
            chamberCode: item.cciaa ?? null,
            reaNumber: this.toNumber(item['n-rea']),
            riNumber: this.toNumber(item['n-ri']),
            titleCode: item['c-titolo'] ?? null,
            title: item.titolo ?? null,
          })),
          successor: mergersSplitsTransfersRaw?.['subentri-impresa']?.[
            'impresa-subentrante'
          ]
            ? {
                name:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.denominazione ?? null,
                taxCode:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.['c-fiscale'] ?? null,
                chamberCode:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.cciaa ?? null,
                reaNumber: this.toNumber(
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.['n-rea'],
                ),
                rdNumber: this.toNumber(
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.['n-rd'],
                ),
                riNumber: this.toNumber(
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.['n-ri'],
                ),
                successionTitleCode:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.['c-titolo-subentro'] ?? null,
                successionTitle:
                  mergersSplitsTransfersRaw?.['subentri-impresa']?.[
                    'impresa-subentrante'
                  ]?.['titolo-subentro'] ?? null,
              }
            : null,
        },
        hasInfoFlag:
          this.toYesNoFlag(mergersSplitsTransfersRaw?.['f-presenza-info']) ??
          null,
      },
    };
  }
}
