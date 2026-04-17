export type { AIWSConfig } from 'src/types/aiws.types';
export type { CompanySummary, CompanyBalanceSheet, CompanyBalanceSheetValues } from 'src/types/companies-register/company.types';
export type { CompanyRegistryBlocksSummary } from 'src/types/companies-register/administrative-data-company.types';
export type {
  PersonSummary,
  PersonCorporateRole,
} from 'src/types/companies-register/person.type';
export type { ProtestReport } from 'src/types/protests-register/protest.type';
export type { CorporateHoldingStructure } from 'src/types/companies-register/ownership-structure.types';
export type { AIWSError } from 'src/types/aiws-error.type';
export { default as AIWSClient } from './clients/AIWSClient';
