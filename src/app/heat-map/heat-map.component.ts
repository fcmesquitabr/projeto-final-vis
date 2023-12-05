import { Component, OnInit } from '@angular/core';

import { UfSegmentoService } from '../service/uf-segmento.service';
import { MunicipioSegmentoService } from '../service/municipio-segmento.service';
import { CnpjService } from '../service/cnpj.service';

import embed from 'vega-embed';
import {TopLevelSpec} from 'vega-lite';

import { UfSegmento } from 'src/util/UfSegmento';

interface Uf {
  sigla: string,
  nome: string
}

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent implements OnInit {

  ufSaidaList: Uf[] = [];
  ufEntradaList: Uf[] = [];
  ufSaidaSelecionada!: Uf;
  ufEntradaSelecionada!: Uf;

  segmentoSaidaList: string[] = [];
  segmentoEntradaList: string[] = [];
  segmentoSaidaSelecionado: string = 'TODOS';
  segmentoEntradaSelecionado: string = 'TODOS';

  dataSetUfSegmentoSaidaDummy: UfSegmento[] = [];
  dataSetUfSegmentoEntradaDummy: UfSegmento[] = [];

  municipioDataSaida!: any;
  municipioDataEntrada!: any;
  cnpjEmitData!: any;
  cnpjDestData!: any;

  heatMapSaidaView!: any;
  heatMapEntradaView!: any;

  constructor(private ufSegmentoService: UfSegmentoService, 
    private municipioSegmentoService: MunicipioSegmentoService, 
    private cnpjService: CnpjService){    
  }

  ngOnInit(): void {

    this.inicializarUfList();
    this.inicializarSegmentoList();

    this.createDataSetCompletoUFSegmentoSaida();
    this.createDataSetCompletoUFSegmentoEntrada();

    this.generateUfSegmentoSaidaHeatMap();
    this.generateTopCnpjEmitenteBarGraph();

    this.generateUfSegmentoEntradaHeatMap();
    this.generateTopCnpjDestinatarioBarGraph();
  }

  private inicializarUfList(){
    this.ufSaidaList = [
      {sigla:"Todas", nome:"Todas"},
      {sigla:"AC", nome:"Acre"}, {sigla:"AL",nome:"Alagoas"},
      {sigla:"AM", nome:"Amazonas"}, {sigla:"AP", nome:"Amapá"},
      {sigla:"BA", nome:"Bahia"}, 
      {sigla:"DF", nome:"DF"}, {sigla:"ES", nome:"Espírito Santo"},
      {sigla:"GO", nome:"Goiás"}, {sigla:"MA", nome:"Maranhão"},
      {sigla:"MG", nome:"Minas Gerais"}, {sigla:"MT", nome:"Mato Grosso"},
      {sigla:"MS", nome:"Mato Grosso do Sul"}, {sigla:"PA", nome:"Pará"},
      {sigla:"PB", nome:"Paraíba"}, {sigla:"PE", nome:"Pernambuco"},
      {sigla:"PI", nome:"Piauí"}, {sigla:"PR", nome:"Paraná"},
      {sigla:"RJ", nome:"Rio de Janeiro"}, {sigla:"RO", nome:"Rondônia"},
      {sigla:"RN", nome:"Rio Grande do Norte"}, {sigla:"RR", nome:"Roraima"},
      {sigla:"RS", nome:"Rio Grande do Sul"}, {sigla:"SC", nome:"Santa Catarina"},
      {sigla:"SE", nome:"Sergipe"}, {sigla:"SP", nome:"São Paulo"},
      {sigla:"TO", nome:"Tocantins"}  
    ];

    this.ufSaidaList.forEach((uf) => {
      this.ufEntradaList.push(uf);
    });
  }

  private inicializarSegmentoList(){
    this.segmentoSaidaList = ['TODOS','ADMINISTRACAO PUBLICA E ORG.INTERNACIONAIS',
    'COMBUSTIVEL', 'COMERCIO ATACADISTA', 'COMERCIO VAREJISTA', 
    'CONSTRUCAO CIVIL', 'ENERGIA ELETRICA', 'INDUSTRIA',
    'PRODUTOR AGROPECUARIO', 'OUTROS SEGMENTOS', 
    'SERVICOS DE COMUNICACAO','SERVICOS DE TRANSPORTE',               
    ];

    this.segmentoSaidaList.forEach((segmento)=>{
      this.segmentoEntradaList.push(segmento);
    })
  }

  trocarUfSaida(event:any){
    this.generateUfSegmentoSaidaHeatMap();
    this.generateTopCnpjEmitenteBarGraph();
  }

  trocarUfEntrada(event:any){
    this.generateUfSegmentoEntradaHeatMap();
    this.generateTopCnpjDestinatarioBarGraph();
  }

  trocarSegmentoSaida(event:any){
    this.generateUfSegmentoSaidaHeatMap();
    this.generateTopCnpjEmitenteBarGraph();
  }

  trocarSegmentoEntrada(event:any){
    this.generateUfSegmentoEntradaHeatMap();
    this.generateTopCnpjDestinatarioBarGraph();
  }

  private createDataSetCompletoUFSegmentoSaida(){
    
    this.ufSaidaList?.forEach((uf) => {
      this.segmentoSaidaList?.forEach((segmento) => {
        if(uf.nome != 'Todas' && segmento != 'TODOS'){
          this.dataSetUfSegmentoSaidaDummy.push(          
              new UfSegmento('CE',uf.sigla,'Ceará',uf.nome,'NE','','Nordeste','',segmento,'',0,0.0)
            );
        }
      });
    });
  }

  private createDataSetCompletoUFSegmentoEntrada(){    
    this.ufSaidaList?.forEach((uf) => {
      this.segmentoSaidaList?.forEach((segmento) => {
        if(uf.nome != 'Todas' && segmento != 'TODOS'){
          this.dataSetUfSegmentoEntradaDummy.push(
            new UfSegmento(uf.sigla,'',uf.nome,'Ceará','','NE','','','',segmento,0,0.0)
          );
        }
      });
    });
  }

  private getSpecHeatMap(
    data:any,
    dataDummy:any,
    title: string,
    xField: string,
    yField: string,
    xAxisTitle: string,
    yAxisTitle: string,
    siglaUfSelecionada: string,
    segmentoSelecionado: string
  ){
    let condicaoFillOpacity:any;// = {param: "selectRect", value: 1} 
    let strokeWidthCondition: any = {and:[{field: xField, equal: siglaUfSelecionada}, {field:yField, equal: segmentoSelecionado}]};
    
    if (siglaUfSelecionada == 'Todas'){
      if (segmentoSelecionado == 'TODOS'){
        condicaoFillOpacity = {param: "selectRect", value: 1};
        strokeWidthCondition = {and:[{field: xField, equal: siglaUfSelecionada}, {field: yField, equal: segmentoSelecionado}]};
      } else{
        condicaoFillOpacity = {test: {field: yField, equal: segmentoSelecionado}, value:1};  
        strokeWidthCondition = {field: yField, equal: segmentoSelecionado};
      }      
    } else {
      if(segmentoSelecionado == 'TODOS'){
        condicaoFillOpacity = {test: {field: xField, equal: siglaUfSelecionada}, value:1};
        strokeWidthCondition = {field: xField, equal: siglaUfSelecionada};
      } else{
        condicaoFillOpacity = {test: {and:[{field: xField, equal: siglaUfSelecionada}, {field: yField, equal: segmentoSelecionado}]}, value:1};
        strokeWidthCondition = {and:[{field: xField, equal: siglaUfSelecionada}, {field: yField, equal: segmentoSelecionado}]};
      }      
    }

    let spec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      title: title,     
      layer:[
        {
          mark: {type:"rect", stroke:'#777'},
          data: {
            name: 'dataSetDummy',
            values: dataDummy,
          },  
          encoding:{
            x: {field: xField, type: "nominal", title: xAxisTitle},
            y: {field: yField, type: "nominal", title: yAxisTitle},        
            color: {value:"#BBB"},
            fillOpacity: {
              value: 0.3
            },    
            strokeOpacity: {
              condition: [
                {
                  param: "highlightRect",
                  empty: false,
                  value: 2
                },                
              ],
              value:0
            },
            tooltip:[
              {field: xField, type: "nominal", title: xAxisTitle},
              {field: yField, type: "nominal", title: yAxisTitle},
              {aggregate: "sum", field: "valorTotal", format:",.2f", title: "Valor Total"},
            ]
          }
        },
        {
          mark: {type:"rect", stroke:'#555'},
          data: {
            name: 'dataSetPrincipal',
            values: data
          },  
          params: [
            {
              name: "highlightRect",
              select: {type: "point", on: "pointerover"}
            },
            {name: "selectRect", select: {type:"point", encodings:['x','y']}}
          ],           
          encoding: {
            x: {field: xField, type: "nominal", title: xAxisTitle},
            y: {field: yField, type: "nominal", title: yAxisTitle},        
            color: {aggregate: "sum", field: "valorTotal", scale:{type:'log'}, title:"Valor Total"},
            fillOpacity: {
              condition: [
                condicaoFillOpacity,
              ],
              value: 0.3
            },    
            strokeWidth: {
              condition: [
                { param: "highlightRect", empty: false, value: 2},
                {
                  test: strokeWidthCondition,
                  value: 2
                }
              ],
              value: 0
            },
            tooltip:[
              {field: xField, type: "nominal", title: xAxisTitle},
              {field: yField, type: "nominal", title: yAxisTitle},
              {aggregate: "sum", field: "valorTotal", format:",.2f", title: "Valor Total"},
            ]
          }              
        }
      ],   
      config: {
        axis: {grid: false, tickBand: "extent"},        
      },             
      width: 800,
      height: 360
    }
    
    return spec;
  }

  async generateUfSegmentoSaidaHeatMap(){

    if(!this.municipioDataSaida){
      this.municipioDataSaida = await this.municipioSegmentoService.getMunicipioSegmentoSaidaList();
    }

    const spec: TopLevelSpec = this.getSpecHeatMap(
      this.municipioDataSaida, this.dataSetUfSegmentoSaidaDummy,
      "Mapa de Calor das Notas de Saída Interestaduais",
      "siglaUfDest", "segmentoEmit",
      "UF Destinatária", "Seg. Econ. Emitemte",
      this.ufSaidaSelecionada.sigla,
      this.segmentoSaidaSelecionado
    )
    this.heatMapSaidaView = embed('#heat-map-saida', spec);

    this.heatMapSaidaView.then((result: any) => {
      result.view.addEventListener('click', (event:any, item:any) => {
        if(item!=null && item.datum!=null){
          this.segmentoSaidaSelecionado = item.datum.segmentoEmit;

          this.ufSaidaList?.forEach((uf:Uf)=>{
            if(uf.sigla == item.datum.siglaUfDest){
              this.ufSaidaSelecionada = uf;
              return;
            }            
          });
        }else{
          this.segmentoSaidaSelecionado = 'TODOS';
          this.ufSaidaSelecionada = {sigla:"Todas", nome:"Todas"};
        }
        this.generateUfSegmentoSaidaHeatMap();
        this.generateTopCnpjEmitenteBarGraph();

      });
    });

  }

  async generateUfSegmentoEntradaHeatMap(){

    if(!this.municipioDataEntrada){
      this.municipioDataEntrada = await this.municipioSegmentoService.getMunicipioSegmentoEntradaList();
    }


    const spec: TopLevelSpec = this.getSpecHeatMap(
      this.municipioDataEntrada, this.dataSetUfSegmentoEntradaDummy,
      "Mapa de Calor das Notas de Entrada Interestaduais",
      "siglaUfEmit", "segmentoDest",
      "UF Emitente", "Seg. Econ. Destinatário",
      this.ufEntradaSelecionada.sigla,
      this.segmentoEntradaSelecionado
    )

    this.heatMapEntradaView = embed('#heat-map-entrada', spec);

    this.heatMapEntradaView.then((result: any) => {
      result.view.addEventListener('click', (event:any, item:any) => {
        if(item!=null && item.datum!=null){
          this.segmentoEntradaSelecionado = item.datum.segmentoDest;

          this.ufEntradaList?.forEach((uf:Uf)=>{
            if(uf.sigla == item.datum.siglaUfEmit){
              this.ufEntradaSelecionada = uf;
              return;
            }            
          });
        }else{
          this.segmentoEntradaSelecionado = 'TODOS';
          this.ufEntradaSelecionada = {sigla:"Todas", nome:"Todas"};
        }
        this.generateUfSegmentoEntradaHeatMap();
        this.generateTopCnpjDestinatarioBarGraph();

      });
    });

  }

  async generateTopCnpjDestinatarioBarGraph(){
    if(!this.cnpjDestData){
      this.cnpjDestData = await this.cnpjService.getTopCnpjDestInterestadual();
    }

    const spec: TopLevelSpec = this.getSpecTopCnpj(this.cnpjDestData, this.ufEntradaSelecionada.sigla, this.segmentoEntradaSelecionado);
    const view = embed('#top-cnpj-dest', spec);    
  }

  async generateTopCnpjEmitenteBarGraph(){

    if(!this.cnpjEmitData){
      this.cnpjEmitData = await this.cnpjService.getTopCnpjEmitInterestadual();
    }

    const spec: TopLevelSpec = this.getSpecTopCnpj(this.cnpjEmitData, this.ufSaidaSelecionada.sigla, this.segmentoSaidaSelecionado);
    const view = embed('#top-cnpj-emit', spec);
  }

  private getSpecTopCnpj(
    data:any, 
    siglaUfSelecionada: string,
    segmentoSelecionado: string
  ){

    let fieldTotalName: string = '';
    let fieldRankingName: string = '';
    let filterTransform: string = '';
    let tooltipUfValueExpr: string = '"Todas"';
    
    if (siglaUfSelecionada == 'Todas'){
      tooltipUfValueExpr = '"Todas"';
      if (segmentoSelecionado == 'TODOS'){
        fieldTotalName = 'valorTotalCnpj';
        fieldRankingName = 'rankingGeral';
        filterTransform = "datum.rankingGeral<=15";        
      } else{
        fieldTotalName = 'valorTotalCnpjSegmento';
        fieldRankingName = 'rankingSegmento';
        filterTransform = "datum.rankingSegmento<=15 && datum.segmento=='"+segmentoSelecionado+"'";
      }      
    } else {
      tooltipUfValueExpr = '"' + siglaUfSelecionada + '"';
      if(segmentoSelecionado == 'TODOS'){
        fieldTotalName = 'valorTotalCnpjUf';
        fieldRankingName = 'rankingUf';
        filterTransform = "datum.rankingUf<=15 && datum.siglaUfDest=='"+siglaUfSelecionada+"'";
      } else{
        fieldTotalName = 'valorTotalCnpjUfSegmento';
        fieldRankingName = 'rankingUfSegmento';
        filterTransform = 'datum.rankingUfSegmento<=15 && datum.siglaUfDest=="'+siglaUfSelecionada + '" && datum.segmento=="'+segmentoSelecionado+'"';
      }      
    }

    
    const spec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      title: "Top CNPJs Emitentes",
      data: {values: data},      
      transform:[
        {
          filter: filterTransform
        },
        {
          calculate: tooltipUfValueExpr, as:'tooltipUfValue'
        }
      ],
      params: [
        {
          name: "highlightBar",
          select: {type: "point", on: "pointerover"}
        },
        {name: "selectBar", select: {type:"point", encodings:['y']}}
      ],        
      mark: {type:'bar', height: 20, cornerRadiusEnd: 5, stroke: "black"},
      encoding: {
        x: {field: fieldTotalName, aggregate:'max',type: 'quantitative', title:'Total de Notas Emitidas'},
        y: {field: 'codCnpj', type: 'nominal', title:'CNPJ', sort:'-x', scale:{paddingOuter:2}},
        color: {field: fieldTotalName, aggregate:'max', type: 'quantitative', scale: {type:'quantile', scheme: {name: 'blues', count: 10}}, title:'Total'},
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
          {field: "codCnpj", title: "CNPJ"},
          {field: "descMunicipio", title: "Município"},
          {field: "segmento", title: "Segmento"},
          {field: fieldRankingName, title: "Ranking"},
          {field: fieldTotalName, aggregate:'max',format:",.2f", title: "Valor Total Emitido"}
        ],
      },
      width: 700
    }

    return spec;
  }
}
