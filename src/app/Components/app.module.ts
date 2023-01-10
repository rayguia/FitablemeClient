
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { MessageComponent } from './home/message/message.component';
import { OwnerModule } from './owner/owner.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from '../Guards/auth.guard';
import { TokenInterceptorService } from '../Interceptors/token-interceptor.service';
import { NgxStripeModule } from 'ngx-stripe';
import { SettingModule } from './setting/setting/setting.module';
import { AddPaymentComponent } from './setting/add-payment/add-payment.component';
import { PaymentSavedComponent } from './setting/payment-saved/payment-saved.component';




export function tokenGetter() {
  return localStorage.getItem("jwt");
}
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    InternalServerComponent,
    MessageComponent,
    AddPaymentComponent,
    PaymentSavedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CollapseModule.forRoot(),
    OwnerModule,
    DashboardModule,
    AuthModule,
    SettingModule,
    NgSelectModule,
    FormsModule,
    NgxStripeModule.forRoot('pk_test_51LPGp5A8gdNsGmcIoYWTwKIoq4GejbYZPyO5Ze33x9VTht1XSsnNXKJ87D11TbMPUpmkD98nHYHmdW32FLHcCJQG00Z7I6s0r9'),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:3000"],
        disallowedRoutes: []
      }
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),

    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe,AuthGuard,{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
