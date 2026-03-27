import { DateTime } from 'luxon';
import { AIWSError } from './aiwsError.type';

export type ProtestReport = {
  anagraphicKey: string | null;
  fiscalCode: string | null;
  holderIdentity: ProtestHolderIdentity;
  protestEffects: ProtestEffect[];
  totalProtests: number;
  aiwsError: AIWSError | null;
};

export type ProtestHolderIdentity = {
  fullName: string | null;
  sourceCode: string | null;
  fiscalCode: string | null;
  residenceProvinceCode: string | null;
  residenceProvinceDescription: string | null;
  residenceMunicipalityCode: string | null;
  residenceMunicipalityDescription: string | null;
  residenceAddress: string | null;
};

export type ProtestEffect = {
  registerData: ProtestRegisterData;
  effectInformation: ProtestEffectInformation;
};

export type ProtestRegisterData = {
  cciaaPublication: string | null;
  registrationRegisterDate: DateTime | null;
};

export type ProtestEffectInformation = {
  protestDate: DateTime | null;
  protestProvinceCode: string | null;
  protestProvinceDescription: string | null;
  protestMunicipalityCode: string | null;
  protestMunicipalityDescription: string | null;
  billIssueDate: DateTime | null;
  billDueDate: DateTime | null;
  billTypeCode: string | null;
  billTypeDescription: string | null;
  protestAmount: number | null;
  protestCurrencyCode: string | null;
  protestCurrencyDescription: string | null;
  nonPaymentReasonCode: string | null;
  nonPaymentReasonDescription: string | null;
  billStatusCode: string | null;
  billStatusDescription: string | null;
  repertoryNumber: number | null;
};
