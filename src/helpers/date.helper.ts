import { DateTime } from 'luxon';

const KNOWN_DATE_FORMATS = [
  'dd/MM/yyyy',
  'd/M/yyyy',
  'dd-MM-yyyy',
  'd-M-yyyy',
  'yyyy-MM-dd',
  'yyyy/MM/dd',
  'dd/MM/yyyy HH:mm:ss',
  'yyyy-MM-dd HH:mm:ss',
];

export function parseUnknownDate(value?: string | null): DateTime | null {
  if (!value) {
    return null;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const iso = DateTime.fromISO(normalizedValue);
  if (iso.isValid) {
    return iso;
  }

  for (const format of KNOWN_DATE_FORMATS) {
    const parsed = DateTime.fromFormat(normalizedValue, format);
    if (parsed.isValid) {
      return parsed;
    }
  }

  const rfc2822 = DateTime.fromRFC2822(normalizedValue);
  if (rfc2822.isValid) {
    return rfc2822;
  }

  const httpDate = DateTime.fromHTTP(normalizedValue);
  if (httpDate.isValid) {
    return httpDate;
  }

  return null;
}
