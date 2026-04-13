import { parseUnknownDate } from 'src/helpers/date.helper';
import { VisuraEffettoResponse } from 'src/types/aiws.types';
import { AIWSError } from 'src/types/aiws-error.type';
import { ProtestReport } from 'src/types/protests-register/protest.type';

export class ProtestManager {
  public async mapVisuraEffettoResponseToProtestReport(params: {
    visuraEffettoResponse: VisuraEffettoResponse;
    fiscalCode: string;
    errors: AIWSError;
  }): Promise<ProtestReport | null> {
    const { visuraEffettoResponse, fiscalCode, errors } = params;
    if (!visuraEffettoResponse) {
      return null;
    }

    const toArray = <T>(value?: T | T[] | null): T[] => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };

    const anagrafica = visuraEffettoResponse.AnagraficaNominativo;
    const protestEntries = toArray(visuraEffettoResponse.RegistroProtesti).map(
      (protesto) => ({
        registerData: {
          cciaaPublication: protesto.DatiRegistroProtesti.CciaaPubblicazione,
          registrationRegisterDate: parseUnknownDate(
            protesto.DatiRegistroProtesti.DtIscrRegistro,
          ),
        },
        effectInformation: {
          protestDate: parseUnknownDate(protesto.InformazioniEffetto.DtLevata),
          protestProvinceCode: protesto.InformazioniEffetto.SglPrvLevata,
          protestProvinceDescription:
            protesto.InformazioniEffetto.DescPrvLevata,
          protestMunicipalityCode: protesto.InformazioniEffetto.CodComLevata,
          protestMunicipalityDescription:
            protesto.InformazioniEffetto.DescComLevata,
          billIssueDate: parseUnknownDate(
            protesto.InformazioniEffetto.DtEmissioneEffetto,
          ),
          billDueDate: parseUnknownDate(
            protesto.InformazioniEffetto.DtScadenzaEffetto,
          ),
          billTypeCode: protesto.InformazioniEffetto.CodTipoEffetto,
          billTypeDescription: protesto.InformazioniEffetto.DescTipoEffetto,
          protestAmount: protesto.InformazioniEffetto.ImportoValutaLevata,
          protestCurrencyCode: protesto.InformazioniEffetto.CodValutaLevata,
          protestCurrencyDescription:
            protesto.InformazioniEffetto.DescValutaLevata,
          nonPaymentReasonCode: protesto.InformazioniEffetto.CodMancatoPagRepr,
          nonPaymentReasonDescription:
            protesto.InformazioniEffetto.DescMancatoPagRepr,
          billStatusCode: protesto.InformazioniEffetto.CodStatoEffetto,
          billStatusDescription: protesto.InformazioniEffetto.DescStatoEffetto,
          repertoryNumber: protesto.InformazioniEffetto.NRepertorio,
        },
      }),
    );

    return {
      anagraphicKey: anagrafica.KAnagrafica,
      fiscalCode: fiscalCode || anagrafica.CodFisc,
      holderIdentity: {
        fullName: anagrafica.Nominativo,
        sourceCode: anagrafica.Fonte,
        fiscalCode: anagrafica.CodFisc,
        residenceProvinceCode: anagrafica.SglPrvRes,
        residenceProvinceDescription: anagrafica.DescPrvRes,
        residenceMunicipalityCode: anagrafica.CodComRes,
        residenceMunicipalityDescription: anagrafica.DescComRes,
        residenceAddress: anagrafica.IndirizzoRes,
      },
      protestEffects: protestEntries,
      totalProtests: protestEntries.length,
      aiwsError: errors,
    };
  }
}
