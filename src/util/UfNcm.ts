export class UfNcm {
    tipoEmissao: string;
    siglaUfEmit: string;
    descUfEmit: string;    
    siglaUfDest: string;
    descUfDest: string;
    siglaRegiaoEmit: string;
    descRegiaoEmit: string;
    siglaRegiaoDest: string;
    descRegiaoDest: string;
    codNcm2: string;
    descNsm2: string;
    codNcm4: string;
    descNsm4: string;
    qtdeNotas: number;
    valorTotal: number;

    private readonly TIPO_EMISSAO_ENTRADA = "ENTRADA";
    private readonly TIPO_EMISSAO_SAIDA = "SAIDA";

    constructor(
        tipoEmissao: string, siglaUfEmit: string, descUfEmit: string, 
        siglaUfDest: string, descUfDest: string,
        siglaRegiaoEmit: string, descRegiaoEmit: string, 
        siglaRegiaoDest: string, descRegiaoDest: string,
        codNcm2: string, descNsm2: string,
        codNcm4: string, descNsm4: string,    
        qtdeNotas: number, valorTotal: number
        ){
        this.tipoEmissao = tipoEmissao;
        this.siglaUfEmit = siglaUfEmit;
        this.siglaUfDest = siglaUfDest;
        this.descUfEmit = descUfEmit;
        this.descUfDest = descUfDest;
        this.siglaRegiaoEmit = siglaRegiaoEmit;
        this.siglaRegiaoDest = siglaRegiaoDest;
        this.descRegiaoEmit = descRegiaoEmit;
        this.descRegiaoDest = descRegiaoDest;
        this.codNcm2 = codNcm2;
        this.descNsm2 = descNsm2;
        this.codNcm4 = codNcm4;
        this.descNsm4 = descNsm4;
        this.qtdeNotas = qtdeNotas;
        this.valorTotal = valorTotal;
    }

    public isTipoEmissaoSaida(){
      return this.tipoEmissao == this.TIPO_EMISSAO_SAIDA;
    }

    public isTipoEmissaoEntrada(){
      return this.tipoEmissao == this.TIPO_EMISSAO_ENTRADA;
    }

    public setDscUfEmit(dscUfEmit: string){
      this.descUfEmit = dscUfEmit;
    }

    public setDscUfDest(dscUfDest: string){
      this.descUfDest = dscUfDest;
    }

}