import { parseUnknownDate } from 'src/helpers/date.helper';
import { PartecipazioniData } from 'src/types/aiws.types';
import { AIWS_ERROR_CODE, AIWSError } from 'src/types/aiws-error.type';
import {
  CorporateHoldingStructure,
  OwnershipCompanyOrPersonIdentity,
} from 'src/types/companies-register/ownership-structure.types';

export class OwnershipStructureManager {
  public async mapPartecipazioniDataToCorporateHoldingStructure(params: {
    partecipazioniData: PartecipazioniData;
    errors: AIWSError;
  }): Promise<CorporateHoldingStructure | null> {
    const { partecipazioniData, errors } = params;
    if (!partecipazioniData) {
      return null;
    }

    const toArray = <T>(value?: T | T[] | null): T[] => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };

    const parseLocaleNumber = (value?: string | null): number | null => {
      if (!value) return null;
      const normalized = value.trim().replace(/\./g, '').replace(',', '.');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const blocchiPersona = partecipazioniData['blocchi-persona'];
    const datiIdentificativi = blocchiPersona['dati-identificativi'];
    const anagraficaPersona =
      blocchiPersona['anagrafica-persona']?.['dati-identificativi-persona'];
    const anagraficaTitolare =
      blocchiPersona['partecipazioni-societa']?.['anagrafica-titolare'];

    if (!datiIdentificativi && !anagraficaPersona) {
      errors.push({
        code: AIWS_ERROR_CODE.PERSONA_DATA_NOT_FOUND,
        message:
          'Dati identificativi and anagrafica persona are missing in the response',
      });
      return null;
    }

    const representatives = toArray(
      datiIdentificativi?.['persone-rappresentanti']?.[
        'persona-rappresentante'
      ],
    ).map((representative) => ({
      firstName: representative.nome,
      lastName: representative.cognome,
      roleDescription: representative.carica,
      isRegistryRepresentative: representative['f-rappresentante-ri'] === 'S',
    }));

    const personType = datiIdentificativi ? 'company' : 'person';

    let companyOrPersonIdentity: OwnershipCompanyOrPersonIdentity;
    if (personType === 'company' && datiIdentificativi) {
      companyOrPersonIdentity = {
        type: 'company',
        companyIdentity: {
          sourceCode: datiIdentificativi['c-fonte'],
          sourceDescription: datiIdentificativi.fonte,
          subjectTypeCode: datiIdentificativi['tipo-soggetto'],
          subjectTypeDescription:
            datiIdentificativi['descrizione-tipo-soggetto'],
          companyTypeCode: datiIdentificativi['tipo-impresa'],
          companyTypeDescription:
            datiIdentificativi['descrizione-tipo-impresa'],
          registrationDate: parseUnknownDate(
            datiIdentificativi['dt-iscrizione-ri'],
          ),
          incorporationDate: parseUnknownDate(
            datiIdentificativi['dt-atto-costituzione'],
          ),
          lastFilingDate: parseUnknownDate(
            datiIdentificativi['dt-ultimo-protocollo'],
          ),
          companyName: datiIdentificativi.denominazione,
          fiscalCode: datiIdentificativi['c-fiscale'],
          vatNumber: datiIdentificativi['partita-iva'],
          cciaaCode: datiIdentificativi.cciaa,
          reaNumber: datiIdentificativi['n-rea'],
          legalFormCode: datiIdentificativi['forma-giuridica']?.c,
          legalFormDescription:
            datiIdentificativi['forma-giuridica']?.['#text'] || null,
          locationAddress: {
            municipalityCode:
              datiIdentificativi['indirizzo-localizzazione']['c-comune'] ||
              null,
            municipality: datiIdentificativi['indirizzo-localizzazione'].comune,
            province: datiIdentificativi['indirizzo-localizzazione'].provincia,
            toponymCode:
              datiIdentificativi['indirizzo-localizzazione']['c-toponimo'] ||
              null,
            toponym: datiIdentificativi['indirizzo-localizzazione'].toponimo,
            street: datiIdentificativi['indirizzo-localizzazione'].via,
            streetNumber:
              datiIdentificativi['indirizzo-localizzazione']['n-civico'],
            postalCode: datiIdentificativi['indirizzo-localizzazione'].cap,
          },
          pec: datiIdentificativi['indirizzo-posta-certificata'] || null,
          representatives,
        },
      };
    } else {
      companyOrPersonIdentity = {
        type: 'person',
        personIdentity: {
          firstName: anagraficaPersona?.nome || '',
          lastName: anagraficaPersona?.cognome || '',
          fiscalCode: anagraficaPersona?.['c-fiscale'] || '',
          gender: anagraficaPersona?.sesso || null,
          locationAddress: {
            municipalityCode:
              anagraficaPersona?.indirizzo?.['c-comune'] || null,
            municipality: anagraficaPersona?.indirizzo?.comune || '',
            province: anagraficaPersona?.indirizzo?.provincia || '',
            toponymCode: anagraficaPersona?.indirizzo?.['c-toponimo'] || null,
            toponym: anagraficaPersona?.indirizzo?.toponimo || '',
            street: anagraficaPersona?.indirizzo?.via || '',
            streetNumber: anagraficaPersona?.indirizzo?.['n-civico'] || '',
            postalCode: anagraficaPersona?.indirizzo?.cap || '',
          },
          dateOfBirth: anagraficaPersona?.['estremi-nascita']?.dt
            ? parseUnknownDate(anagraficaPersona['estremi-nascita'].dt)
            : null,
          municipalityOfBirth:
            anagraficaPersona?.['estremi-nascita']?.comune || '',
          provinceOfBirth:
            anagraficaPersona?.['estremi-nascita']?.provincia || '',
        },
      };
    }

    const participations = toArray(
      blocchiPersona['partecipazioni-societa']?.partecipazioni?.partecipazione,
    ).map((participation) => {
      const practice = participation['estremi-pratica'];
      const targetCompany = participation['estremi-impresa'];
      const shareCapital = participation['capitale-sociale'];

      const shareDetails = toArray(participation.riquadri?.riquadro).map(
        (riquadro) => ({
          nominalValue: parseLocaleNumber(
            riquadro['composizione-quote']?.['valore-nominale'],
          ),
          currencyCode: riquadro['composizione-quote']?.['c-valuta'],
          currencyDescription: riquadro['composizione-quote']?.valuta,
          rights: toArray(
            riquadro['diritti-partecipazione']?.['diritto-partecipazione'],
          ).map((right) => ({
            rightTypeCode: right['c-tipo'] ?? null,
            rightTypeDescription: right.tipo ?? null,
          })),
        }),
      );

      return {
        isCurrentSection: participation['f-paragrafo-attuale'] === 'S',
        practice: {
          practiceCode: practice?.['c-pratica'],
          filingTypeCode: practice?.['c-tipo-adempimento'],
          filingTypeDescription: practice?.['tipo-adempimento'],
          deedDate: parseUnknownDate(practice?.['dt-atto']),
          cciaaCode: practice?.cciaa,
          filingYear: practice?.anno,
          filingNumber: practice?.n,
          protocolDate: parseUnknownDate(practice?.['dt-protocollo']),
          depositDate: parseUnknownDate(practice?.['dt-deposito']),
        },
        isLatestShareholdersList: participation['f-ultimo-elenco-soci'] === 'S',
        targetCompany: {
          fiscalCode: targetCompany?.['c-fiscale'],
          companyName: targetCompany?.denominazione,
          legalFormCode: targetCompany?.['forma-giuridica']?.c,
          legalFormDescription:
            targetCompany?.['forma-giuridica']?.['#text'] || null,
        },
        shareCapital: {
          currencyCode: shareCapital?.['c-valuta'],
          currencyDescription: shareCapital?.valuta,
          amount: parseLocaleNumber(shareCapital?.ammontare),
        },
        shareDetails,
      };
    });

    const currentParticipatedCompanies = toArray(
      blocchiPersona['tabella-partecipate-impresa'],
    ).flatMap((table) =>
      toArray(table.partecipata).map((company) => ({
        fiscalCode: company['c-fiscale'],
        companyName: company.denominazione,
        participationStartDate: parseUnknownDate(
          company['dt-inizio-partecipazione'],
        ),
        rights: toArray(
          company['quote-diritti-impresa']?.['quota-diritto-impresa'],
        ).map((right) => ({
          rightTypeCode: right['c-tipo-diritto'],
          rightTypeDescription: right['tipo-diritto'],
          nominalValue: parseLocaleNumber(right['valore-nominale']),
          capitalPercentage: parseLocaleNumber(right['percentuale-capitale']),
        })),
      })),
    );

    return {
      companyOrPersonIdentity,
      holderIdentity: {
        holderTypeCode: anagraficaTitolare?.['c-tipo'] || 'PF',
        holderTypeDescription: anagraficaTitolare?.tipo || 'Persona fisica',
        fiscalCode:
          anagraficaTitolare?.['c-fiscale'] ||
          anagraficaPersona?.['c-fiscale'] ||
          '',
        companyName:
          anagraficaTitolare?.denominazione ||
          `${anagraficaPersona?.cognome || ''} ${anagraficaPersona?.nome || ''}`.trim(),
      },
      participations,
      currentParticipatedCompanies,
      totalCurrentParticipations:
        parseLocaleNumber(
          blocchiPersona['info-blocco-attuale']?.['n-partecipazioni'],
        ) ?? null,
      aiwsError: errors,
    };
  }
}
