import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MysubscriptionComponent } from './subscription/mysubscription/mysubscription.component';
import { MysubscribersComponent } from './subscription/mysubscribers/mysubscribers.component';


@NgModule({
  declarations: [

    ProfileComponent,
    DashboardComponent,
    SidebarComponent,
    SubscriptionComponent,
    MysubscriptionComponent,
    MysubscribersComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatTabsModule,
    BsDatepickerModule.forRoot()
  ]
})
export class DashboardModule { }
