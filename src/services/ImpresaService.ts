import { AxiosInstance } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { AnagraficaImpresa, ParsedAIWSResponse } from 'src/types/aiws.types';

export class ImpresaService {
  private parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });

  constructor(private client: AxiosInstance) {}

  /**
   * Ragione Sociale e Stato Azienda
   * Endpoint: /registroimprese/imprese/ricerca/partitaiva [cite: 985]
   */
  public async ricercaPerPartitaIva(piva: string): Promise<AnagraficaImpresa> {
   try {
     
    const response = await this.client.get('/registroimprese/imprese/ricerca/partitaiva', {
      params: { partitaIva: piva, fSoloSedi: 'S' }
    });

    switch (response.status) {
      case 200:
        break;
      case 404:
        throw new Error("Impresa non trovata");
       case 503:
        throw new Error("Servizio temporaneamente non disponibile");
      default:
        throw new Error(`Errore HTTP CCIAA ${response.status}`);
    }

    const json = this.parser.parse(response.data) as ParsedAIWSResponse

    
    const info = json.Risposta.ListaImpreseRI.Impresa.AnagraficaImpresa;
    if (!info) {
      throw new Error(`Impresa non trovata. Risposta: ${JSON.stringify(json.Risposta.Testata.Riepilogo)}`);
    }
    
    return info;
      } catch (err) {
    if (err) {
      throw new Error(`Errore HTTP CCIAA ${(err)}`);
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