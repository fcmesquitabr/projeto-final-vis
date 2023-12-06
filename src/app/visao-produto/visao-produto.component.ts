import { Component, OnInit } from '@angular/core';

import embed from 'vega-embed';
import {TopLevelSpec} from 'vega-lite';

import { UfSegmentoService } from '../service/uf-segmento.service';
import { UfNcm } from 'src/util/UfNcm';
import {changeset} from 'vega'

type UfTotal = {siglaUf: string, dscUf: string, siglaRegiao:string, dscRegiao:string, qtdeNotas: number, valorTotal: number};

@Component({
  selector: 'app-visao-produto',
  templateUrl: './visao-produto.component.html',
  styleUrls: ['./visao-produto.component.css']
})
export class VisaoProdutoComponent implements OnInit{

  private readonly TIPO_EMISSAO_ENTRADA = 'Entradas';
  private readonly TIPO_EMISSAO_SAIDA = 'Saidas';

  ufSaidaData!: any;
  ufEntradaData!: any;

  tipoEmissaoList: string[] = [this.TIPO_EMISSAO_ENTRADA, this.TIPO_EMISSAO_SAIDA];
  tipoEmissaoSelecionado = this.TIPO_EMISSAO_SAIDA;

  ufSelecionadas: string[] = [];
  produtosSelecionados: string[] = [];

  constructor(private ufSegmentoService: UfSegmentoService){
  }

  ngOnInit() {
    this.generateVisaoProdutolDashboard();
  }

  trocarTipoEmissao(event:any){
    this.generateVisaoProdutolDashboard();
 }

  async generateVisaoProdutolDashboard(){
    const spec: TopLevelSpec = this.getDashboardSpec(await this.getUfNcmData(), await this.getUfNcmTotalData());
    const view = embed('#visao-produto-dashboard', spec);

    view.then((result: any) => {
      this.addDataListenerSelectUf(result.view);
      this.addDataListenerSelectProduto(result.view);
    })

  }

  private addDataListenerSelectUf(view: any){
    view.addDataListener('selectUf_store', async(event: any, items: any) => {
      // Manipular os pontos selecionados
      if(items.length > 0){
        this.ufSelecionadas = [];
        items.forEach((item:any)=>{this.ufSelecionadas.push(item.values[0]);})          
      } else {
        this.ufSelecionadas = [];
      }

      let ufNcmData = await this.getUfNcmData();
      var changeSet = changeset().insert(ufNcmData).remove((item:UfNcm)=>true);
      view.change('produtosData', changeSet).runAsync();
    });
  }

  private addDataListenerSelectProduto(view: any){
    view.addDataListener('selectBarProduto_store', async(event: any, items: any) => {

      if(items.length > 0){
        this.produtosSelecionados = [];
        items.forEach((item:any)=>{this.produtosSelecionados.push(item.values[0])})          
      } else {
        this.produtosSelecionados = [];
      }

      let ufNcmTotalData = await this.getUfNcmTotalData();

      var changeSet1 = changeset().remove((item:UfTotal)=>{
        let ufTotalCorres = ufNcmTotalData.filter((ufTotal: UfTotal)=> ufTotal.siglaUf == item.siglaUf)
        return ufTotalCorres.length == 0;
      });
      await view.change('ufNcmTotalData', changeSet1).runAsync();

      var changeSet = changeset().insert(ufNcmTotalData);
      await view.change('ufNcmTotalData', changeSet).runAsync();
    });
  }

  private getDashboardSpec(ufNcmData:any, ufNcmTotalData:any){

    const barChartProduto: TopLevelSpec|any = this.getProdutosBarChartSpec(ufNcmData);
    const mapSpec: TopLevelSpec|any = this.getUfMapSpec(ufNcmTotalData, this.getTitleMap());

    const dashboardSpec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Pie Chart with percentage_tooltip",
      data: {
        values: ufNcmData,
        name:"ufNcmFataPrincipal"
      },
      hconcat:[
        mapSpec, 
        barChartProduto
      ],
      resolve:{scale:{color:"independent"}},
      height: 650,
      width: 900            
    }

    return dashboardSpec;
  }

  private getProdutosBarChartSpec(ufNcmData: any){
    
    const spec: TopLevelSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Gráfico de Barras dos Tops Produtos Importados/Exportados.',
      title: "Top 20 Produtos",
      data:{name: 'produtosData', values: ufNcmData},
      transform:[
        {
          joinaggregate: [{
            op: "sum",
            field: "valorTotal",
            as: "valorTotalProduto"
          }],
          groupby: ['codNcm2']
        },
        {
          window: [{
            op: "dense_rank",
            as: "rankProduto"
          }],
          sort:[{field:'valorTotalProduto', order:'descending'}]
        },
        {filter: { field: 'rankProduto', lte: 20}},
        {
          window: [{
            op: "row_number",
            as: "rowNumber"
          }],
          groupby:['rankProduto'],
          sort:[{field:'valorTotalProduto', order:'descending'}]
        },
        {filter: { field: 'rowNumber', equal: 1}},
        {
          joinaggregate: [{
            op: "max",
            field: "valorTotalProduto",
            as: "maxValorTotalProduto"
          }]
        },
        {
          calculate:"(datum.valorTotalProduto/datum.maxValorTotalProduto)>0.6?-35:5", as:"xOffSet"
        }        
      ],
      encoding: {          
        x: {field: 'valorTotalProduto', type: 'quantitative', title:'Total dos Produtos', stack: null},                
        y: {field: 'codNcm2', type: 'nominal', title:'Código Produto', sort:'-x', scale:{paddingOuter:5}},
      },
      layer:[{
        params: [
          {
            name: "highlightBarProduto",
            select: {type: "point", on: "pointerover"}
          },
          {name: "selectBarProduto", select: {type:"point", encodings:['y']}},
        ],        
        mark: {type:'bar', cornerRadiusEnd: 5, stroke: "black", height: 25},
        encoding: {          
//          x: {field: 'valorTotalProduto', aggregate:'max', type: 'quantitative', title:'Total dos Produtos', stack: null},                
//          y: {field: 'codNcm2', type: 'nominal', title:'Código Produto', sort:'-x', scale:{paddingOuter:5}},
          color: {
            field: 'valorTotalProduto', type: 'quantitative', 
            scale: {type:'quantize', nice:true , scheme: {name: 'blues', count: 10}}, title:'Total'
          },
          fillOpacity: {
            condition: [{param: "selectBarProduto", value: 1}],
            value: 0.6
          },
          strokeWidth: {
            condition: [
              {
                param: "selectBarProduto",
                empty: false,
                value: 2
              },
              {
                param: "highlightBarProduto",
                empty: false,
                value: 1.5
              }
            ],
            value: 0
          },
          tooltip: [
            {field: 'descNsm2', title: "Produto"},
            {field: "valorTotalProduto", format:",.2f", title: "Total de Notas"},
//            {field: "maxValorTotalProduto", aggregate:'max', format:",.2f", title: "Max Total de Notas"}          
          ],
        },        
      },
      {
        mark: {
          type: "text", 
          baseline:"middle", 
          fontWeight:"bold",
          align:"left", 
          xOffset: {expr:"isNumber(datum.xOffSet)?datum.xOffSet:5"}, 
          aria: false
        },
        encoding: {
          text: {            
            field: "valorTotalProduto", 
            //aggregate:"max",
            type:"quantitative", 
            format:".2s",
          },
          color:{            
            //condition:{test:{field:"rankSegmento", lte:"3.0"}, value:'white'},
            condition:{test:"datum.xOffSet < 0", value:'white'},
            value:"black"
          }
        },
      }      
    ],      
      width: 350
    }    

    return spec
  }

  private getUfMapSpec(ufNcmTotalData:any, title: string){    
    
    const spec: TopLevelSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      description: 'Mapa de UFs Emitentes/Destinatárias de Produtos.',
      data: {
        url: "assets/uf_topo.json",
        format: {type: "topojson", feature: "uf"}
      },
      transform: [{
        lookup: "properties.uf",
        from: {
          data: {
            name: "ufNcmTotalData",
            values: ufNcmTotalData,
          },
          key: "dscUf",
          fields: ["valorTotal", "dscUf", "dscRegiao",'qtdeNotas']
        },
        default: 'NA'
      }],
      layer:[
        {
          params: [
            {
              name: "highlightUf",
              select: {type: "point", on: "pointerover"}
            },
            {name: "selectUf", select: {type:"point", encodings:['key']}}
          ],
          mark: {type:'geoshape', stroke:'#666', strokeWidth: 0.6},
          title: title,
          projection: {type:'mercator'},
          encoding: {
            key: {field: 'dscUf', type: 'nominal'},
            color: {
              field: 'valorTotal',
              type:'quantitative', 
              scale: {
                type: 'quantize', 
                nice: true,
                scheme: {name: 'greens', count: 10}
              },
              legend: {title:'Total de NFes'}
            },
            fillOpacity: {
              condition: {param: "selectUf", value: 1},
              value: 0
            },
            strokeWidth: {
              condition: [
                {
                  param: "selectUf",
                  empty: false,
                  value: 2
                },
                {
                  param: "highlightUf",
                  empty: false,
                  value: 2
                }
              ],
              value: 0.6
            },    
            tooltip: [
              {field:"dscUf", title: "UF"},
              {field:"dscRegiao", title: "Região"},
              {field:"qtdeNotas", type:'quantitative', format:',.0f', title: "Quantidade de Notas"},
              {field:"valorTotal", type:'quantitative', format:',.2f', title: "Total de Notas"}
            ]
          }    
        },
        {
          mark: {type:'geoshape', stroke:'#666', strokeWidth: 0.6},
          projection: {type:'mercator'},
          encoding: {
            color: {
              condition: {param:"selectUf" ,value: null},
              value: "lightgray"
            },
            tooltip: [
              {title: "UF", field:"properties.name"},
            ]
          }
        },              
        {
          mark: {type:'geoshape', stroke:'#666', strokeWidth: 0.6},
          projection: {type:'mercator'},
          encoding: {
            color: {
              condition: {test: "!isValid(datum) || !isValid(datum['dscUf']) || datum['dscUf'] == 'NA'  || datum['valorTotal']==0", value: "lightgray"},
              value: null
            },
            tooltip: [
              {title: "UF", field:"properties.uf"},
              {title: "Região", field:"properties.regiao"},
            ]
          }
        },
      ],     
      height: 500,
      width: 550    
    };

    return spec;
  }

  private getTitleMap(){
    if (this.isTipoEmissaoSaida()){
      return "UFs Destinatárias do Ceará";
    } 
    return "UFs Emitentes para o Ceará";
  }

  private async getUfNcmData(){
    let municipioData = [];

    if (this.isTipoEmissaoSaida()){
      municipioData = await this.getUfNcmSaidaDataFiltrado();
    } else {
      municipioData = await this.getUfNcmEntradaDataFiltrado();
    }

    return municipioData;
  }

  private async getUfNcmTotalData(){
    let totalData: any = [];

    if (this.isTipoEmissaoSaida()){
      totalData = await this.getUfNcmTotalSaidaData();
    } else {
      totalData = await this.getUfNcmTotalEntradaData();
    }    
    return totalData;
  }

  private async getUfNcmSaidaData(){
    if(!this.ufSaidaData){
      this.ufSaidaData = await this.ufSegmentoService.getUfNcmSaidaList();
    }
    return this.ufSaidaData;
  }

  private async getUfNcmSaidaDataFiltrado(){

    let ufNcmDataList = await this.getUfNcmSaidaData()

    if(this.ufSelecionadas.length == 0) return ufNcmDataList;

    let ufSaidaDataFiltrado = ufNcmDataList.filter((ufNcm:UfNcm) => {
      return this.ufSelecionadas.includes((ufNcm as any)['descUfDest']);
    });
    return ufSaidaDataFiltrado;
  }

  private async getUfNcmEntradaData(){
    if(!this.ufEntradaData){
      this.ufEntradaData = await this.ufSegmentoService.getUfNcmEntradaList();
    }
    return this.ufEntradaData;  
  }

  private async getUfNcmEntradaDataFiltrado(){

    let ufNcmDataList = await this.getUfNcmEntradaData()

    if(this.ufSelecionadas.length == 0) return ufNcmDataList;

    let ufEntradaDataFiltrado = ufNcmDataList.filter((ufNcm:UfNcm) => {
      return this.ufSelecionadas.includes((ufNcm as any)['descUfEmit']);
    });
    return ufEntradaDataFiltrado;
  }

  private isProdutoAtendeFiltro(ufNcm: UfNcm){
    if (this.produtosSelecionados.length == 0){
      return true;
    }
      
    return this.produtosSelecionados.includes(ufNcm.codNcm2)
  }

  private async getUfNcmTotalSaidaData(){
    let ncmSaidaData = await this.getUfNcmSaidaData();
   
    let ncmTotalSaidaData = ncmSaidaData.reduce(
      (accumulator:UfTotal[], currentValue: UfNcm)=>{

        let ufTotalList = accumulator.filter((ufTotal: UfTotal) => ufTotal.siglaUf==currentValue.siglaUfDest)        
        
        if(ufTotalList.length > 0){

          ufTotalList[0].qtdeNotas += (this.isProdutoAtendeFiltro(currentValue))?currentValue.qtdeNotas:0;
          ufTotalList[0].valorTotal += (this.isProdutoAtendeFiltro(currentValue))?currentValue.valorTotal:0;

        }else{

          let ufTotal: UfTotal = {
            siglaUf: currentValue.siglaUfDest,
            dscUf: currentValue.descUfDest,
            siglaRegiao: currentValue.siglaRegiaoDest,
            dscRegiao: currentValue.descRegiaoDest,
            qtdeNotas: currentValue.qtdeNotas,
            valorTotal: currentValue.valorTotal
          };

          accumulator.push(ufTotal);
        }
        return accumulator;
      },
      []
    )    
    return ncmTotalSaidaData;
  }

  private async getUfNcmTotalEntradaData(){
    let ncmEntradaData = await this.getUfNcmEntradaData();

    let ncmTotalEntradaData = ncmEntradaData.reduce(
      (accumulator:UfTotal[], currentValue: UfNcm)=>{

        if (this.produtosSelecionados.length > 0){
          if(!this.produtosSelecionados.includes(currentValue.codNcm2)){
            return accumulator;
          }
        }

        let ufTotalList = accumulator.filter((ufTotal: UfTotal) => ufTotal.siglaUf==currentValue.siglaUfEmit)        
        
        if(ufTotalList.length > 0){

          ufTotalList[0].qtdeNotas += currentValue.qtdeNotas;
          ufTotalList[0].valorTotal += currentValue.valorTotal;

        }else{

          let ufTotal: UfTotal = {
            siglaUf: currentValue.siglaUfEmit,
            dscUf: currentValue.descUfEmit,
            siglaRegiao: currentValue.siglaRegiaoEmit,
            dscRegiao: currentValue.descRegiaoEmit,
            qtdeNotas: currentValue.qtdeNotas,
            valorTotal: currentValue.valorTotal
          };

          accumulator.push(ufTotal);
        }
        return accumulator;
      },
      []
    )    

    return ncmTotalEntradaData;
  }

  private isTipoEmissaoSaida(){
    return (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA);
  }

}
