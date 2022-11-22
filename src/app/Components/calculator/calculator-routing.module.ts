import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculatorListComponent } from './calculator-list/calculator-list.component';
import { CalculatorPageComponent } from './calculator-page/calculator-page.component';
import { CalculatorComponent } from './calculator.component';

const routes: Routes = [
  { path: '', component: CalculatorComponent, children:[
    { path:'list', component: CalculatorListComponent },
    // { path: 'details/:id', component: OwnerDetailsComponent },
    { path: 'create', component: CalculatorPageComponent },
    // { path: 'update/:id', component: OwnerUpdateComponent },
    { path: ':id', component: CalculatorPageComponent },
    { path: '', component: CalculatorPageComponent }

  ] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorRoutingModule { }
