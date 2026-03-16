import { AnagraficaImpresa, ParsedAIWSResponse } from 'src/types/aiws.types';
import { CompanySummary } from 'src/types/company.types';
import {
  AIWSError,
  AIWS_ERROR_CODE,
  AIWS_ERROR_MESSAGES,
  pushAIWSError,
} from 'src/types/aiwsError.type';
import { CompanyAdministrativeDataSummary } from 'src/types/administrativeDataCompany.types';

export class CompanyManager {
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

  public async mapRegistroImpresaToCompanyAdministrativeSummary(
    raw: ParsedAIWSResponse,
  ): Promise<CompanyAdministrativeDataSummary> {
    const data = raw.Risposta.dati;

    return {
      identification: {
        activityStatus: {
          text: data['blocchi-impresa']['dati-identificativi'][
            'stato-attivita'
          ]['#text'],
          code: data['blocchi-impresa']['dati-identificativi']['stato-attivita']
            .c,
        },
        legalForm: {
          text: data['blocchi-impresa']['dati-identificativi'][
            'forma-giuridica'
          ]['#text'],
          code: data['blocchi-impresa']['dati-identificativi'][
            'forma-giuridica'
          ].c,
        },
        locationAddress: {
          street:
            data['blocchi-impresa']['dati-identificativi'][
              'indirizzo-localizzazione'
            ].via,
          streetNumber:
            data['blocchi-impresa']['dati-identificativi'][
              'indirizzo-localizzazione'
            ]['n-civico'],
          city: data['blocchi-impresa']['dati-identificativi'][
            'indirizzo-localizzazione'
          ].comune,
          province:
            data['blocchi-impresa']['dati-identificativi'][
              'indirizzo-localizzazione'
            ].provincia,
          postalCode:
            data['blocchi-impresa']['dati-identificativi'][
              'indirizzo-localizzazione'
            ].cap,
          topographyCode:
            data['blocchi-impresa']['dati-identificativi'][
              'indirizzo-localizzazione'
            ]['c-toponimo'],
          topographyName:
            data['blocchi-impresa']['dati-identificativi'][
              'indirizzo-localizzazione'
            ].toponimo,
        },
        certifiedEmail:
          data['blocchi-impresa']['dati-identificativi'][
            'indirizzo-posta-certificata'
          ],
        representatives: {
          representative:
            data['blocchi-impresa']['dati-identificativi'][
              'persone-rappresentanti'
            ]['persona-rappresentante'],
        },
        isInterchamberOffice:
          data['blocchi-impresa']['dati-identificativi'][
            'f-sede-intercamerale'
          ],
        sourceCode: data['blocchi-impresa']['dati-identificativi']['c-fonte'],
        sourceName: data['blocchi-impresa']['dati-identificativi'].fonte,
        subjectType:
          data['blocchi-impresa']['dati-identificativi']['tipo-soggetto'],
        subjectTypeDescription:
          data['blocchi-impresa']['dati-identificativi'][
            'descrizione-tipo-soggetto'
          ],
        companyType:
          data['blocchi-impresa']['dati-identificativi']['tipo-impresa'],
        companyTypeDescription:
          data['blocchi-impresa']['dati-identificativi'][
            'descrizione-tipo-impresa'
          ],
        registrationDate:
          data['blocchi-impresa']['dati-identificativi']['dt-iscrizione-ri'],
        constitutionDate:
          data['blocchi-impresa']['dati-identificativi'][
            'dt-atto-costituzione'
          ],
        lastProtocolDate:
          data['blocchi-impresa']['dati-identificativi'][
            'dt-ultimo-protocollo'
          ],
        lastProtocolProcessedDate:
          data['blocchi-impresa']['dati-identificativi'][
            'dt-mod-ultimo-protocollo-evaso'
          ],
        companyName:
          data['blocchi-impresa']['dati-identificativi'].denominazione,
        taxCode: data['blocchi-impresa']['dati-identificativi']['c-fiscale'],
        vatNumber:
          data['blocchi-impresa']['dati-identificativi']['partita-iva'],
        chamberCode:
          data['blocchi-impresa']['dati-identificativi']['c-cciaa-competente'],
        chamberName:
          data['blocchi-impresa']['dati-identificativi']['cciaa-competente'],
        chamberAbbreviation:
          data['blocchi-impresa']['dati-identificativi'].cciaa,
        reaNumber: data['blocchi-impresa']['dati-identificativi']['n-rea'],
      },
      activitySummary: {
        mainActivityDescription:
          data['blocchi-impresa']['sintesi-attivita']['attivita-prevalente-r'],
        atecoClassification: {
          activityCode: data['blocchi-impresa']['sintesi-attivita'][
            'classificazione-ateco'
          ]
            ? data['blocchi-impresa']['sintesi-attivita'][
                'classificazione-ateco'
              ]['c-attivita']
            : '',
          naceCode: data['blocchi-impresa']['sintesi-attivita'][
            'classificazione-ateco'
          ]
            ? data['blocchi-impresa']['sintesi-attivita'][
                'classificazione-ateco'
              ]['c-nace']
            : '',
        },
        startDate: data['blocchi-impresa']['sintesi-attivita']['dt-inizio'],
      },
      officePersons: {
        person: data['blocchi-impresa']['persone-sede']['persona'],
      },
      administrationControl:
        data['blocchi-impresa']['amministrazione-controllo'],
    };
  }
}
