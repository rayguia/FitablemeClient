import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting.component';

const routes: Routes = [
    { path: '', component: SettingComponent, children:[
      { path:'account', component: ProfileComponent },
      { path: 'payment', component: PaymentComponent },
    // { path: 'create', component: CalculatorPageComponent },
    // { path: 'dashboard', component: CalculatorDashboardComponent },
    // { path: ':id', component: CalculatorPageComponent },
    // { path: '', component: CalculatorPageComponent }

  ] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
