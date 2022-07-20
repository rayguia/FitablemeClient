import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalComponent } from './modals/error-modal/error-modal.component';
import { SuccessModalComponent } from './modals/success-modal/success-modal.component';
import { AppendDirective } from './directives/append.directive';
import { ModalModule } from 'ngx-bootstrap/modal';




@NgModule({
  declarations: [
    ErrorModalComponent,
    SuccessModalComponent,
    AppendDirective
  ],
  exports:[
    ErrorModalComponent,
    SuccessModalComponent,
    AppendDirective
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ]
})
export class SharedModule { }
