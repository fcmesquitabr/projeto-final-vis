export class MunicipioSegmento {
    codMunicipioEmit: string;
    codMunicipioDest: string;
    siglaUfEmit: string;
    siglaUfDest: string;
    dscUfEmit: string;
    dscUfDest: string;
    siglaRegiaoEmit: string;
    siglaRegiaoDest: string;
    dscRegiaoEmit: string;
    dscRegiaoDest: string;
    dscMunicipioEmit: string;
    dscMunicipioDest: string;
    segmentoEmit: string;
    segmentoDest: string;
    qtdeNotas: number;
    valorTotal: number;
  
    constructor(
        codMunicipioEmit: string, codMunicipioDest: string,
        siglaUfEmit: string, siglaUfDest: string, 
        dscUfEmit: string, dscUfDest: string, 
        siglaRegiaoEmit: string, siglaRegiaoDest: string, 
        dscRegiaoEmit: string, dscRegiaoDest: string, 
        dscMunicipioEmit: string, dscMunicipioDest: string,
        segmentoEmit: string, segmentoDest: string, 
        qtdeNotas: number, valorTotal: number ) 
    {

        this.codMunicipioEmit = codMunicipioEmit;
        this.codMunicipioDest = codMunicipioDest;      
        this.siglaUfEmit = siglaUfEmit;
        this.siglaUfDest = siglaUfDest;
        this.dscUfEmit = dscUfEmit;
        this.dscUfDest = dscUfDest;
        this.siglaRegiaoEmit = siglaRegiaoEmit;
        this.siglaRegiaoDest = siglaRegiaoDest;
        this.dscRegiaoEmit = dscRegiaoEmit;
        this.dscRegiaoDest = dscRegiaoDest;
        this.dscMunicipioEmit = dscMunicipioEmit;
        this.dscMunicipioDest = dscMunicipioDest;      
        this.segmentoEmit = segmentoEmit;
        this.segmentoDest = segmentoDest;
        this.qtdeNotas = qtdeNotas;
        this.valorTotal = valorTotal;
    }
}