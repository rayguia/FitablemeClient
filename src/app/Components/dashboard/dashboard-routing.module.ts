import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SubscriptionComponent } from './subscription/subscription.component';


const routes: Routes = [
  { path:'', component: DashboardComponent, children:[
    { path:'profile', component: ProfileComponent },
    { path:'subscription', component: SubscriptionComponent }

  ] },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
