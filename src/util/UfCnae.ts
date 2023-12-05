export class UfCnae {

    siglaUfEmit: string;
    siglaUfDest: string;
    descUfEmit: string;
    descUfDest: string;
    siglaRegiaoEmit: string;
    siglaRegiaoDest: string;
    descRegiaoEmit: string;
    descRegiaoDest: string;
    codCnaeEmit: string;
    descCnaeEmit: string;
    codCnaeDest: string;
    descCnaeDest: string;
    segmentoEmit: string;
    segmentoDest: string;
    descClasseCnaeEmit: string;
    descClasseCnaeDest: string;
    descGrupoCnaeEmit: string;
    descGrupoCnaeDest: string;
    descDivisaoCnaeEmit: string;
    descDivisaoCnaeDest: string;
    qtdeNotas: number;
    valorTotal: number;

    constructor(
        siglaUfEmit: string, siglaUfDest: string, 
        descUfEmit: string, descUfDest: string,
        siglaRegiaoEmit: string, siglaRegiaoDest: string, 
        descRegiaoEmit: string, descRegiaoDest: string,
        codCnaeEmit: string, descCnaeEmit: string,
        codCnaeDest: string, descCnaeDest: string,
        segmentoEmit: string, segmentoDest: string, 
        descClasseCnaeEmit: string, descClasseCnaeDest: string,
        descGrupoCnaeEmit: string, descGrupoCnaeDest: string,
        descDivisaoCnaeEmit: string, descDivisaoCnaeDest: string,
        qtdeNotas: number, valorTotal: number
        ){

        this.siglaUfEmit = siglaUfEmit;
        this.siglaUfDest = siglaUfDest;
        
        this.descUfEmit = descUfEmit;
        this.descUfDest = descUfDest;
        
        this.siglaRegiaoEmit = siglaRegiaoEmit;
        this.siglaRegiaoDest = siglaRegiaoDest;
        
        this.descRegiaoEmit = descRegiaoEmit;
        this.descRegiaoDest = descRegiaoDest;
        
        this.codCnaeEmit = codCnaeEmit;
        this.descCnaeEmit = descCnaeEmit;
        
        this.codCnaeDest = codCnaeDest;
        this.descCnaeDest = descCnaeDest;
        
        this.segmentoEmit = segmentoEmit;
        this.segmentoDest = segmentoDest;

        this.descClasseCnaeEmit = descClasseCnaeEmit;
        this.descClasseCnaeDest = descClasseCnaeDest;

        this.descGrupoCnaeEmit = descGrupoCnaeEmit;
        this.descGrupoCnaeDest = descGrupoCnaeDest;

        this.descDivisaoCnaeEmit = descDivisaoCnaeEmit;
        this.descDivisaoCnaeDest = descDivisaoCnaeDest;

        this.qtdeNotas = qtdeNotas;
        this.valorTotal = valorTotal;
      }
  
}