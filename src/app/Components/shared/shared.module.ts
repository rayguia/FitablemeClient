import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { SuccessModalComponent } from './modals/success-modal/success-modal.component';
import { AppendDirective } from './directives/append.directive';
import { ModalModule } from 'ngx-bootstrap/modal';


import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { ExportComponent } from './export/export.component';




@NgModule({
  declarations: [
    ErrorModalComponent,
    SuccessModalComponent,
    AppendDirective,
    ConfirmModalComponent,
    HeaderComponent,
    AppendDirective,
    ExportComponent
  ],
  exports:[
    ErrorModalComponent,
    SuccessModalComponent,
    HeaderComponent,
    AppendDirective,
    ExportComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot()

  ]
})
export class SharedModule { }
