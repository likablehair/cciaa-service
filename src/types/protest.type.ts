import { DateTime } from "luxon";
import { AIWSError } from "./aiwsError.type";

export type ProtestData = {
  kAnagrafica: string;
  fiscalCode: string;
  protestRegisterData: {
    cciaaPublication: string;
    registrationRegisterDate: DateTime | null;
  }
  protestInformation: {
    protestDate: DateTime | null;
    protestProvinceCode: string;
    protestProvinceDescription: string;
    protestMunicipalityCode: string;
    protestMunicipalityDescription: string;
    billIssueDate: DateTime | null;
    billDueDate: DateTime | null;
    billTypeCode: string;
    billTypeDescription: string;
    protestAmount: number;
    protestCurrencyCode: string;
    protestCurrencyDescription: string;
    nonPaymentReasonCode: string;
    nonPaymentReasonDescription: string;
    billStatusCode: string;
    billStatusDescription: string;
    repertoryNumber: number;
  }
  aiwsError?: AIWSError;
}