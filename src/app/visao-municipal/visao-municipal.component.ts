import { Component, OnInit } from '@angular/core';

import embed from 'vega-embed';
import {TopLevelSpec} from 'vega-lite';

import { MunicipioSegmentoService } from '../service/municipio-segmento.service';
import { MunicipioSegmento } from 'src/util/MunicipioSegmento';
import {changeset} from 'vega'

type MunicipioTotal = {
  codMunicipio: string, dscMunicipio: string, 
  dscRegiao:any[], segmento:any[], 
  qtdeNotas:number, 
  valorTotal: number
};

@Component({
  selector: 'app-visao-municipal',
  templateUrl: './visao-municipal.component.html',
  styleUrls: ['./visao-municipal.component.css']
})
export class VisaoMunicipalComponent implements OnInit  {

  private readonly TIPO_EMISSAO_ENTRADA = 'Entradas';
  private readonly TIPO_EMISSAO_SAIDA = 'Saidas';

  segmentoSelecionado: any[] = [];
  regiaoSelecionada: any[] = [];
  municipioSelecionado: string[] = [];

  municipioSaidaData!: any;
  municipioEntradaData!: any;
  tipoEmissaoList: string[] = [this.TIPO_EMISSAO_ENTRADA, this.TIPO_EMISSAO_SAIDA];
  tipoEmissaoSelecionado = this.TIPO_EMISSAO_SAIDA;

  constructor(private municipioSegmentoService: MunicipioSegmentoService){
  }

  ngOnInit() {
    this.generateVisaoMunicipalDashboard();
  }

  trocarTipoEmissao(event:any){
     this.generateVisaoMunicipalDashboard();
  }

  async generateVisaoMunicipalDashboard(){

    const spec: TopLevelSpec = this.getDashboardSpec(await this.getMunicipioData(), await this.getMunicipioTotalData());
    const view = embed('#visao-municipio-dashboard', spec);

    view.then((result: any) => {
      result.view.addDataListener('selectPie_store', async (event: any, items: any) => {

        if(items.length > 0){
          this.regiaoSelecionada = [];
          items.forEach((item:any)=>{this.regiaoSelecionada.push(item.values[0]);})          
        }else{
          this.regiaoSelecionada = [];
        }

        let municipioAgregado = await this.getMunicipioTotalData();
        var changeSet = changeset().insert(municipioAgregado).remove((item:MunicipioTotal)=>true);
        result.view.change('municipioAgregado', changeSet).runAsync();
  
      });
      
      result.view.addDataListener('selectBar_store', async (event: any, items: any) => {

        if(items.length > 0){
          this.segmentoSelecionado = [];
          items.forEach((item:any)=>{this.segmentoSelecionado.push(item.values[0]);})          
        } else {
          this.segmentoSelecionado = [];
        }

        let municipioAgregado = await this.getMunicipioTotalData();
        var changeSet = changeset().insert(municipioAgregado).remove((item:MunicipioSegmento)=>true)
        result.view.change('municipioAgregado', changeSet).runAsync();

      });

      result.view.addDataListener('selectMunicipio_store', async(event: any, items: any) => {
        // Manipular os pontos selecionados
        if(items.length > 0){
          this.municipioSelecionado = [];
          items.forEach((item:any)=>{this.municipioSelecionado.push(item.values[0]);})          
        } else {
          this.municipioSelecionado = [];
        }

        let municipioData = await this.getMunicipioData();
        var changeSet = changeset().insert(municipioData).remove((item:MunicipioSegmento)=>true);

        result.view.change('municipioDataPieChart', changeSet).runAsync();
        result.view.change('municipioDataBarChart', changeSet).runAsync();

      });
    })
    .catch(console.error);

  }
  
  private getDashboardSpec(municipioData:any, municipioTotalData:any){

    const pieChartSpec: TopLevelSpec = this.getPieChartRegiaoSpec(
      municipioData, this.getTitlePieChart(), this.getDescRegiaoField()
    );

    const barChartRegiaoSpec = this.getBarChartSegmentoSpec(
      municipioData, this.getTitleBarChart(), this.getSegmentoField()
    );

    const mapSpec: TopLevelSpec = this.getMunicipioMapSpec(municipioTotalData, this.getTitleMap());

    const dashboardSpec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Pie Chart with percentage_tooltip",
      data: {
        values: municipioData,
        name:"municipioDataPrincipal"
      },
      hconcat:[
        mapSpec,
        {vconcat: [pieChartSpec, barChartRegiaoSpec]},
      ],
      resolve:{scale:{color:"independent"}},
      height: 650,
      width: 1100            
    }

    return dashboardSpec;
  }
  
  private getTitlePieChart(){
    if (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA){
      return "Total de Notas Recebidas por Região";
    } 
    return "Total de Notas Emitidas por Região";
  }

  private getTitleMap(){
    if (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA){
      return "Municípios Emitentes do Ceará";
    } 
    return "Municípios Destinatários do Ceará";
  }

  private getDescRegiaoField(){
    if (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA){
      return "dscRegiaoDest";
    } 
    
    return "dscRegiaoEmit";
  }

  private getTitleBarChart(){
    if (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA){
      return "Segmentos Emitentes";
    } 
    return "Segmentos Destinatários";
  }

  private getSegmentoField(){
    if (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA){
      return "segmentoEmit";
    } 
    
    return "segmentoDest";
  }

  private async getMunicipioData(){
    let municipioData = [];

    if (this.isTipoEmissaoSaida()){
      municipioData = await this.getMunicipioSegmentoSaidaDataFiltrado();
    } else {
      municipioData = await this.getMunicipioSegmentoEntradaDataFiltrado();
    }

    return municipioData;
  }

  private async getMunicipioSegmentoSaidaDataFiltrado(){    
    return this.filtrarMunicipiosSelecionados(await this.getMunicipioSaidaData(), "dscMunicipioEmit");    
  }

  private async getMunicipioSaidaData(){
    if(!this.municipioSaidaData){
      this.municipioSaidaData = await this.municipioSegmentoService.getMunicipioSegmentoSaidaList();
    }
    return this.municipioSaidaData;
  }


  private filtrarMunicipiosSelecionados(municipioSegmentoList: MunicipioSegmento[], fieldDescMunicipio:string){
    let municipioSegmentoFiltrado = municipioSegmentoList.filter((municipioSegmento:MunicipioSegmento) => {
      if(this.municipioSelecionado.length > 0){
        return this.municipioSelecionado.includes((municipioSegmento as any)[fieldDescMunicipio]);
      } else{
        return true;
      }
    });
    
    return municipioSegmentoFiltrado;
  }

  private async getMunicipioEntradaData(){
    if(!this.municipioEntradaData){
      this.municipioEntradaData = await this.municipioSegmentoService.getMunicipioSegmentoEntradaList();
    }
    return this.municipioEntradaData;
  }

  private async getMunicipioSegmentoEntradaDataFiltrado(){    
    return this.filtrarMunicipiosSelecionados(await this.getMunicipioEntradaData(), "dscMunicipioDest");
  }

  private getMunicipioMapSpec(municipioData:any, title:string){
    const spec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Mapa dos Munícipios do Ceará",
      title: title,
      data: {
        name: "municipioTopoJson",
        url: "assets/municipio.json",
        format: {type: "topojson", feature: "Munic"}
      },
      name:'municipioMap',
      transform: [
        {
          filter:"datum.properties.uf == 'CE'"
        },
        {
          lookup: "properties.codigo",
          from: {
            data: {
              values: municipioData,
              name:'municipioAgregado'
            }, 
            key: "codMunicipio",
            fields: ["dscMunicipio", "qtdeNotas", "valorTotal", "dscRegiao", "segmento"]
          },
          default: 'NA'
        },
        {calculate: "datum.dscMunicipio!='NA'?datum.qtdeNotas:0", as: "qtdeNotas"},
        {calculate: "datum.dscMunicipio!='NA'?datum.valorTotal:0", as: "valorTotal"}
      ],
      layer:[
        {
          params: [
            {
              name: "highlightMunicipio",
              select: {type: "point", on: "pointerover"}
            },
            {name: "selectMunicipio", select: {type:"point", encodings:['key']}}
          ],
          mark: {type:'geoshape', stroke:'#777', strokeWidth: 0.6},
          title: 'Municípios Emitentes do Ceará',
          projection: {type:'mercator'},
          encoding: {
            key: {field: 'dscMunicipio', type: 'nominal'},
            color: {
              field: 'valorTotal', 
              type:'quantitative', 
              scale: {
                type: 'log',
                domainMin: 100,
                scheme: {name: 'greens', count: 10},
              },
              legend: {title:'Tot. de Notas'}
            },
            fillOpacity: {
              condition: {param: "selectMunicipio", value: 1},
              value: 0
            },
            strokeWidth: {
              condition: [
                {
                  param: "selectMunicipio",
                  empty: false,
                  value: 2
                },
                {
                  param: "highlightMunicipio",
                  empty: false,
                  value: 2
                }
              ],
              value: 0.6
            },    
            tooltip: [
              {field:"dscMunicipio", title: "Município"},
              {field:"qtdeNotas", format:",.0f", title: "Qtde de Notas"},
              {field:"valorTotal", format:",.2f", title: "Total de Notas"}
            ]
          }
        },
        {
          mark: {type:'geoshape', stroke:'#666', strokeWidth: 0.6},
          projection: {type:'mercator'},
          encoding: {
            color: {
              condition: {param:"selectMunicipio", value: null},
              value: "lightgray"
            },
            tooltip: [
              {title: "Município", field:"properties.name"},
            ]
          }
        },              
        {
          mark: {type:'geoshape', stroke:'#666', strokeWidth: 0.6},
          projection: {type:'mercator'},
          encoding: {
            color: {
              condition: {test: "datum['dscMunicipio'] == 'NA'  || datum['valorTotal']==0", value: "lightgray"},
              value: null
            },
            tooltip: [
              {title: "Município", field:"properties.name"},
              {title: "Qtde Notas", field:"qtdeNotas"},
              {title: "Valor Total", field:"valorTotal"}
            ]
          }
        },     
      ],
      height: 600,
      width: 500 
    }
    return spec;
  }

  private getPieChartRegiaoSpec(
    municipioData:any,
    title: string,
    colorField: string
    ){

    const spec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Pie Chart com Porcentagem",
      title: title,
      data: {
        values: municipioData,
        name:"municipioDataPieChart"
      },      
      transform: [
        {filter: {param:"selectBar"}},
        {
          window: [{
            op: "sum",
            field: "valorTotal",
            as: "qtdeNotasRegiao"
          }],
          groupby: [colorField],
          frame: [null, null]
        },
        {
          window: [{
            op: "sum",
            field: "valorTotal",
            as: "valorTotalRegiao"
          }],
          groupby: [colorField],
          frame: [null, null]
        },
        {
          window: [{
            op: "sum",
            field: "valorTotal",
            as: "valorTotalGeral"
          }],
          frame: [null, null]
        },
        {
          calculate: "datum.valorTotalRegiao/datum.valorTotalGeral",
          as: "percentualTotalRegiao"
        }
      ],
      encoding:{
        theta: {field: "valorTotal", aggregate:"sum", type: "quantitative", stack: "normalize", title: "Valor Total"},
        order: {field:"valorTotal", aggregate:"sum", type:"quantitative", sort: "descending"},
        color: {
          field: colorField, 
          type: "nominal", 
          title:"Região", 
          sort:{field:"valorTotal",order:"descending"},
          scale:{domain:['Nordeste','Norte','Sul','Sudeste','Centro-Oeste'], range:['#4c78a8','#f58518', '#e45756', '#72b7b2', '#54a24b']},
        },
        tooltip:[
          {field: colorField, title:"Região"},
          {field: "qtdeNotas", aggregate:'sum', format:',.0f', title:"Qtde Notas"},
          {field: "valorTotal", aggregate:'sum', format:',.2f', title:"Valor Total"},
          {field: "percentualTotalRegiao", aggregate:'min', format:'.0%', title:"Percentual"},
        ]
      },
      layer:[
        {
          params: [
            {
              name: "highlightPie",
              select: {type: "point", on: "pointerover"}
            },
            {name: "selectPie", select: {type:"point", encodings:['color']}}
          ],
          mark: {type: "arc", tooltip: true, outerRadius: 110, stroke:"black"},
          encoding: {
            fillOpacity: {
              condition: {param: "selectPie", value: 1},
              value: 0.6
            },
            strokeWidth: {
              condition: [
                {
                  param: "highlightPie",
                  empty: false,
                  value: 1.5
                },
                {
                  param: "selectPie",
                  empty: false,
                  value: 1.5
                }
              ],
              value: 0
            }
          }
        },
        {
          mark: {type: "text", radius: 95, fill:"black", fontWeight:"bold"},
          encoding: {
            text: {field: "percentualTotalRegiao", aggregate:"min", format:".0%"}
          }
        }
      ],
      width: 300,
      height: 220,    
    }
    return spec;
  }

  private getBarChartSegmentoSpec(
    municipioData:any,
    title: string,
    segmentoField: string
    ){

    const spec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Gráficos de Barras por Segmento Econômico",
      title: title,
      data: {
        values: municipioData,
        name:"municipioDataBarChart"
      },
      transform:[
        {filter:{param:"selectPie"}},
        {
          joinaggregate: [{
            op: "sum",
            field: "valorTotal",
            as: "valorTotalSegmento"
          }],
          groupby: [segmentoField]
        },
        {
          window: [{
            op: "dense_rank",
            as: "rankSegmento"
          }],
          sort:[{field:'valorTotalSegmento', order:'descending'}],
        },
        {
          joinaggregate: [{
            op: "max",
            field: "valorTotalSegmento",
            as: "maxValorTotalSegmento"
          }]
        },
      ],
      encoding: {  
        x: {field: 'valorTotalSegmento', type: 'quantitative', title:'Total de Notas', stack: null},                
        y: {field: segmentoField, type: 'nominal', title:'Segmento', sort:'-x', scale:{paddingOuter:4}},
        key: {field: 'rankSegmento', type:'quantitative'},
      },
      layer:[{
        params: [
          {
            name: "highlightBar",
            select: {type: "point", on: "pointerover"}
          },
          {name: "selectBar", select: {type:"point", encodings:['y']}}
        ],        
        mark: {type:'bar', cornerRadiusEnd: 5, stroke: "black", height: 25},
        encoding: {          
          color: {
            aggregate:'sum', field: 'valorTotal', type: 'quantitative', 
            scale: {type:'quantize', nice:true , scheme: {name: 'blues', count: 12}}, title:'Total'
          },
          fillOpacity: {
            condition: {param: "selectBar", value: 1},
            value: 0.4
          },
          strokeWidth: {
            condition: [
              {
                param: "selectBar",
                empty: false,
                value: 1.5
              },
              {
                param: "highlightBar",
                empty: false,
                value: 1.5
              }
            ],
            value: 0
          },
          tooltip: [
            {field: segmentoField, title: "Segmento Econômico"},
            {aggregate: "sum", field: "qtdeNotas", format:",.0f", title: "Qtde Notas"},
            {aggregate: "sum", field: "valorTotal", format:",.2f", title: "Total de Notas"}
          ],
        }
      },
      {
        mark: {
          type: "text", 
          baseline:"middle", 
          fontWeight:"bold",
          align:"left", 
          xOffset: {expr:"(datum.valorTotalSegmento/datum.maxValorTotalSegmento)>0.6?-35:5"}, 
          aria: false
        },
        encoding: {
          text: {
            field: "valorTotalSegmento", 
            type:"quantitative", 
            format:".2s",
          },
          color:{
            condition:{test:"(datum.valorTotalSegmento/datum.maxValorTotalSegmento)>0.6", value:'white'},
            value:"black"
          }
        },
      }      
      ],
      width: 450        
    }
    return spec;
  }

  private isTipoEmissaoEntrada(){
    return (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_ENTRADA);
  }

  private isTipoEmissaoSaida(){
    return (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA);
  }

  private isMunicipioAtendeFiltro(municipioSegmento: MunicipioSegmento){
    if(this.regiaoSelecionada.length > 0){
      if (this.regiaoSelecionada.includes(this.isTipoEmissaoSaida()?municipioSegmento.dscRegiaoDest:municipioSegmento.dscRegiaoEmit)){
        if (this.segmentoSelecionado.length > 0){
          return this.segmentoSelecionado.includes(this.isTipoEmissaoSaida()?municipioSegmento.segmentoEmit:municipioSegmento.segmentoDest);
        } else {
          return true;
        }
      } else{
        return false;
      }

    } else if (this.segmentoSelecionado.length > 0){
      return this.segmentoSelecionado.includes(this.isTipoEmissaoSaida()?municipioSegmento.segmentoEmit:municipioSegmento.segmentoDest);
    } else {
      return true;
    }
  }

  private async getMunicipioTotalData(){
    let municipioTotalData = [];

    if (this.tipoEmissaoSelecionado == this.TIPO_EMISSAO_SAIDA){
      municipioTotalData = await this.getMunicipioAgregateData('siglaUfEmit','codMunicipioEmit','dscMunicipioEmit');
    } else {
      municipioTotalData = await this.getMunicipioAgregateData('siglaUfDest','codMunicipioDest','dscMunicipioDest');
    }

    return municipioTotalData;
  }

  private async getMunicipioAgregateData(fieldSiglaUF:string, fieldCodMunicipio:string, fieldDscMunicipio:string){
    
    let municipioData = []

    if (this.isTipoEmissaoSaida()){
      municipioData = await this.getMunicipioSaidaData();
    } else {
      municipioData = await this.getMunicipioEntradaData();
    }
    
    let municipioEmitTotal = municipioData.reduce(
      (accumulator: MunicipioTotal[], currentValue: MunicipioSegmento) => {

        let municipio_filter = accumulator.filter((municipioTotal: MunicipioTotal) => {
            return municipioTotal.dscMunicipio==(currentValue as any)[fieldDscMunicipio]
          });

        if (municipio_filter.length > 0){

          municipio_filter[0].qtdeNotas+=(this.isMunicipioAtendeFiltro(currentValue)?currentValue.qtdeNotas:0);
          municipio_filter[0].valorTotal+=(this.isMunicipioAtendeFiltro(currentValue)?currentValue.valorTotal:0);
          municipio_filter[0].valorTotal = Math.round(municipio_filter[0].valorTotal*100)/100
        
        } else if((currentValue as any)[fieldSiglaUF] == 'CE'){

          let municipioTotal: MunicipioTotal = {
            codMunicipio: (currentValue as any)[fieldCodMunicipio], 
            dscMunicipio: (currentValue as any)[fieldDscMunicipio], 
            dscRegiao: (this.regiaoSelecionada.length>0)?this.regiaoSelecionada:['Todas'], 
            segmento: (this.segmentoSelecionado.length>0)?this.segmentoSelecionado:['Todos'],
            qtdeNotas: this.isMunicipioAtendeFiltro(currentValue)?currentValue.qtdeNotas:0,
            valorTotal:Math.round((this.isMunicipioAtendeFiltro(currentValue)?currentValue.valorTotal:0)*100)/100
          };

          accumulator.push(municipioTotal);
        }
        return accumulator;
    }, []);

    return municipioEmitTotal;
  }
}
