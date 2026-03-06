export enum AIWS_ERROR_CODE {
  COMPANY_SUMMARY_FETCH_FAILED = 'COMPANY_SUMMARY_FETCH_FAILED',
  FINANCIALS_FETCH_FAILED = 'FINANCIALS_FETCH_FAILED',
  SHARES_FETCH_FAILED = 'SHARES_FETCH_FAILED',
  MISSING_CCIAA_OR_REA = 'MISSING_CCIAA_OR_REA',
  COMPANY_NOT_FOUND = 'COMPANY_NOT_FOUND',
  INSUFFICIENT_CREDIT = 'INSUFFICIENT_CREDIT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  HTTP_ERROR = 'HTTP_ERROR',
  XML_PARSE_ERROR = 'XML_PARSE_ERROR',

  XBRL_EMPTY = 'XBRL_EMPTY',
  XBRL_DECODE_ERROR = 'XBRL_DECODE_ERROR',
  XBRL_MAPPING_ERROR = 'XBRL_MAPPING_ERROR',
}

export interface AIWSErrorItem {
  code: AIWS_ERROR_CODE;
  message?: string;
  context?: Record<string, unknown>;
}

export const AIWS_ERROR_MESSAGES: Record<AIWS_ERROR_CODE, string> = {
  COMPANY_SUMMARY_FETCH_FAILED: 'Errore nel recupero anagrafica impresa',
  FINANCIALS_FETCH_FAILED: 'Errore nel recupero dati finanziari',
  SHARES_FETCH_FAILED: 'Errore nel recupero quote societarie',
  MISSING_CCIAA_OR_REA: 'Impossibile recuperare quote societarie: CCIAA o REA mancanti',
  COMPANY_NOT_FOUND: 'Impresa non trovata',
  SERVICE_UNAVAILABLE: 'Servizio temporaneamente non disponibile',
  HTTP_ERROR: 'Errore HTTP del servizio',
  XML_PARSE_ERROR: 'Errore nel parsing XML',
  XBRL_EMPTY: 'Impossibile recuperare i dati finanziari. Errore nel recupero del file XBRL.',
  XBRL_DECODE_ERROR: 'Impossibile recuperare i dati finanziari. Errore nella decodifica del file XBRL.',
  XBRL_MAPPING_ERROR: 'Impossibile recuperare i dati finanziari. Errore nella mappaggio del file XBRL.',
  INSUFFICIENT_CREDIT: 'Credito insufficiente per procedere',
};

export function pushAIWSError(
  errors: AIWSError,
  code: AIWS_ERROR_CODE,
  context?: Record<string, unknown>,
  message?: string,
) {
  errors.push({ code, context, message });
}

export type AIWSError = AIWSErrorItem[];
