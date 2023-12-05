export class NotaDia {

    diaEmissao: Date;
    tipoEmissao: string;
    siglaUfEmit: string;
    dscUfEmit: string;    
    siglaUfDest: string;
    dscUfDest: string;
    siglaRegiaoEmit: string;
    dscRegiaoEmit: string;
    siglaRegiaoDest: string;
    dscRegiaoDest: string;
    segmentoEmit: string;
    segmentoDest: string;
    qtdeNotas: number;
    valorTotal: number;

    constructor(
        diaEmissao:Date, tipoEmissao: string,
        siglaUfEmit: string, dscUfEmit: string, 
        siglaUfDest: string, dscUfDest: string, 
        siglaRegiaoEmit: string, dscRegiaoEmit: string, 
        siglaRegiaoDest: string, dscRegiaoDest: string, 
        segmentoEmit: string, segmentoDest: string, 
        qtdeNotas: number, valorTotal: number ) 
    {
        this.diaEmissao = diaEmissao;
        this.tipoEmissao = tipoEmissao;      
        this.siglaUfEmit = siglaUfEmit;
        this.siglaUfDest = siglaUfDest;
        this.dscUfEmit = dscUfEmit;
        this.dscUfDest = dscUfDest;
        this.siglaRegiaoEmit = siglaRegiaoEmit;
        this.siglaRegiaoDest = siglaRegiaoDest;
        this.dscRegiaoEmit = dscRegiaoEmit;
        this.dscRegiaoDest = dscRegiaoDest;
        this.segmentoEmit = segmentoEmit;
        this.segmentoDest = segmentoDest;
        this.qtdeNotas = qtdeNotas;
        this.valorTotal = valorTotal;

    }
}