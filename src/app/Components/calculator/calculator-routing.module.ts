import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CalculatorAlltimebillsComponent } from './calculator-alltimebills/calculator-alltimebills.component';
import { CalculatorListComponent } from './calculator-list/calculator-list.component';
import { CalculatorPageComponent } from './calculator-page/calculator-page.component';
import { CalculatorComponent } from './calculator.component';

const routes: Routes = [
  { path: '', component: CalculatorComponent, children:[
    { path:'list', component: CalculatorListComponent },
    { path: 'alltime', component: CalculatorAlltimebillsComponent },
    { path: 'create', component: CalculatorPageComponent },
    // { path: 'update/:id', component: OwnerUpdateComponent },
    { path: ':id', component: CalculatorPageComponent },
    { path: '', component: CalculatorPageComponent }

  ] }

];

@NgModule({
  imports: [RouterModule.forChild(routes),SharedModule],
  exports: [RouterModule,SharedModule]
})
export class CalculatorRoutingModule { }
