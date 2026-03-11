import { CompanyShare, CompanyShareType } from 'src/types/company.types';
import { Indirizzo, Riquadro } from 'src/types/share.type';

export const mapperType: Record<string, CompanyShareType> = {
  PERSONA: 'person',
  AZIENDA: 'company',
  ALTRO: 'other',
};

export class SharesManager {
  /** Converte l'indirizzo XML in oggetto tipizzato */
  private parseAddress(
    domicilio?: Indirizzo,
  ): CompanyShare['address'] | undefined {
    if (!domicilio) return undefined;
    return {
      street: domicilio.via,
      number: domicilio['n-civico'],
      city: domicilio.comune,
      province: domicilio.provincia,
      cap: domicilio.cap,
    };
  }

  /** Converte stringa capitale in numero */
  public parseCapital(capStr: string): number {
    return parseFloat(capStr.replace('.', '').replace(',', '.'));
  }

  /** Estrae i soci e le quote da un array di riquadri tipizzati */
  public async getShares(
    riquadri: Riquadro[] | Riquadro,
    totalCapital: number,
  ): Promise<CompanyShare[]> {
    const shares: CompanyShare[] = [];

    // Normalizza l'array di riquadri
    const normalizedRiquadri = Array.isArray(riquadri) ? riquadri : [riquadri];

    for (const riquadro of normalizedRiquadri) {
      const quota = this.parseCapital(
        riquadro['composizione-quote']['valore-nominale'],
      );
      const titolariList = Array.isArray(riquadro.titolari.titolare)
        ? riquadro.titolari.titolare
        : [riquadro.titolari.titolare];

      for (const t of titolariList) {
        const share: CompanyShare = {
          type: mapperType[t['anagrafica-titolare'].tipo],
          fiscalCode: t['anagrafica-titolare']['c-fiscale'],
          firstName:
            t['anagrafica-titolare'].nome ||
            t['anagrafica-titolare'].denominazione,
          lastName: t['anagrafica-titolare'].cognome,
          shareValue: quota,
          sharePercentage: (quota / totalCapital) * 100,
          isRepresentative: t['f-rappresentante'] === 'S',
          address: this.parseAddress(t.domicilio),
        };
        shares.push(share);
      }
    }

    return shares;
  }
}
