import { DateTime } from 'luxon';
import { AIWSError } from './aiwsError.type';

export type ProtestReport = {
  anagraphicKey: string;
  fiscalCode: string | null;
  holderIdentity: ProtestHolderIdentity;
  protestEffects: ProtestEffect[];
  totalProtests: number;
  aiwsError: AIWSError | null;
};

export type ProtestHolderIdentity = {
  fullName: string;
  sourceCode: string;
  fiscalCode: string;
  residenceProvinceCode: string;
  residenceProvinceDescription: string;
  residenceMunicipalityCode: string;
  residenceMunicipalityDescription: string;
  residenceAddress: string;
};

export type ProtestEffect = {
  registerData: ProtestRegisterData;
  effectInformation: ProtestEffectInformation;
};

export type ProtestRegisterData = {
  cciaaPublication: string;
  registrationRegisterDate: DateTime | null;
};

export type ProtestEffectInformation = {
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
};
