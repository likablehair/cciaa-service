import { parseUnknownDate } from 'src/helpers/date.helper';
import { PartecipazioniData } from 'src/types/aiws.types';
import { AIWSError } from 'src/types/aiwsError.type';
import { CorporateHoldingStructure } from 'src/types/ownershipStructure.types';

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
    const anagraficaTitolare =
      blocchiPersona['partecipazioni-societa']?.['anagrafica-titolare'];

    const representatives = toArray(
      datiIdentificativi['persone-rappresentanti']?.['persona-rappresentante'],
    ).map((representative) => ({
      firstName: representative.nome || null,
      lastName: representative.cognome || null,
      roleDescription: representative.carica || null,
      isRegistryRepresentative: representative['f-rappresentante-ri'] === 'S',
    }));

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
          currencyCode: riquadro['composizione-quote']?.['c-valuta'] || null,
          currencyDescription:
            riquadro['composizione-quote']?.valuta || null,
          rights: toArray(
            riquadro['diritti-partecipazione']?.['diritto-partecipazione'],
          ).map((right) => ({
            rightTypeCode: right['c-tipo'] || null,
            rightTypeDescription: right.tipo || null,
          })),
        }),
      );

      return {
        isCurrentSection: participation['f-paragrafo-attuale'] === 'S',
        practice: {
          practiceCode: practice?.['c-pratica'] || null,
          filingTypeCode: practice?.['c-tipo-adempimento'] || null,
          filingTypeDescription: practice?.['tipo-adempimento'] || null,
          deedDate: parseUnknownDate(practice?.['dt-atto']),
          cciaaCode: practice?.cciaa || null,
          filingYear: practice?.anno || null,
          filingNumber: practice?.n || null,
          protocolDate: parseUnknownDate(practice?.['dt-protocollo']),
          depositDate: parseUnknownDate(practice?.['dt-deposito']),
        },
        isLatestShareholdersList:
          participation['f-ultimo-elenco-soci'] === 'S',
        targetCompany: {
          fiscalCode: targetCompany?.['c-fiscale'] || null,
          companyName: targetCompany?.denominazione || null,
          legalFormCode: targetCompany?.['forma-giuridica']?.c || null,
          legalFormDescription:
            targetCompany?.['forma-giuridica']?.['#text'] || null,
        },
        shareCapital: {
          currencyCode: shareCapital?.['c-valuta'] || null,
          currencyDescription: shareCapital?.valuta || null,
          amount: parseLocaleNumber(shareCapital?.ammontare),
        },
        shareDetails,
      };
    });

    const currentParticipatedCompanies = toArray(
      blocchiPersona['tabella-partecipate-impresa'],
    ).flatMap((table) =>
      toArray(table.partecipata).map((company) => ({
        fiscalCode: company['c-fiscale'] || null,
        companyName: company.denominazione || null,
        participationStartDate: parseUnknownDate(
          company['dt-inizio-partecipazione'],
        ),
        rights: toArray(
          company['quote-diritti-impresa']?.['quota-diritto-impresa'],
        ).map((right) => ({
          rightTypeCode: right['c-tipo-diritto'] || null,
          rightTypeDescription: right['tipo-diritto'] || null,
          nominalValue: parseLocaleNumber(right['valore-nominale']),
          capitalPercentage: parseLocaleNumber(right['percentuale-capitale']),
        })),
      })),
    );

    return {
      companyIdentity: {
          sourceCode: datiIdentificativi['c-fonte'] || null,
          sourceDescription: datiIdentificativi.fonte || null,
          subjectTypeCode: datiIdentificativi['tipo-soggetto'] || null,
          subjectTypeDescription:
            datiIdentificativi['descrizione-tipo-soggetto'] || null,
          companyTypeCode: datiIdentificativi['tipo-impresa'] || null,
          companyTypeDescription:
            datiIdentificativi['descrizione-tipo-impresa'] || null,
          registrationDate: parseUnknownDate(
            datiIdentificativi['dt-iscrizione-ri'],
          ),
          incorporationDate: parseUnknownDate(
            datiIdentificativi['dt-atto-costituzione'],
          ),
          lastFilingDate: parseUnknownDate(
            datiIdentificativi['dt-ultimo-protocollo'],
          ),
          companyName: datiIdentificativi.denominazione || null,
          fiscalCode: datiIdentificativi['c-fiscale'] || null,
          vatNumber: datiIdentificativi['partita-iva'] || null,
          cciaaCode: datiIdentificativi.cciaa || null,
          reaNumber: datiIdentificativi['n-rea'] || null,
          legalFormCode: datiIdentificativi['forma-giuridica']?.c || null,
          legalFormDescription:
            datiIdentificativi['forma-giuridica']?.['#text'] || null,
          locationAddress: datiIdentificativi['indirizzo-localizzazione']
            ? {
                municipalityCode:
                  datiIdentificativi['indirizzo-localizzazione']['c-comune'] ||
                  null,
                municipality:
                  datiIdentificativi['indirizzo-localizzazione'].comune || null,
                province:
                  datiIdentificativi['indirizzo-localizzazione'].provincia ||
                  null,
                toponymCode:
                  datiIdentificativi['indirizzo-localizzazione']['c-toponimo'] ||
                  null,
                toponym:
                  datiIdentificativi['indirizzo-localizzazione'].toponimo ||
                  null,
                street:
                  datiIdentificativi['indirizzo-localizzazione'].via || null,
                streetNumber:
                  datiIdentificativi['indirizzo-localizzazione']['n-civico'] ||
                  null,
                postalCode:
                  datiIdentificativi['indirizzo-localizzazione'].cap || null,
              }
            : null,
          pec: datiIdentificativi['indirizzo-posta-certificata'] || null,
          representatives,
        },
        holderIdentity: {
          holderTypeCode: anagraficaTitolare?.['c-tipo'] || null,
          holderTypeDescription: anagraficaTitolare?.tipo || null,
          fiscalCode: anagraficaTitolare?.['c-fiscale'] || null,
          companyName: anagraficaTitolare?.denominazione || null,
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