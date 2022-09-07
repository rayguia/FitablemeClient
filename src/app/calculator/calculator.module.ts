import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculatorRoutingModule } from './calculator-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalculatorPageComponent } from './calculator-page/calculator-page.component';
import { CalculatorListComponent } from './calculator-list/calculator-list.component';
import { TabsModule } from 'ngx-bootstrap/tabs';


import { AccordionModule } from 'ngx-bootstrap/accordion';


@NgModule({
  declarations: [
    CalculatorPageComponent,
    CalculatorListComponent
  ],
  imports: [
    CommonModule,
    CalculatorRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    FormsModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
  ]
})
export class CalculatorModule { }
