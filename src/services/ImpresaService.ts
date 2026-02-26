import { AxiosInstance } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { AnagraficaImpresa, CompanySummary, ParsedAIWSResponse } from 'src/types/aiws.types';

export function mapAnagraficaImpresaToCompanySummary(
  impresa: AnagraficaImpresa
): CompanySummary {
  return {
    /* === Identità === */
    companyName: impresa.Denominazione,
    companyFiscalCode: impresa.CodFisc,
    companyVatNumber: impresa.PIva,
    companyLegalFormCode: impresa.NatGiu,
    companyLegalFormDescription: impresa.DescNatGiu,

    /* === CCIAA === */
    companyCciaaCode: impresa.Cciaa,
    companyCciaaDescription: impresa.DescCciaa,
    companyReaNumber: impresa.NRea,

    /* === Stato === */
    companyStatusCode: impresa.StatoAttivita,
    companyStatusDescription: impresa.DescStatoAttivita,
    companyRegistryStatusCode: impresa.StatoAttivitaReg,
    companyRegistryStatusDescription: impresa.DescStatoAttivitaReg,
    companySourceCode: impresa.Fonte,
    companySourceDescription: impresa.DescFonte,

    /* === Attività === */
    companyDeclaredActivity: impresa.AttivitaDichiarata,
    companyAtecoCode: impresa.ClassificazioneAteco.CodAttivita,
    companyAtecoDescription: impresa.ClassificazioneAteco.DescAttivita,
    companyAtecoClassificationCode: impresa.ClassificazioneAteco.CodCodifica,
    companyAtecoClassificationDescription:
      impresa.ClassificazioneAteco.DescCodifica,

    /* === Sede === */
    companyProvinceCode: impresa.IndirizzoSede.SglPrvSede,
    companyProvinceDescription: impresa.IndirizzoSede.DescPrvSede,
    companyMunicipalityCode: impresa.IndirizzoSede.CodComSede,
    companyMunicipalityDescription: impresa.IndirizzoSede.DescComSede,
    companyToponymCode: impresa.IndirizzoSede.CodToponSede,
    companyToponymDescription: impresa.IndirizzoSede.DescToponSede,
    companyStreet: impresa.IndirizzoSede.ViaSede,
    companyStreetNumber: String(impresa.IndirizzoSede.NCivicoSede),
    companyPostalCode: impresa.IndirizzoSede.CapSede,

    /* === Contatti === */
    companyPec: impresa.IndirizzoPostaCertificata,

    /* === Economici === */
    companyShares: null,
    companyProfit: null,
    companyRevenue: null,

    /* === Societari === */
    companyIncorporationDate: null
  }
}

export class ImpresaService {
  private parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });

  constructor(private client: AxiosInstance) {}

  /**
   * Ragione Sociale e Stato Azienda
   * Endpoint: /registroimprese/imprese/ricerca/partitaiva [cite: 985]
   */
  public async ricercaPerPartitaIva(piva: string): Promise<CompanySummary> {
    try {
      const response = await this.client.get(
        '/registroimprese/imprese/ricerca/partitaiva',
        {
          params: { partitaIva: piva, fSoloSedi: 'S' },
        },
      );

      switch (response.status) {
        case 200:
          break;
        case 404:
          throw new Error('Impresa non trovata');
        case 503:
          throw new Error('Servizio temporaneamente non disponibile');
        default:
          throw new Error(`Errore HTTP CCIAA ${response.status}`);
      }

      const json = this.parser.parse(response.data) as ParsedAIWSResponse;

      const info = json.Risposta.ListaImpreseRI.Impresa.AnagraficaImpresa;
      if (!info) {
        throw new Error(
          `Impresa non trovata. Risposta: ${JSON.stringify(json.Risposta.Testata.Riepilogo)}`,
        );
      }

      return mapAnagraficaImpresaToCompanySummary(info);
    } catch (err) {
      if (err) {
        throw new Error(`Errore HTTP CCIAA ${err}`);
      }
      throw err;
    }
  }

  private checkErrors(json: ParsedAIWSResponse) {
    const msg = json.Risposta.Testata.Messaggio;
    if (msg && msg.GravitaErrore === 'E') {
      throw new Error(`[${msg.CodiceErrore}] ${msg.DescrizioneErrore}`);
    }
  }

  
}
