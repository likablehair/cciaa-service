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
  private toYesNoFlag(value: string | undefined): boolean | undefined {
    return value === 'S' ? true : value === 'N' ? false : undefined;
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
    return Array.isArray(value) ? value[0] ?? null : value;
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
    streetNumber: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
    topographyCode: string | null;
    topographyName: string | null;
  } | null {
    if (!address) return null;

    return {
      street: address.via ?? null,
      streetNumber: address['n-civico'] ?? null,
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
      datiIdentificativi?.['persone-rappresentanti']?.['persona-rappresentante'];

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
    const incorporationActRaw = blocchiImpresa['estremi-atto-costituzione'];
    const activityInfoRaw = blocchiImpresa['info-attivita'];
    const workforceHistoryRaw = blocchiImpresa['storia-addetti'];
    const licensesAndRegistersRaw = blocchiImpresa['albi-ruoli-licenze'];
    const officePeopleRaw = blocchiImpresa['persone-sede'];
    const shareholdersListRaw = blocchiImpresa['elenco-soci'];
    const shareholdersTableRaw = blocchiImpresa['tabella-elenco-soci'];
    const changesHistoryRaw = blocchiImpresa.mad;
    const filingsTranscriptionsRaw = blocchiImpresa.trascrizioni;
    const previousHeadquartersHistoryRaw = blocchiImpresa['storia-sedi-precedenti'];
    const registerEnrollmentRaw = blocchiImpresa['iscrizione-ri'];
    const bylawsInfoRaw = blocchiImpresa['info-statuto'];
    const governanceAndControlRaw = blocchiImpresa['amministrazione-controllo'];
    const financialAssetInfoRaw = blocchiImpresa['info-patrimoniali-finanziarie'];
    const insolvencyProceduresRaw = blocchiImpresa['procedure-concorsuali'];
    const mergersSplitsTransfersRaw = blocchiImpresa['ta-fusioni-scissioni-subentri'];

    const mapEmployee = (entry: {
      'c-tipo-informazione'?: string;
      'tipo-informazione'?: string;
      anno?: string;
      'dt-dichiarazione'?: string;
      'dt-rilevazione'?: string;
      'info-mesi'?: {
        'info-mese'?:
          | {
              'c-mese'?: string;
              'n-dipendenti'?: string;
              'n-indipendenti'?: string;
              'n-totale'?: string;
            }
          | Array<{
              'c-mese'?: string;
              'n-dipendenti'?: string;
              'n-indipendenti'?: string;
              'n-totale'?: string;
            }>;
      };
      'distribuzione-dipendenti'?: unknown;
    }) => ({
      informationTypeCode: entry['c-tipo-informazione'] ?? null,
      informationType: entry['tipo-informazione'] ?? null,
      year: entry.anno ?? null,
      declarationDate: entry['dt-dichiarazione'] ?? null,
      surveyDate: entry['dt-rilevazione'] ?? null,
      monthlyDetails: this.toArray(entry['info-mesi']?.['info-mese']).map(
        (month) => ({
          monthCode: month['c-mese'] ?? null,
          numEmployees: month['n-dipendenti'] ?? null,
          numSelfEmployed: month['n-indipendenti'] ?? null,
          total: month['n-totale'] ?? null,
        }),
      ),
      contractDistribution:
        entry['distribuzione-dipendenti'] ?? null,
      workingHoursDistribution: null,
      qualificationDistribution: null,
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
          streetNumber:
            datiIdentificativi?.['indirizzo-localizzazione']?.['n-civico'] ??
            null,
          city: datiIdentificativi?.['indirizzo-localizzazione']?.comune ?? null,
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
        certifiedEmail: datiIdentificativi?.['indirizzo-posta-certificata'] ?? null,
        representatives: {
          representative,
        },
        isInterchamberOffice:
          this.toYesNoFlag(datiIdentificativi?.['f-sede-intercamerale']) ?? null,
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
        chamberCode: datiIdentificativi?.['c-cciaa-competente'] ?? null,
        chamberName: datiIdentificativi?.['cciaa-competente'] ?? null,
        chamberAbbreviation: datiIdentificativi?.cciaa ?? null,
        reaNumber: datiIdentificativi?.['n-rea'] ?? null,
      },
      activitySummary: {
        mainActivityDescription: sintesiAttivita?.['attivita-prevalente-r'] ?? null,
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
        agriculturalActivityDescription: sintesiAttivita?.['attivita-agricola-r'] ?? null,
        environmentalRegistersFlag: this.toYesNoFlag(sintesiAttivita?.['f-albi-registri-ambientali']) ?? null,
        importExportFlag: this.toYesNoFlag(sintesiAttivita?.['f-import-export']) ?? null,
        networkContractFlag: this.toYesNoFlag(sintesiAttivita?.['f-contratto-rete']) ?? null,
        pursuedActivityDescription: sintesiAttivita?.['attivita-esercitata-r'] ?? null,
        qualityCertificationsFlag: this.toYesNoFlag(sintesiAttivita?.['f-certificazioni-qualita']) ?? null,
        ratingScore: sintesiAttivita?.['punteggio-rating-legalita'] ?? null,
        registersAndEnvironmentalRolesFlag: this.toYesNoFlag(sintesiAttivita?.['f-albi-ruoli-licenze']) ?? null,
        soaCertificationsFlag: this.toYesNoFlag(sintesiAttivita?.['f-certificazioni-qualita']) ?? null,
      },
      financialSummary: financialSummaryRaw
        ? {
            numLocalizations: financialSummaryRaw['n-localizzazioni'] ?? null,
            numAdministrators: financialSummaryRaw['n-amministratori'] ?? null,
            numAuditors: financialSummaryRaw['n-sindaci'] ?? null,
            numOfficeHolders: financialSummaryRaw['n-titolari-cariche'] ?? null,
            numShareholders: financialSummaryRaw['n-soci'] ?? null,
            employeesDate: financialSummaryRaw['dt-addetti'] ?? null,
            numEmployees: financialSummaryRaw['n-addetti'] ?? null,
            numHeadquartersTransfers:
              financialSummaryRaw['n-trasferimenti-sede'] ?? null,
            numShareTransfers:
              financialSummaryRaw['n-trasferimenti-quote'] ?? null,
            yearlyFilings: financialSummaryRaw['pratiche-anno']
              ? {
                  startDate:
                    financialSummaryRaw['pratiche-anno']?.['dt-inizio'] ?? null,
                  count: financialSummaryRaw['pratiche-anno']?.n ?? null,
                }
              : null,
            shareCapital: this.mapShareCapital(
              financialSummaryRaw['capitale-sociale'],
            ),
          }
        : null,
      headquartersInfo: headquartersInfoRaw
        ? {
            certifiedEmail: headquartersInfoRaw['indirizzo-posta-certificata'] ?? null,
            reaRegistration: headquartersInfoRaw['dati-iscrizione-rea-rd']
              ? {
                  reaNumber:
                    headquartersInfoRaw['dati-iscrizione-rea-rd']?.['n-rea'] ??
                    null,
                }
              : null,
            vatNumber: headquartersInfoRaw['partita-iva']?._text ?? null,
            transferOrigin: headquartersInfoRaw['provenienza-trasferimento']
              ? {
                  chamberCode:
                    headquartersInfoRaw['provenienza-trasferimento']?.cciaa ??
                    null,
                  reaNumber:
                    headquartersInfoRaw['provenienza-trasferimento']?.['n-rea'] ??
                    null,
                }
              : null,
          }
        : null,
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
            companyStartDate:
              activityInfoRaw['dt-inizio-attivita-impresa'] ?? null,
            primaryActivity: activityInfoRaw['attivita-esercitata'] ?? null,
            secondaryActivity:
              activityInfoRaw['attivita-secondaria-esercitata'] ?? null,
            atecoClassifications: this.toSingleOrNull(
              activityInfoRaw['classificazioni-ateco'],
            )
              ? {
                  codingCode:
                    this.toSingleOrNull(activityInfoRaw['classificazioni-ateco'])?.[
                      'c-codifica'
                    ] ?? null,
                  coding:
                    this.toSingleOrNull(activityInfoRaw['classificazioni-ateco'])
                      ?.codifica ?? null,
                  classifications: this.toArray(
                    this.toSingleOrNull(activityInfoRaw['classificazioni-ateco'])?.[
                      'classificazione-ateco'
                    ],
                  ).map((classification) => ({
                    activityCode: classification['c-attivita'] ?? null,
                    activity: classification.attivita ?? null,
                    relevanceCode: classification['c-importanza'] ?? null,
                    relevance: classification.importanza ?? null,
                    sourceCode: classification['c-fonte'] ?? null,
                    source: classification.fonte ?? null,
                  })),
                }
              : null,
            certifications: activityInfoRaw.certificazioni
              ? {
                  lastUpdateDate:
                    activityInfoRaw.certificazioni['dt-ultima-modifica'] ??
                    null,
                  certifications: this.toArray(
                    activityInfoRaw.certificazioni.certificazione,
                  ).map((item) => ({
                    accreditationSchemaCode:
                      item['c-schema-accreditamento'] ?? null,
                    accreditationSchema: item['schema-accreditamento'] ?? null,
                    referenceStandard: item['norma-riferimento'] ?? null,
                    certificateNumber: item['n-certificato'] ?? null,
                    issueDate: item['dt-emissione'] ?? null,
                    expiryDate: item['dt-scadenza'] ?? null,
                    certifierName: item['denominazione-odc'] ?? null,
                    certifierTaxCode: item['c-fiscale-odc'] ?? null,
                  })),
                }
              : null,
            companyEmployees: this.toArray(
              activityInfoRaw['addetti-impresa'],
            ).map(mapEmployee),
            employeesByMunicipality: this.toArray(
              activityInfoRaw['addetti-comuni'],
            )
              .flatMap((entry) => this.toArray(entry['addetti-comune']))
              .map((item) => ({
              municipalityCode: item['c-comune'] ?? null,
              municipality: item.comune ?? null,
              province: item.provincia ?? null,
              localUnits: this.toArray(
                item['pro-localizzazioni']?.['pro-localizzazione'],
              ).map((value) => String(value)),
              monthlyDetails: this.toArray(item['info-mesi']?.['info-mese']).map(
                (month) => ({
                  monthCode: month['c-mese'] ?? null,
                  numEmployees: month['n-dipendenti'] ?? null,
                  numSelfEmployed: month['n-indipendenti'] ?? null,
                  total: month['n-totale'] ?? null,
                }),
              ),
              averageValues: item['valori-medi']
                ? {
                    employees:
                      item['valori-medi']?.['valore-medio-dipendenti'] ?? null,
                    selfEmployed:
                      item['valori-medi']?.['valore-medio-indipendenti'] ??
                      null,
                    total: item['valori-medi']?.['valore-medio-totale'] ?? null,
                  }
                : null,
              })),
          }
        : null,
      workforceHistory: workforceHistoryRaw
        ? {
            entries: this.toArray(workforceHistoryRaw['addetti-impresa']).map(
              mapEmployee,
            ),
          }
        : null,
      licensesAndRegisters: licensesAndRegistersRaw
        ? {
            environmentalDeclarations: this.toArray(
              licensesAndRegistersRaw['dichiarazioni-ambientali']?.[
                'dichiarazione-ambientale'
              ],
            ).map((item) => ({
              typeCode: item['c-tipo'] ?? null,
              type: item.tipo ?? null,
              sourceCode: item['c-fonte'] ?? null,
              source: item.fonte ?? null,
              provinceSection: item['provincia-sezione'] ?? null,
              number: item.n ?? null,
              extraFields: Object.entries(item).reduce<Record<string, unknown>>(
                (acc, [key, value]) => {
                  if (
                    ![
                      'c-tipo',
                      'tipo',
                      'c-fonte',
                      'fonte',
                      'provincia-sezione',
                      'n',
                    ].includes(key)
                  ) {
                    acc[key] = value;
                  }
                  return acc;
                },
                {},
              ),
            })),
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
                        persona['persona-fisica']['estremi-nascita']?.dt ?? null,
                      city:
                        persona['persona-fisica']['estremi-nascita']?.comune ??
                        null,
                      province:
                        persona['persona-fisica']['estremi-nascita']?.provincia ??
                        null,
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
                registrationDate: null,
                appointmentDate: role['dt-atto-nomina'] ?? null,
                durationCode: role['c-durata'] ?? null,
                durationDescription: role['descrizione-durata'] ?? null,
                referenceBalanceDate: role['dt-riferimento-bilancio'] ?? null,
                presentationDate: null,
              })),
            },
          })),
        })),
      },
      shareholdersList: shareholdersListRaw
        ? {
            shareholdersReferenceDate:
              shareholdersListRaw['dt-soci-titolari-al'] ?? null,
            isLatestShareholdersList:
              shareholdersListRaw['f-ultimo-elenco-soci'] ?? null,
            practiceDetails: shareholdersListRaw['estremi-pratica']
              ? {
                  practiceCode:
                    shareholdersListRaw['estremi-pratica']?.['c-pratica'] ?? null,
                  filingTypeCode:
                    shareholdersListRaw['estremi-pratica']?.[
                      'c-tipo-adempimento'
                    ] ?? null,
                  filingType:
                    shareholdersListRaw['estremi-pratica']?.[
                      'tipo-adempimento'
                    ] ?? null,
                  deedDate:
                    shareholdersListRaw['estremi-pratica']?.['dt-atto'] ?? null,
                  chamberCode:
                    shareholdersListRaw['estremi-pratica']?.cciaa ?? null,
                  year: shareholdersListRaw['estremi-pratica']?.anno ?? null,
                  number: shareholdersListRaw['estremi-pratica']?.n ?? null,
                  protocolDate:
                    shareholdersListRaw['estremi-pratica']?.['dt-protocollo'] ??
                    null,
                  filingDate:
                    shareholdersListRaw['estremi-pratica']?.['dt-deposito'] ??
                    null,
                }
              : null,
            shareCapital: this.mapShareCapital(
              shareholdersListRaw['capitale-sociale'],
            ),
            frames: this.toArray(shareholdersListRaw.riquadri?.riquadro).map(
              (frame) => ({
                composition: frame['composizione-quote']
                  ? {
                      currencyCode:
                        frame['composizione-quote']['c-valuta'] ?? null,
                      currencyName: frame['composizione-quote'].valuta ?? null,
                      nominalValue:
                        frame['composizione-quote']['valore-nominale'] ?? null,
                      paidValue:
                        frame['composizione-quote']['valore-versato'] ?? null,
                    }
                  : null,
                holders: this.toArray(frame.titolari?.titolare).map((holder) => ({
                  isRepresentative: holder['f-rappresentante'] ?? null,
                  domicile: this.mapAddress(holder.domicilio),
                  holderIdentity: holder['anagrafica-titolare']
                    ? {
                        typeCode:
                          holder['anagrafica-titolare']?.['c-tipo'] ?? null,
                        type: holder['anagrafica-titolare']?.tipo ?? null,
                        taxCode:
                          holder['anagrafica-titolare']?.['c-fiscale'] ?? null,
                        name:
                          holder['anagrafica-titolare']?.denominazione ?? null,
                        lastName:
                          holder['anagrafica-titolare']?.cognome ?? null,
                        firstName:
                          holder['anagrafica-titolare']?.nome ?? null,
                      }
                    : null,
                  participationRight: holder['diritto-partecipazione']
                    ? {
                        rightTypeCode:
                          holder['diritto-partecipazione']?.['c-tipo'] ?? null,
                        rightType: holder['diritto-partecipazione']?.tipo ?? null,
                      }
                    : null,
                })),
              }),
            ),
            notes: this.toArray(shareholdersListRaw.note).join('\n') || null,
          }
        : null,
      shareholdersTable: {
        shareholders: this.toArray(shareholdersTableRaw?.soci?.socio),
      },
      changesHistory: {
        sessions: this.toArray(changesHistoryRaw?.['sessioni-rd-rea']?.['sessione-rd-rea']).map(
          (session) => ({
            movementCode: session['c-movimentazione'] ?? null,
            movement: session.movimentazione ?? null,
            filingDate: session['dt-denuncia'] ?? null,
            changes: this.toArray(session.modifiche?.modifica).map((change) => ({
              paragraphCode: change['p-modifica'] ?? null,
              effectiveDate: change['dt-effetto'] ?? null,
              typeCode: change['c-tipo'] ?? null,
              type: change.tipo ?? null,
              changeCode: change['c-modifica'] ?? null,
              changeCodeDescription:
                change['descrizione-c-modifica'] ?? null,
              text: this.getXmlText(change) ?? null,
            })),
          }),
        ),
      },
      filingsTranscriptions: {
        protocols: this.toArray(
          filingsTranscriptionsRaw?.['protocolli-ri']?.['protocollo-ri'],
        ).map((protocol) => ({
          protocolNumber: protocol['n-protocollo'] ?? null,
          officeProtocolNumber: protocol['n-protocollo-ufficio'] ?? null,
          year: protocol.anno ?? null,
          protocolDate: protocol['dt-protocollo'] ?? null,
          extraFields: Object.entries(protocol).reduce<Record<string, unknown>>(
            (acc, [key, value]) => {
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
            },
            {},
          ),
        })),
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
              changes: this.toArray(session.modifiche?.modifica).map((change) => ({
                paragraphCode: change['p-modifica'] ?? null,
                effectiveDate: change['dt-effetto'] ?? null,
                typeCode: change['c-tipo'] ?? null,
                type: change.tipo ?? null,
                changeCode: change['c-modifica'] ?? null,
                changeCodeDescription:
                  change['descrizione-c-modifica'] ?? null,
                text: this.getXmlText(change) ?? null,
              })),
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
              extraFields: Object.entries(protocol).reduce<Record<string, unknown>>(
                (acc, [key, value]) => {
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
                },
                {},
              ),
            })),
          },
        })),
      },
      registerEnrollment: registerEnrollmentRaw
        ? {
            enrollmentNumber: registerEnrollmentRaw['n-iscrizione-ri'] ?? null,
            provinceCode: registerEnrollmentRaw['provincia-ri'] ?? null,
            chamberName: registerEnrollmentRaw['cciaa-competente'] ?? null,
            enrollmentDate: registerEnrollmentRaw['dt-iscrizione'] ?? null,
            sections: this.toArray(registerEnrollmentRaw.sezioni?.sezione),
          }
        : null,
      bylawsInfo: bylawsInfoRaw
        ? {
            incorporationDate: bylawsInfoRaw['dt-atto-costituzione'] ?? null,
            companyEndDate:
              bylawsInfoRaw['durata-societa']?.['dt-termine'] ?? null,
            corporatePurpose: bylawsInfoRaw['oggetto-sociale'] ?? null,
            bylawsPowers: bylawsInfoRaw.poteri?.['poteri-statuto'] ?? null,
          }
        : null,
      governanceAndControl: governanceAndControlRaw
        ? {
            administrationSystem: governanceAndControlRaw['sistema-amministrazione']
              ? {
                  code:
                    governanceAndControlRaw['sistema-amministrazione']?.c ?? null,
                  text: this.getXmlText(
                    governanceAndControlRaw['sistema-amministrazione'],
                  ),
                }
              : null,
            administrativeForms: this.toArray(
              governanceAndControlRaw['forme-amministrative']?.[
                'forma-amministrativa'
              ],
            ),
            activeAdministrativeForms: this.toArray(
              governanceAndControlRaw['forme-amministrative-in-carica']?.[
                'forma-amministrativa-in-carica'
              ],
            ),
          }
        : null,
      financialAssetInfo: financialAssetInfoRaw
        ? {
            shareCapital: this.mapShareCapital(
              financialAssetInfoRaw['capitale-sociale'],
            ),
          }
        : null,
      insolvencyProcedures: insolvencyProceduresRaw
        ? {
            hasInfo: insolvencyProceduresRaw['f-presenza-info'] ?? null,
          }
        : null,
      mergersSplitsTransfers: {
        companySuccessions: this.toArray(
          mergersSplitsTransfersRaw?.['subentri-impresa']?.subentri?.subentro,
        ),
      },
    };
  }
}
