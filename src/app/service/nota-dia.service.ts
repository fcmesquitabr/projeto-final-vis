import { Injectable } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { NotaDia } from 'src/util/NotaDia';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotaDiaService {

  private httpClient: HttpClient;

  constructor(private http: HttpClient){
    this.httpClient = http;
  }

  async getNotaDiaList(){
    const response = await lastValueFrom(this.http.get('assets/notas_dia2.csv', {responseType: 'text'}));    

    return this.processarCsvNotaDia(response);
  }

  private processarCsvNotaDia(csvText:any){
    let notaDiaList: NotaDia[] = [];

    let csvToRowArray = csvText.split("\n");
    
    for (let index = 1; index < csvToRowArray.length - 1; index++) {
      let row = csvToRowArray[index].split(",");

      notaDiaList.push(
        new NotaDia(
          row[0], row[1], row[2], row[3], 
          row[4], row[5], row[6], row[7], 
          row[8], row[9], row[10], row[11], 
          parseInt(row[12]), parseFloat(row[13])
        )
      );
    }

    return notaDiaList;
  }
  
}
