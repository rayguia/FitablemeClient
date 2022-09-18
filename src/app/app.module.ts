import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
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
import { OwnerModule } from './owner/owner.module';
import { AuthGuard } from './Guards/auth.guard';
import { AuthModule } from './auth/auth.module';
import { MessageComponent } from './home/message/message.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';


export function tokenGetter() {
  return localStorage.getItem("jwt");
}
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    InternalServerComponent,
    MessageComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CollapseModule.forRoot(),
    OwnerModule,
    DashboardModule,
    AuthModule,
    NgSelectModule,
    FormsModule,

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
    NgxSpinnerModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
