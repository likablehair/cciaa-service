import { AIWSError } from './aiwsError.type';

export type CompanySummary = {
  /* === Identità azienda === */
  companyName: string;
  companyFiscalCode: string;
  companyVatNumber: string;
  companyLegalFormCode: string;
  companyLegalFormDescription: string;

  /* === Camera di Commercio === */
  companyCciaaCode: string;
  companyCciaaDescription: string;
  companyReaNumber: number;

  /* === Stato === */
  companyStatusCode: string;
  companyStatusDescription: string;
  companyRegistryStatusCode: string;
  companyRegistryStatusDescription: string;
  companySourceCode: string;
  companySourceDescription: string;

  /* === Attività === */
  companyDeclaredActivity: string;
  companyAtecoCode: string;
  companyAtecoDescription: string;
  companyAtecoClassificationCode: number;
  companyAtecoClassificationDescription: string;

  /* === Sede === */
  companyProvinceCode: string;
  companyProvinceDescription: string;
  companyMunicipalityCode: string;
  companyMunicipalityDescription: string;
  companyToponymCode: string;
  companyToponymDescription: string;
  companyStreet: string;
  companyStreetNumber: string;
  companyPostalCode: number;

  /* === Contatti === */
  companyPec: string;

  /* === Dati economici (non presenti → null) === */
  companyProfit: number | null;
  companyRevenue: number | null;

  /* === Dati societari futuri === */
  companyIncorporationDate: string | null;

  companyShares: CompanyShare[] | null;

  aiwsError: AIWSError | null;
};

export type CompanyFinancials = {
  companyProfit: number | null;
  companyRevenue: number | null;
};

export interface CompanyShare {
  type: 'PERSONA' | 'IMPRESA' | string;
  fiscalCode: string;
  firstName: string;
  lastName?: string;
  shareValue: number;
  sharePercentage: number;
  isRepresentative: boolean;
  address?: {
    street: string;
    number: string;
    city: string;
    province: string;
    cap: string;
  };
}
