import { Component } from '@angular/core';
import { UfSegmentoService } from '../service/uf-segmento.service';
import { NotaDiaService } from '../service/nota-dia.service';
import { UfSegmento } from 'src/util/UfSegmento';

import embed from 'vega-embed';

import {TopLevelSpec} from 'vega-lite';
import {changeset} from 'vega'
import { NotaDia } from 'src/util/NotaDia';


@Component({
  selector: 'app-visao-geral',
  templateUrl: './visao-geral.component.html',
  styleUrls: ['./visao-geral.component.css']
})
export class VisaoGeralComponent {

  notaDiaData!: any;
  ufData!: any;
  tipoEmissaoSelecionado: string = 'ENTRADA';

  constructor(private ufSegmentoService: UfSegmentoService, private notaDiaService: NotaDiaService){
    this.generateVisaoGeralDashBoard();
  }

  async generateVisaoGeralDashBoard(){

    if(!this.notaDiaData){
      this.notaDiaData = await this.notaDiaService.getNotaDiaList();
    }

    if(!this.ufData){
      this.ufData = await this.ufSegmentoService.getUfSegmentoList();
    }
    
    const qtdeNotasSpec: TopLevelSpec|any = this.getSpecQtdeNotasEmitidasLineGraph();
    const totalNotasSpec: TopLevelSpec|any = this.getSpecTotalNotasEmitidasLineGraph();
    const ufEmitenteSpec: TopLevelSpec = this.getSpecUfBarGraph("UFs Emitentes","datum.siglaUfEmit!='CE'","siglaUfEmit","dscUfEmit","UfEmit");
    const ufDestinatarioSpec: TopLevelSpec = this.getSpecUfBarGraph("UFs Destinatárias","datum.siglaUfDest!='CE'","siglaUfDest","dscUfDest","UfDest");

    const spec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: "Gráficos de Notas Emitidas ao Longo do Mês.",
      params:[
        {name: "tipoEmissaoSelecionado", value: this.tipoEmissaoSelecionado},
      ],
      vconcat:[
        qtdeNotasSpec, 
        totalNotasSpec,
        {
          hconcat:[ ufEmitenteSpec, ufDestinatarioSpec],
          resolve: {scale:{color:'independent'}}
        }
      ],
      //resolve:{},
      width: 800,
    }
    
    this.createVegaView(spec);
  }

  private createVegaView(spec: TopLevelSpec){

    let view:any = embed('#visao-geral-dashboard', spec);

    view.then((result: any) => {
      this.addDataListenerSelectLineQtdeNotas(result.view);
      this.addDataListenerSelectLineTotalNotas(result.view);
      this.addDataListenerSelectBarEmit(result.view);
      this.addDataListenerSelectBarDest(result.view);
    });
  }

  private getSpecQtdeNotasEmitidasLineGraph(){
    const lineGraphSpec: TopLevelSpec = {
      title: 'Quantidade de Notas Emitidas ao Longo do Mês',
      data: {
        name: "notaDiaDataQtdeNotas",
        values: this.notaDiaData
      },
      transform:[
        {filter:"datum.tipoEmissao!='INTERNA'"},       
        {timeUnit: "date", field: "diaEmissao", as: "diaDoMes"} 
      ],
      layer:[
        {
          params: [
            {
              name: "highlightLineQtdeNotas",
              select: {type: "point", on: "pointerover", encodings:['x','color']}
            },
            {name: "selectLineQtdeNotasFields", select: {type:"point", fields:['diaEmissao','tipoEmissao'], toggle: false}},
            {name: "selectLineQtdeNotasEncodings", select: {type:"point", encodings:['x','color'],toggle: false}},
          ],                  
          mark: {
            type: "point",
            filled: false,
            fill: "white",
          },              
          encoding: {
            x: {timeUnit: "date", field: "diaDoMes", type:'temporal', title:'Dia de Emissão'},          
            y: {aggregate:"sum", field: 'qtdeNotas', type: "quantitative", title:"Total"},
            color: {field: "tipoEmissao", type: "nominal", title: "Tipo de Emissão"},            
            size:{
              condition:[
                {param:"selectLineTotalNotasEncodings", empty: false, value: 160},
                {param:"selectLineQtdeNotasEncodings", empty: false, value: 160},
                {param: "highlightLineTotalNotas", empty: false, value: 160 },
                {param: "highlightLineQtdeNotas", empty: false, value: 160 }
              ],
              value: 70
            },
            strokeOpacity: {
              condition: {
                test:{or:[
                  {and:[{param: "selectLineQtdeNotasEncodings", empty:false}, {param: "selectLineTotalNotasEncodings"}]},
                  {and:[{param: "selectLineQtdeNotasEncodings"}, {param: "selectLineTotalNotasEncodings"}]},
                ]}, 
                value:1
              },
              value: 0.3
            },
            tooltip:[          
              {field:'diaEmissao', type:'temporal', timeUnit: "yearmonthdate", title:'Data de Emissão'},
              {field:'tipoEmissao', type:'nominal', title:'Tipo de Emissão'},
              {aggregate:"sum", field: 'qtdeNotas', type: "quantitative", format:',.0f', title:"Total"}              
            ]
          }          
        },   
        {     
          mark: {
            type: "line",
          },
          encoding: {
            x: {
              timeUnit: "date", field: "diaDoMes", type:'temporal', title:'Dia de Emissão',
              axis:{tickCount:{interval: "day", step:1}}
            },          
            y: {aggregate:"sum", field: "qtdeNotas", type: "quantitative", title:"Qtde de Notas"},
            color: {field: "tipoEmissao", type: "nominal", title: "Tipo de Emissão"},
            strokeOpacity: {                     
              condition: {
                test:{or:[
                  {and:[{param: "selectLineQtdeNotasFields", empty:false}, {param: "selectLineTotalNotasFields"}]},
                  {and:[{param: "selectLineQtdeNotasFields"}, {param: "selectLineTotalNotasFields"}]},
                ]}, 
                value:1
              },
              value: 0.3
            },
          },
        }
      ],
      width: 780,
    } 
    return lineGraphSpec;     
  }

  private getSpecTotalNotasEmitidasLineGraph(){
    const lineGraphSpec: TopLevelSpec = {
      title: 'ValorTotal de Notas Emitidas ao Longo do Mês',
      data: {
        name: "notaDiaDataValorTotal",
        values: this.notaDiaData
      },
      transform:[
        {filter:"datum.tipoEmissao!='INTERNA'"},
        {timeUnit: "date", field: "diaEmissao", as: "diaDoMes"}    
      ],
      layer:[
        {
          params: [
            {
              name: "highlightLineTotalNotas",
              select: {type: "point", on: "pointerover", encodings:['x','color']}
            },
            {name: "selectLineTotalNotasFields", select: {type:"point", fields:['diaEmissao','tipoEmissao'], toggle: false}},
            {name: "selectLineTotalNotasEncodings", select: {type:"point", encodings:['x','color'],toggle: false}},
          ],                  
          mark: {
            type: "point",
            filled: false,
            fill: "white",
          },              
          encoding: {
            x: {timeUnit: "date", field: "diaDoMes", type:'temporal', title:'Dia de Emissão'},          
            y: {aggregate:"sum", field: "valorTotal", type: "quantitative", title:"Valor Total"},
            color: {field: "tipoEmissao", type: "nominal", title: "Tipo de Emissão"},
            
            size:{
              condition:[
                {param:"selectLineTotalNotasEncodings", empty: false, value: 160},
                {param:"selectLineQtdeNotasEncodings", empty: false, value: 160},
                {param: "highlightLineTotalNotas", empty: false, value: 160 },
                {param: "highlightLineQtdeNotas", empty: false, value: 160 }
              ],
              value: 70
            },
            strokeOpacity: {
              condition: {
                test:{or:[
                  {and:[{param: "selectLineTotalNotasEncodings", empty:false}, {param: "selectLineQtdeNotasEncodings"}]},
                  {and:[{param: "selectLineTotalNotasEncodings"}, {param: "selectLineQtdeNotasEncodings"}]},
                ]}, 
                value:1
              },
              value: 0.3
            },
            tooltip:[          
              {field:'diaEmissao', type:'temporal', timeUnit: "yearmonthdate", title:'Data de Emissão'},
              {field:'tipoEmissao', type:'nominal', title:'Tipo de Emissão'},
              {aggregate:"sum", field: "valorTotal", type: "quantitative", format:',.2f', title:"Valor Total"}              
            ]
          }          
        },   
        {     
          mark: {
            type: "line",
          },
          encoding: {
            x: {
              timeUnit: "date", field: "diaDoMes", type:'temporal', title:'Dia de Emissão',
              axis:{
                tickCount:{interval: "day", step:1}
              }
            },          
            y: {aggregate:"sum", field: "valorTotal", type: "quantitative", title:"Qtde de Notas"},
            color: {field: "tipoEmissao", type: "nominal", title: "Tipo de Emissão"},
            strokeOpacity: { 
              condition: {
                test:{or:[
                  {and:[{param: "selectLineTotalNotasFields", empty:false}, {param: "selectLineQtdeNotasFields"}]},
                  {and:[{param: "selectLineTotalNotasFields"}, {param: "selectLineQtdeNotasFields"}]},
                ]}, 
                value:1
              },
              value: 0.3
            },
          },
        }
      ],
      width: 780,
    } 
    return lineGraphSpec;     
  }

  private getSpecUfBarGraph(
    title:string, filterSiglaUf:string,
    yField: string, tooltipDescField:string,
    name:string,
  ){

    const barGraphSpec: TopLevelSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      description: 'Gráfico de Barras de UFs Emitentes/Destinatárias',
      title: title,
      data:{
        name: 'notaDia' + name,
        values: this.notaDiaData
      },
      transform:[
        {
          filter: filterSiglaUf 
        }
      ],
      params: [
        {
          name: "highlightBar" + name,
          select: {type: "point", on: "pointerover"}
        },
        {name: "selectBar" + name, select: {type:"point", encodings:['y'], toggle: false}}
      ],              
      mark: {type:'bar', height: 18, cornerRadiusEnd: 5, stroke: "black"},
      encoding: {
        x: {field: 'valorTotal', aggregate:'sum', type: 'quantitative', title:'Valor Total de Notas'},
        y: {field: yField, type: 'nominal', title:'UF', sort:'-x'},
        color: {field: 'valorTotal', aggregate:'sum', type: 'quantitative', scale: {type:'quantize', nice:true, scheme: {name: 'blues', count: 10}}, title:'Total'},
        fillOpacity: {
          condition: {param: "selectBar"+name, value: 1},
          value: 0.4
        },
        strokeWidth: {
          condition: [
            {
              param: "selectBar" + name,
              empty: false,
              value: 1.5
            },
            {
              param: "highlightBar" +  name,
              empty: false,
              value: 1.5
            }
          ],
          value: 0
        },
        tooltip: [
          {field: tooltipDescField, title: "UF"},
          {field: "qtdeNotas", aggregate:'sum', format:",.0f", title: "Qtde de Notas"},
          {field: "valorTotal", aggregate:'sum', format:",.2f", title: "Valor Total"}
        ]
      },          
      width: 380,
      resolve: {scale:{color:'independent'}}
    }

    return barGraphSpec;
  }

  private addDataListenerSelectLineQtdeNotas(view:any){
    view.addDataListener('selectLineQtdeNotasEncodings_store', (event: any, items: any) => {
      if(items.length > 0){
        let notasDiaFiltradas = this.filtrarNotas(items[0].values[0].getUTCDate());
        this.tipoEmissaoSelecionado = items[0].values[1];
        let changeSetNotaDia = changeset().insert(notasDiaFiltradas).remove((item:NotaDia)=>true);  

        view.change('notaDiaUfEmit', changeSetNotaDia).runAsync();
        view.change('notaDiaUfDest', changeSetNotaDia).runAsync();

      }else{
        this.tipoEmissaoSelecionado = '';
        let changeSetNotaDia = changeset().insert(this.notaDiaData).remove((item:NotaDia)=>true);  

        view.change('notaDiaUfEmit', changeSetNotaDia).runAsync();
        view.change('notaDiaUfDest', changeSetNotaDia).runAsync();
      }
    });
  }

  private addDataListenerSelectLineTotalNotas(view:any){
    view.addDataListener('selectLineTotalNotasEncodings_store', (event: any, items: any) => {
      if(items.length > 0){
        let notasDiaFiltradas = this.filtrarNotas(items[0].values[0].getUTCDate());
        this.tipoEmissaoSelecionado = items[0].values[1];
        let changeSetNotaDia = changeset().insert(notasDiaFiltradas).remove((item:NotaDia)=>true);  

        view.change('notaDiaUfEmit', changeSetNotaDia).runAsync();
        view.change('notaDiaUfDest', changeSetNotaDia).runAsync();

      }else{
        this.tipoEmissaoSelecionado = '';
        let changeSetNotaDia = changeset().insert(this.notaDiaData).remove((item:NotaDia)=>true);  
        
        view.change('notaDiaUfEmit', changeSetNotaDia).runAsync();
        view.change('notaDiaUfDest', changeSetNotaDia).runAsync();
      }
    });
  }

  private addDataListenerSelectBarEmit(view:any){
    view.addDataListener('selectBarUfEmit_store', async (event: any, items: any) => {
      var changeSetNotaDia = null;
      var changeSetUf = null;

      if(items.length > 0){
        let notaDiaFiltrado = this.notaDiaData.filter(
          (item:NotaDia) => (item.siglaUfEmit==items[0].values[0] || item.siglaUfDest==items[0].values[0])
        );

        let ufDataFiltrado = this.ufData.filter(
          (item:UfSegmento) => (item.siglaUfDest==items[0].values[0])
        );

        changeSetUf = changeset().insert(ufDataFiltrado).remove((item:UfSegmento)=>true);
        changeSetNotaDia = changeset().insert(notaDiaFiltrado).remove((item:NotaDia)=>true);  

      } else{
        changeSetUf = changeset().insert(this.ufData).remove((item:UfSegmento)=>true);
        changeSetNotaDia = changeset().insert(this.notaDiaData).remove((item:NotaDia)=>true);  
      }

      view.change('notaDiaUfDest', changeSetUf).runAsync();
      view.change('notaDiaDataQtdeNotas', changeSetNotaDia).runAsync();
      view.change('notaDiaDataValorTotal', changeSetNotaDia).runAsync();
    });    
  }

  private addDataListenerSelectBarDest(view:any){
    view.addDataListener('selectBarUfDest_store', async (event: any, items: any) => {
      var changeSetNotaDia = null;
      var changeSetUf = null;

      if(items.length > 0){
        let notaDiaFiltrado = this.notaDiaData.filter(
          (item:NotaDia) => (item.siglaUfEmit==items[0].values[0] || item.siglaUfDest==items[0].values[0])
        );

        let ufDataFiltrado = this.ufData.filter(
          (item:UfSegmento) => (item.siglaUfEmit==items[0].values[0])
        );

        changeSetUf = changeset().insert(ufDataFiltrado).remove((item:UfSegmento)=>true);
        changeSetNotaDia = changeset().insert(notaDiaFiltrado).remove((item:NotaDia)=>true);  

      } else{
        changeSetUf = changeset().insert(this.ufData).remove((item:UfSegmento)=>true);
        changeSetNotaDia = changeset().insert(this.notaDiaData).remove((item:NotaDia)=>true);  
      }

      view.change('notaDiaUfEmit', changeSetUf).runAsync();
      view.change('notaDiaDataQtdeNotas', changeSetNotaDia).runAsync();
      view.change('notaDiaDataValorTotal', changeSetNotaDia).runAsync();
    });    
  }

  private filtrarNotas(dia: number){
    let notasFiltradas = this.notaDiaData.filter((notaDia: NotaDia)=>{
      return (new Date(notaDia.diaEmissao)).getUTCDate() == dia;
    });

    return notasFiltradas;
  }
}
