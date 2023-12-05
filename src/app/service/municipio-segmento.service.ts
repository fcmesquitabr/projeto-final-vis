import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { MunicipioSegmento } from 'src/util/MunicipioSegmento';
import {lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipioSegmentoService {

  constructor(private httpClient: HttpClient) { 
  }

  async getMunicipioSegmentoEntradaList(){
    const response = await lastValueFrom(this.httpClient.get('assets/municipio_segmento_entrada_interestadual.csv', {responseType: 'text'}));    

    return this.processarCsvMunicipioSegmento(response);
  }

  async getMunicipioSegmentoSaidaList(){
    const response = await lastValueFrom(this.httpClient.get('assets/municipio_segmento_saida_interestadual.csv', {responseType: 'text'}));    

    return this.processarCsvMunicipioSegmento(response);
  }

  private processarCsvMunicipioSegmento(csvText:any){
    let municipioSegmentoList: MunicipioSegmento[] = [];

    let csvToRowArray = csvText.split("\n");
    
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");
      municipioSegmentoList.push(
        new MunicipioSegmento(
          row[0], row[1], row[2], row[3], 
          row[4], row[5], row[6], row[7], 
          row[8], row[9], row[10], row[11], 
          row[12], row[13], 
          parseInt(row[14]), parseFloat(row[15])
        )
      );
    }

    return municipioSegmentoList;
  }

  async getMunicipioDestinario(siglaUfEmitente?:string){
    let municipioSegmentoList = await Promise.resolve(this.getMunicipioSegmentoEntradaList());    
    if(siglaUfEmitente){
      municipioSegmentoList = municipioSegmentoList.filter((value:MunicipioSegmento) => value.siglaUfEmit==siglaUfEmitente);
    }    

    type MunicipioTotal = {COD_MUNICIPIO: string, DSC_MUNICIPIO: any, TOTAL_VLR: number};

    let municipio_dest = municipioSegmentoList.reduce(
      (accumulator: MunicipioTotal[], currentValue: MunicipioSegmento) => {
        let municipio_filter = accumulator.filter((municipio_object: MunicipioTotal) => {
            return municipio_object.DSC_MUNICIPIO==currentValue.dscMunicipioDest
          });

        if (municipio_filter.length > 0){
          municipio_filter[0].TOTAL_VLR+=currentValue.valorTotal;
          municipio_filter[0].TOTAL_VLR = Math.round(municipio_filter[0].TOTAL_VLR*100)/100
        } else if(currentValue.siglaUfDest == 'CE'){
          let segmento_object: MunicipioTotal = {
            COD_MUNICIPIO: currentValue.codMunicipioDest, 
            DSC_MUNICIPIO: currentValue.dscMunicipioDest, 
            TOTAL_VLR:Math.round(currentValue.valorTotal*100)/100
          };
          accumulator.push(segmento_object);
        }
        return accumulator;
    }, []);

    municipio_dest.sort((a,b) => b.TOTAL_VLR - a.TOTAL_VLR)
    return municipio_dest;
  
  }

}
