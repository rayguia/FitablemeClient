import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './setting.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxStripeModule } from 'ngx-stripe';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [SettingComponent,PaymentComponent,ProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule,
    NgxStripeModule
  ]
})
export class SettingModule { }
