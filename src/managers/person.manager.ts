import { PersonaData } from 'src/types/aiws.types';
import { AIWSError } from 'src/types/aiwsError.type';
import { PersonCorporateRole, PersonSummary } from 'src/types/person.type';
import { CompanySummary } from 'src/types/company.types';
import { parseUnknownDate } from 'src/helpers/date.helper';

export class PersonManager {
  public async mapPersonaDataToCorporateRoles(params: {
    personaData: PersonaData;
    errors: AIWSError;
  }): Promise<PersonCorporateRole[]> {
    const { personaData, errors } = params;
    if (!personaData) {
      return [];
    }

    const impresePersona = personaData['blocchi-persona']['imprese-persona'];
    if (!impresePersona || !impresePersona['impresa-persona']) {
      return [];
    }

    const imprese = Array.isArray(impresePersona['impresa-persona'])
      ? impresePersona['impresa-persona']
      : [impresePersona['impresa-persona']];

    const corporateRoles: PersonCorporateRole[] = [];

    const bloccoPersona = personaData['blocchi-persona'];

    const personSummary: PersonSummary = {
      firstname: bloccoPersona['dati-identificativi-persona']?.['nome'] || null,
      lastname:
        bloccoPersona['dati-identificativi-persona']?.['cognome'] || null,
      gender: bloccoPersona['dati-identificativi-persona']?.['sesso'] || null,
      fiscalCode:
        bloccoPersona['dati-identificativi-persona']?.['c-fiscale'] || null,
      dateOfBirth: parseUnknownDate(
        bloccoPersona['dati-identificativi-persona']?.['estremi-nascita']?.dt,
      ),
      municipality:
        bloccoPersona['dati-identificativi-persona']?.['estremi-nascita']
          ?.comune || null,
      province:
        bloccoPersona['dati-identificativi-persona']?.['estremi-nascita']
          ?.provincia || null,
      address: bloccoPersona['dati-identificativi-persona']?.indirizzo
        ? `${bloccoPersona['dati-identificativi-persona'].indirizzo.via} ${bloccoPersona['dati-identificativi-persona'].indirizzo['n-civico']}`
        : null,
      cap: bloccoPersona['dati-identificativi-persona']?.indirizzo?.cap || null,
      pec: null,
      aiwsError: errors,
    };

    for (const impresa of imprese) {
      const cariche = impresa.persona?.cariche?.carica;
      if (!cariche) continue;

      const caricheArray = Array.isArray(cariche) ? cariche : [cariche];

      for (const carica of caricheArray) {
        const companySummary: CompanySummary = {
          companyName: impresa['dati-identificativi-impresa']['denominazione'],
          companyFiscalCode:
            impresa['dati-identificativi-impresa']['c-fiscale'],
          companyVatNumber: impresa['dati-identificativi-impresa']['c-fiscale'],
          companyLegalFormCode:
            impresa['dati-identificativi-impresa']['forma-giuridica']?.c || '',
          companyLegalFormDescription:
            impresa['dati-identificativi-impresa']['forma-giuridica']?.[
              '#text'
            ] || '',
          companyCciaaCode: impresa['dati-identificativi-impresa']['cciaa'],
          companyCciaaDescription: '', // Non disponibile in AnagraficaImpresa
          companyReaNumber:
            parseInt(impresa['dati-identificativi-impresa']['n-rea'], 10) || 0,
          companyStatusCode: '', // Non disponibile in AnagraficaImpresa
          companyStatusDescription: '', // Non disponibile in AnagraficaImpresa
          companyRegistryStatusCode: '', // Non disponibile in AnagraficaImpresa
          companyRegistryStatusDescription: '', // Non disponibile in AnagraficaImpresa
          companySourceCode:
            impresa['dati-identificativi-impresa']['c-fonte'] || '',
          companySourceDescription:
            impresa['dati-identificativi-impresa']['fonte'] || '',
          companyDeclaredActivity: impresa['info-attivita']?.[
            'classificazioni-ateco'
          ]?.['classificazione-ateco']
            ? Array.isArray(
                impresa['info-attivita']?.['classificazioni-ateco']?.[
                  'classificazione-ateco'
                ],
              )
              ? impresa['info-attivita']?.['classificazioni-ateco']?.[
                  'classificazione-ateco'
                ][0]?.attivita
              : impresa['info-attivita']?.['classificazioni-ateco']?.[
                  'classificazione-ateco'
                ]?.attivita
            : '',
          companyAtecoCode:
            impresa['info-attivita']?.['classificazioni-ateco']?.[
              'c-codifica'
            ] || '',
          companyAtecoDescription:
            impresa['info-attivita']?.['classificazioni-ateco']?.codifica || '',
          companyAtecoClassificationCode:
            parseInt(
              impresa['info-attivita']?.['classificazioni-ateco']?.[
                'c-codifica'
              ] || '0',
              10,
            ) || 0,
          companyAtecoClassificationDescription:
            impresa['info-attivita']?.['classificazioni-ateco']?.codifica || '',
          companyProvinceCode:
            impresa['dati-identificativi-impresa']['indirizzo-localizzazione']
              ?.provincia || '',
          companyProvinceDescription: '', // Non disponibile in AnagraficaImpresa
          companyMunicipalityCode:
            impresa['dati-identificativi-impresa'][
              'indirizzo-localizzazione'
            ]?.['c-comune'] || '',
          companyMunicipalityDescription: '', // Non disponibile in AnagraficaImpresa
          companyToponymCode:
            impresa['dati-identificativi-impresa'][
              'indirizzo-localizzazione'
            ]?.['c-toponimo'] || '',
          companyToponymDescription: '', // Non disponibile in AnagraficaImpresa
          companyStreet:
            impresa['dati-identificativi-impresa'][
              'indirizzo-localizzazione'
            ]?.['via'] || '',
          companyStreetNumber:
            impresa['dati-identificativi-impresa'][
              'indirizzo-localizzazione'
            ]?.['n-civico'] || '',
          companyPostalCode:
            parseInt(
              impresa['dati-identificativi-impresa'][
                'indirizzo-localizzazione'
              ]?.['cap'] || '0',
              10,
            ) || 0,
          companyPec:
            impresa['dati-identificativi-impresa'][
              'indirizzo-posta-certificata'
            ] || '',
          companyProfit: null, // Non disponibile in AnagraficaImpresa
          companyRevenue: null, // Non disponibile in AnagraficaImpresa
          companyShares: null, // Non disponibile in AnagraficaImpresa
          companyIncorporationDate: parseUnknownDate(
            impresa['info-attivita']?.['dt-inizio-attivita-impresa'],
          ),
          aiwsError: null,
        };

        personSummary.pec =
          impresa.persona?.['indirizzo-posta-certificata'] || personSummary.pec;

        corporateRoles.push({
          companySummary: companySummary,
          corporateRole: carica['#text'] || '',
          corporateRoleCode: carica['c-carica'] || '',
          personSummary: personSummary,
          dateOfAppointment: parseUnknownDate(carica['dt-atto-nomina']),
          durationCode: carica['c-durata'] || null,
          durationDescription: carica['descrizione-durata'] || null,
          balanceSheetDate: parseUnknownDate(carica['dt-riferimento-bilancio']),
          aiwsError: null,
        });
      }
    }

    return corporateRoles;
  }
}
