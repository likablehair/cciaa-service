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
	sourceCode: string | null;
	sourceDescription: string | null;
	subjectTypeCode: string | null;
	subjectTypeDescription: string | null;
	companyTypeCode: string | null;
	companyTypeDescription: string | null;
	registrationDate: DateTime | null;
	incorporationDate: DateTime | null;
	lastFilingDate: DateTime | null;
	companyName: string | null;
	fiscalCode: string | null;
	vatNumber: string | null;
	cciaaCode: string | null;
	reaNumber: string | null;
	legalFormCode: string | null;
	legalFormDescription: string | null;
	locationAddress: OwnershipAddress | null;
	pec: string | null;
	representatives: OwnershipRepresentative[];
};

export type OwnershipHolderIdentity = {
	holderTypeCode: string | null;
	holderTypeDescription: string | null;
	fiscalCode: string | null;
	companyName: string | null;
};

export type OwnershipRepresentative = {
	firstName: string | null;
	lastName: string | null;
	roleDescription: string | null;
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
	practiceCode: string | null;
	filingTypeCode: string | null;
	filingTypeDescription: string | null;
	deedDate: DateTime | null;
	cciaaCode: string | null;
	filingYear: string | null;
	filingNumber: string | null;
	protocolDate: DateTime | null;
	depositDate: DateTime | null;
};

export type OwnershipTargetCompany = {
	fiscalCode: string | null;
	companyName: string | null;
	legalFormCode: string | null;
	legalFormDescription: string | null;
};

export type OwnershipMonetaryAmount = {
	currencyCode: string | null;
	currencyDescription: string | null;
	amount: number | null;
};

export type OwnershipShareDetail = {
	nominalValue: number | null;
	currencyCode: string | null;
	currencyDescription: string | null;
	rights: OwnershipRight[];
};

export type OwnershipRight = {
	rightTypeCode: string | null;
	rightTypeDescription: string | null;
};

export type OwnershipParticipatedCompany = {
	fiscalCode: string | null;
	companyName: string | null;
	participationStartDate: DateTime | null;
	rights: OwnershipParticipatedCompanyRight[];
};

export type OwnershipParticipatedCompanyRight = {
	rightTypeCode: string | null;
	rightTypeDescription: string | null;
	nominalValue: number | null;
	capitalPercentage: number | null;
};

export type OwnershipAddress = {
	municipalityCode: string | null;
	municipality: string | null;
	province: string | null;
	toponymCode: string | null;
	toponym: string | null;
	street: string | null;
	streetNumber: string | null;
	postalCode: string | null;
};
