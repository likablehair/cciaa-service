import { DateTime } from 'luxon';
import { AIWSError } from './aiwsError.type';
import { CompanySummary } from './company.types';

export type PersonSummary = {
  firstname: string | null;
  lastname: string | null;
  gender: string | null;
  fiscalCode: string | null;
  dateOfBirth: DateTime | null;
  municipality: string | null;
  province: string | null;
  address: string | null;
  cap: string | null;
  pec: string | null;
  aiwsError: AIWSError | null;
};

export type PersonCorporateRole = {
  corporateRole: string;
  corporateRoleCode: string;
  dateOfAppointment: DateTime | null;
  durationDescription: string | null;
  durationCode: string | null;
  balanceSheetDate: DateTime | null;
  companySummary: CompanySummary;
  personSummary: PersonSummary;
  aiwsError: AIWSError | null;
};
