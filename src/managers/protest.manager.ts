import { parseUnknownDate } from "src/helpers/date.helper";
import { RegistroProtesti } from "src/types/aiws.types";
import { AIWSError } from "src/types/aiwsError.type";
import { ProtestData } from "src/types/protest.type";

export class ProtestManager {
  public async mapRegistroProtestiToProtestData(params: {
    kAnagrafica: string;
    fiscalCode: string;
    registroProtestiData: RegistroProtesti[];
    errors: AIWSError
  }): Promise<ProtestData[]> {
    const { registroProtestiData, errors, kAnagrafica, fiscalCode } = params;
    if (!registroProtestiData || registroProtestiData.length === 0) {
      return [];
    }

    const protestDataList: ProtestData[] = [];

    for (const protesto of registroProtestiData) {
      const DatiRegistroProtesti = protesto.DatiRegistroProtesti;
      const InformazioniEffetto = protesto.InformazioniEffetto;

      const protestData: ProtestData = {
        kAnagrafica,
        fiscalCode,
        protestRegisterData: {
          cciaaPublication: DatiRegistroProtesti.CciaaPubblicazione,
          registrationRegisterDate: parseUnknownDate(DatiRegistroProtesti.DtIscrRegistro)
        },
        protestInformation: {
          protestDate: parseUnknownDate(InformazioniEffetto.DtLevata),
          protestProvinceCode: InformazioniEffetto.SglPrvLevata,
          protestProvinceDescription: InformazioniEffetto.DescPrvLevata,
          protestMunicipalityCode: InformazioniEffetto.CodComLevata,
          protestMunicipalityDescription: InformazioniEffetto.DescComLevata,
          billIssueDate: parseUnknownDate(InformazioniEffetto.DtEmissioneEffetto),
          billDueDate: parseUnknownDate(InformazioniEffetto.DtScadenzaEffetto),
          billTypeCode: InformazioniEffetto.CodTipoEffetto,
          billTypeDescription: InformazioniEffetto.DescTipoEffetto,
          protestAmount: InformazioniEffetto.ImportoValutaLevata,
          protestCurrencyCode: InformazioniEffetto.CodValutaLevata,
          protestCurrencyDescription: InformazioniEffetto.DescValutaLevata,
          nonPaymentReasonCode: InformazioniEffetto.CodMancatoPagRepr,
          nonPaymentReasonDescription: InformazioniEffetto.DescMancatoPagRepr,
          billStatusCode: InformazioniEffetto.CodStatoEffetto,
          billStatusDescription: InformazioniEffetto.DescStatoEffetto,
          repertoryNumber: InformazioniEffetto.NRepertorio
        },
        aiwsError: errors
      }

      protestDataList.push(protestData);
    }

    return protestDataList;
  }
}