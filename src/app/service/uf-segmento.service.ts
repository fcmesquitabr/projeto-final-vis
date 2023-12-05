import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UfSegmento } from 'src/util/UfSegmento';
import { UfNcm } from 'src/util/UfNcm';
import {lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UfSegmentoService {

  private httpClient: HttpClient;

  uf_dict: any = {
    "AC":"Acre",
    "AL":"Alagoas",
    "AM":"Amazonas",
    "AP":"Amapá",
    "BA":"Bahia",
    "CE":"Ceará",
    "DF":"DF",
    "ES":"Espírito Santo",
    "GO":"Goiás",
    "MA":"Maranhão",
    "MG":"Minas Gerais",
    "MT":"Mato Grosso",
    "MS":"Mato Grosso do Sul",
    "PA":"Pará",
    "PB":"Paraíba",
    "PE":"Pernambuco",
    "PI":"Piauí",
    "PR":"Paraná",
    "RJ":"Rio de Janeiro",
    "RO":"Rondônia",
    "RN":"Rio Grande do Norte",
    "RR":"Roraima",
    "RS":"Rio Grande do Sul",
    "SC":"Santa Catarina",
    "SE":"Sergipe",
    "SP":"São Paulo",
    "TO":"Tocantins"
  };

  constructor(private http: HttpClient){
    this.httpClient = http;
  }

  async getData(){
    let ufSegmentoList: UfSegmento[] = [];
    const response = await lastValueFrom(this.http.get('assets/uf_segmento2.csv', {responseType: 'text'}));

    let csvToRowArray = response.split("\n");
    
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");
      ufSegmentoList.push(new UfSegmento(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], parseInt(row[10]), parseFloat(row[11])));
    }

    return ufSegmentoList;
  }

  async getSegmentoEmitente(){
    const ufSegmentoList = await Promise.resolve(this.getData());
  
    type SegmentoTotal = {SEGMENTO_ECONOMICO: string, TOTAL_VLR: number};

    let segmento_emitente = ufSegmentoList.reduce(
      (accumulator: SegmentoTotal[], currentValue: UfSegmento) => {
        let segmento_filter = accumulator.filter((segmento_object: SegmentoTotal) => {
            return segmento_object.SEGMENTO_ECONOMICO==currentValue.segmentoEmit
          });

        if (segmento_filter.length > 0){
          segmento_filter[0].TOTAL_VLR+=currentValue.valorTotal;
          segmento_filter[0].TOTAL_VLR = Math.round(segmento_filter[0].TOTAL_VLR*100)/100
        } else if(currentValue.siglaUfEmit == 'CE'){
          let segmento_object: SegmentoTotal = {SEGMENTO_ECONOMICO: currentValue.segmentoEmit, TOTAL_VLR:Math.round(currentValue.valorTotal*100)/100};
          accumulator.push(segmento_object);
        }
        return accumulator;
    }, []);

    segmento_emitente.sort((a,b) => b.TOTAL_VLR - a.TOTAL_VLR)
    return segmento_emitente;

  }

  async getSegmentoDestinatario(){
    const ufSegmentoList = await Promise.resolve(this.getData());
  
    type SegmentoTotal = {SEGMENTO_ECONOMICO: string, TOTAL_VLR: number};

    let segmento_dest = ufSegmentoList.reduce(
      (accumulator: SegmentoTotal[], currentValue: UfSegmento) => {
        let segmento_filter = accumulator.filter((segmento_object: SegmentoTotal) => {
            return segmento_object.SEGMENTO_ECONOMICO==currentValue.segmentoDest
          });

        if (segmento_filter.length > 0){
          segmento_filter[0].TOTAL_VLR+=currentValue.valorTotal;
          segmento_filter[0].TOTAL_VLR = Math.round(segmento_filter[0].TOTAL_VLR*100)/100
        } else if(currentValue.siglaUfDest == 'CE'){
          let segmento_object: SegmentoTotal = {SEGMENTO_ECONOMICO: currentValue.segmentoDest, TOTAL_VLR:Math.round(currentValue.valorTotal*100)/100};
          accumulator.push(segmento_object);
        }
        return accumulator;
    }, []);
  
    segmento_dest.sort((a,b) => b.TOTAL_VLR - a.TOTAL_VLR)
    return segmento_dest;
  
  }

  async getUfEmitente(){
    const ufSegmentoList = await Promise.resolve(this.getData());
  
    type UfTotal = {SIGLA_UF: string, NOME_UF: any, TOTAL_VLR: number};

    let segmento_emitente = ufSegmentoList.reduce(
      (accumulator: UfTotal[], currentValue: UfSegmento) => {
        let segmento_filter = accumulator.filter((uf_object: UfTotal) => {
            return uf_object.SIGLA_UF==currentValue.siglaUfEmit
          });

        if (segmento_filter.length > 0){
          segmento_filter[0].TOTAL_VLR+=currentValue.valorTotal;
          segmento_filter[0].TOTAL_VLR = Math.round(segmento_filter[0].TOTAL_VLR*100)/100
        } else if(currentValue.siglaUfEmit != 'CE'){
          let segmento_object: UfTotal = {
            SIGLA_UF: currentValue.siglaUfEmit, 
            NOME_UF: this.uf_dict[currentValue.siglaUfEmit as keyof Object], 
            TOTAL_VLR:Math.round(currentValue.valorTotal*100)/100
          };
          accumulator.push(segmento_object);
        }
        return accumulator;
    }, []);

    segmento_emitente.sort((a,b) => b.TOTAL_VLR - a.TOTAL_VLR)
    return segmento_emitente;
  
  }

  async getUfDestinario(){
    const ufSegmentoList = await Promise.resolve(this.getData());
  
    type UfTotal = {SIGLA_UF: string, NOME_UF: any, TOTAL_VLR: number};

    let segmento_emitente = ufSegmentoList.reduce(
      (accumulator: UfTotal[], currentValue: UfSegmento) => {
        let segmento_filter = accumulator.filter((uf_object: UfTotal) => {
            return uf_object.SIGLA_UF==currentValue.siglaUfDest
          });

        if (segmento_filter.length > 0){
          segmento_filter[0].TOTAL_VLR+=currentValue.valorTotal;
          segmento_filter[0].TOTAL_VLR = Math.round(segmento_filter[0].TOTAL_VLR*100)/100
        } else if(currentValue.siglaUfDest != 'CE'){
          let segmento_object: UfTotal = {
            SIGLA_UF: currentValue.siglaUfDest, 
            NOME_UF: this.uf_dict[currentValue.siglaUfDest as keyof Object], 
            TOTAL_VLR:Math.round(currentValue.valorTotal*100)/100
          };
          accumulator.push(segmento_object);
        }
        return accumulator;
    }, []);

    segmento_emitente.sort((a,b) => b.TOTAL_VLR - a.TOTAL_VLR)
    return segmento_emitente;
  
  }

  async getUfSegmentoList() {
    return Promise.resolve(this.getData());
  }

  async getUfNcmList(){
    let ufNcmList: UfNcm[] = [];
    const response = await lastValueFrom(this.http.get('assets/nota_emit_dest_total_produto_ncm4.csv', {responseType: 'text'}));

    let csvToRowArray = response.split("\n");
    
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split("|");
      let ufNcm: UfNcm = new UfNcm(
        row[0], row[1], row[2], row[3], 
        row[4], row[5], row[6], row[7], 
        row[8], row[9], row[10], row[11], 
        row[12], parseInt(row[13]), parseFloat(row[14]));
      
      let descEmit: string = this.uf_dict[ufNcm.siglaUfEmit as keyof Object];
      let descDest: string = this.uf_dict[ufNcm.siglaUfDest as keyof Object];
      ufNcm.setDscUfEmit(descEmit);
      ufNcm.setDscUfDest(descDest);

      ufNcmList.push(ufNcm);
    }

    return ufNcmList;
  }

  async getUfNcmSaidaList(){    

    let ufNcmList = await this.getUfNcmList();

    let ufNcmSaidaList: UfNcm[] = ufNcmList.filter((ufNcm: UfNcm)=>{
      return ufNcm.isTipoEmissaoSaida();
    });

    return ufNcmSaidaList;
  }

  async getUfNcmEntradaList(){
    let ufNcmList = await this.getUfNcmList();

    let ufNcmEntradaList: UfNcm[] = ufNcmList.filter((ufNcm: UfNcm)=>{
      return ufNcm.isTipoEmissaoEntrada();
    });

    return ufNcmEntradaList;

  }

}
