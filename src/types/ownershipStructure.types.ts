import { DateTime } from 'luxon';
import { AIWSError } from './aiwsError.type';

export type CorporateHoldingStructure = {
  companyIdentity: OwnershipCompanyIdentity;
  holderIdentity: OwnershipHolderIdentity;
  participations: OwnershipParticipation[];
  currentParticipatedCompanies: OwnershipParticipatedCompany[];
  totalCurrentParticipations: number | null;
  aiwsError: AIWSError | null;
};

export type OwnershipCompanyIdentity = {
  sourceCode: string;
  sourceDescription: string;
  subjectTypeCode: string;
  subjectTypeDescription: string;
  companyTypeCode: string;
  companyTypeDescription: string;
  registrationDate: DateTime | null;
  incorporationDate: DateTime | null;
  lastFilingDate: DateTime | null;
  companyName: string;
  fiscalCode: string;
  vatNumber: string;
  cciaaCode: string;
  reaNumber: string;
  legalFormCode: string;
  legalFormDescription: string | null;
  locationAddress: OwnershipAddress;
  pec: string | null;
  representatives: OwnershipRepresentative[];
};

export type OwnershipHolderIdentity = {
  holderTypeCode: string;
  holderTypeDescription: string;
  fiscalCode: string;
  companyName: string;
};

export type OwnershipRepresentative = {
  firstName: string;
  lastName: string;
  roleDescription: string;
  isRegistryRepresentative: boolean;
};

export type OwnershipParticipation = {
  isCurrentSection: boolean;
  practice: OwnershipPractice;
  isLatestShareholdersList: boolean;
  targetCompany: OwnershipTargetCompany;
  shareCapital: OwnershipMonetaryAmount;
  shareDetails: OwnershipShareDetail[];
};

export type OwnershipPractice = {
  practiceCode: string;
  filingTypeCode: string;
  filingTypeDescription: string;
  deedDate: DateTime | null;
  cciaaCode: string;
  filingYear: string;
  filingNumber: string;
  protocolDate: DateTime | null;
  depositDate: DateTime | null;
};

export type OwnershipTargetCompany = {
  fiscalCode: string;
  companyName: string;
  legalFormCode: string;
  legalFormDescription: string | null;
};

export type OwnershipMonetaryAmount = {
  currencyCode: string;
  currencyDescription: string;
  amount: number | null;
};

export type OwnershipShareDetail = {
  nominalValue: number | null;
  currencyCode: string;
  currencyDescription: string;
  rights: OwnershipRight[];
};

export type OwnershipRight = {
  rightTypeCode: string;
  rightTypeDescription: string;
};

export type OwnershipParticipatedCompany = {
  fiscalCode: string;
  companyName: string;
  participationStartDate: DateTime | null;
  rights: OwnershipParticipatedCompanyRight[];
};

export type OwnershipParticipatedCompanyRight = {
  rightTypeCode: string;
  rightTypeDescription: string;
  nominalValue: number | null;
  capitalPercentage: number | null;
};

export type OwnershipAddress = {
  municipalityCode: string | null;
  municipality: string;
  province: string;
  toponymCode: string | null;
  toponym: string;
  street: string;
  streetNumber: string;
  postalCode: string;
};
