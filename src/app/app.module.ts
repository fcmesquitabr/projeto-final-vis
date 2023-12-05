import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { VisaoGeralComponent } from './visao-geral/visao-geral.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { VisaoMunicipalComponent } from './visao-municipal/visao-municipal.component';
import { VisaoProdutoComponent } from './visao-produto/visao-produto.component';

@NgModule({
  declarations: [
    AppComponent,
    VisaoGeralComponent,
    HeatMapComponent,
    VisaoMunicipalComponent,
    VisaoProdutoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    PanelModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    FieldsetModule,
    DropdownModule
  ],
  providers: [],
  exports:[PanelModule],
  bootstrap: [AppComponent]  
})
export class AppModule { }
