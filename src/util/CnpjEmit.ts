export class CnpjEmit {                

    codCnpj: string;
    siglaUf: string;
    descUf: string;
    descMunicipio: string;
    
    codCnaeEmit: string;
    descCnaeEmit: string;
    descClasseCnaeEmit: string;
    descGrupoCnaeEmit: string;
    descDivisaoCnaeEmit: string;
    segmento: string;
    
    siglaUfDest: string;
    descUfDest: string;
    siglaRegiaoDest: string;
    descRegiaoDest: string;
    
    qtdeNotas: number;
    
    valorTotalLinha: number;
    valorTotalCnpj: number;
    valorTotalCnpjUf: number;
    valorTotalCnpjSegmento: number;
    valorTotalCnpjUfSegmento: number;

    valorTotalCnpjMunicipio: number;
    valorTotalCnpjMunicipioUf: number;
    valorTotalCnpjMunicipioSegmento: number;
    valorTotalCnpjMunicipioUfSegmento: number;

    rankingGeral: number;
    rankingUf: number;
    rankingSegmento: number;
    rankingUfSegmento: number;
    rankingMunicipio: number;
    rankingMunicipioUf: number;
    rankingMunicipioSegmento: number;
    rankingMunicipioUfSegmento: number;

    constructor(
        codCnpjEmit: string, siglaUfEmit: string, descUfEmit: string, descMunicipioEmit: string,
        codCnaeEmit: string, descCnaeEmit: string, descClasseCnaeEmit: string,
        descGrupoCnaeEmit: string, descDivisaoCnaeEmit: string, segmentoEmit: string,        
        siglaUfDest: string, descUfDest: string, siglaRegiaoDest: string, descRegiaoDest: string,        
        qtdeNotas: number, valorTotalLinha: number,
        valorTotalCnpj: number, valorTotalCnpjUf: number,
        valorTotalCnpjSegmento: number, valorTotalCnpjUfSegmento: number,
        valorTotalCnpjMunicipio: number, valorTotalCnpjMunicipioUf: number,
        valorTotalCnpjMunicipioSegmento: number, valorTotalCnpjMunicipioUfSegmento: number,
    
        rankingGeral: number, rankingUf: number, rankingSegmento: number,
        rankingUfSegmento: number, rankingMunicipio: number, rankingMunicipioUf: number,
        rankingMunicipioSegmento: number, rankingMunicipioUfSegmento: number
            ){

        this.codCnpj = codCnpjEmit;
        this.siglaUf = siglaUfEmit;
        this.descUf = descUfEmit;
        this.descMunicipio = descMunicipioEmit;

        this.codCnaeEmit = codCnaeEmit;
        this.descCnaeEmit = descCnaeEmit;
        this.descClasseCnaeEmit = descClasseCnaeEmit;
        this.descGrupoCnaeEmit = descGrupoCnaeEmit;
        this.descDivisaoCnaeEmit = descDivisaoCnaeEmit;               
        this.segmento = segmentoEmit;    

        this.siglaUfDest = siglaUfDest;        
        this.descUfDest = descUfDest;        
        this.siglaRegiaoDest = siglaRegiaoDest;        
        this.descRegiaoDest = descRegiaoDest;        

        this.qtdeNotas = qtdeNotas;

        this.valorTotalLinha = valorTotalLinha;
        this.valorTotalCnpj = valorTotalCnpj;
        this.valorTotalCnpjUf = valorTotalCnpjUf;
        this.valorTotalCnpjSegmento = valorTotalCnpjSegmento;
        this.valorTotalCnpjUfSegmento = valorTotalCnpjUfSegmento;
        this.valorTotalCnpjMunicipio = valorTotalCnpjMunicipio;
        this.valorTotalCnpjMunicipioUf = valorTotalCnpjMunicipioUf;
        this.valorTotalCnpjMunicipioSegmento = valorTotalCnpjMunicipioSegmento;
        this.valorTotalCnpjMunicipioUfSegmento = valorTotalCnpjMunicipioUfSegmento;

        this.rankingGeral = rankingGeral;
        this.rankingUf = rankingUf;
        this.rankingSegmento = rankingSegmento;
        this.rankingUfSegmento = rankingUfSegmento;
        this.rankingMunicipio = rankingMunicipio;
        this.rankingMunicipioUf = rankingMunicipioUf;
        this.rankingMunicipioSegmento = rankingMunicipioSegmento;
        this.rankingMunicipioUfSegmento = rankingMunicipioUfSegmento;

    }

}

