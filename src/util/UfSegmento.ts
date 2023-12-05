export class UfSegmento {
    siglaUfEmit: string;
    siglaUfDest: string;
    descUfEmit: string;
    descUfDest: string;
    siglaRegiaoEmit: string;
    siglaRegiaoDest: string;
    descRegiaoEmit: string;
    descRegiaoDest: string;
    segmentoEmit: string;
    segmentoDest: string;
    qtdeNotas: number;
    valorTotal: number;
  
    constructor(
      siglaUfEmit: string, siglaUfDest: string, 
      descUfEmit: string, descUfDest: string,
      siglaRegiaoEmit: string, siglaRegiaoDest: string, 
      descRegiaoEmit: string, descRegiaoDest: string,
      segmentoEmit: string, segmentoDest: 
      string, qtdeNotas: number, valorTotal: number
      ){
      this.siglaUfEmit = siglaUfEmit;
      this.siglaUfDest = siglaUfDest;
      this.descUfEmit = descUfEmit;
      this.descUfDest = descUfDest;
      this.siglaRegiaoEmit = siglaRegiaoEmit;
      this.siglaRegiaoDest = siglaRegiaoDest;
      this.descRegiaoEmit = descRegiaoEmit;
      this.descRegiaoDest = descRegiaoDest;
      this.segmentoEmit = segmentoEmit;
      this.segmentoDest = segmentoDest;
      this.qtdeNotas = qtdeNotas;
      this.valorTotal = valorTotal;
    }
}