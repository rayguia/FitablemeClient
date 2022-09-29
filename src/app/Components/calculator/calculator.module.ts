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
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';



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
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
  ]
})
export class CalculatorModule { }
