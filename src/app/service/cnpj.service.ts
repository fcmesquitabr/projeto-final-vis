import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { CnpjEmit } from 'src/util/CnpjEmit';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CnpjService {

  private httpClient: HttpClient;

  constructor(private http: HttpClient){
    this.httpClient = http;
  }

  async getTopCnpjEmitInterestadual(){
    const response = await lastValueFrom(this.http.get('assets/cnpj_emit_interestadual_ranking_filtrado.csv', {responseType: 'text'}));    

    return this.processarCsvTopCnpjEmit(response);
  }

  async getTopCnpjDestInterestadual(){
    const response = await lastValueFrom(this.http.get('assets/cnpj_dest_interestadual_ranking_filtrado.csv', {responseType: 'text'}));    

    return this.processarCsvTopCnpjEmit(response);
  }

  private processarCsvTopCnpjEmit(csvText:any){
    let cnpjEmitList: CnpjEmit[] = [];

    let csvToRowArray = csvText.split("\n");
    
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split("|");

      cnpjEmitList.push(
        new CnpjEmit(
          row[0], row[1], row[2], row[3], 
          row[4], row[5], row[6], row[7], 
          row[8], row[9], row[10], row[11], 
          row[12], row[13], 
          parseInt(row[14]), parseFloat(row[15]),
          parseFloat(row[16]), parseFloat(row[17]),
          parseFloat(row[18]), parseFloat(row[19]),
          parseFloat(row[20]), parseFloat(row[21]),
          parseFloat(row[22]), parseFloat(row[23]),
          parseInt(row[24]), parseInt(row[25]),
          parseInt(row[26]), parseInt(row[27]),
          parseInt(row[28]), parseInt(row[29]),
          parseInt(row[30]), parseInt(row[31])
        )
      );
    }

    return cnpjEmitList;
  }

}
