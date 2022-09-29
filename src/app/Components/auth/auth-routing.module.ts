import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPassswordComponent } from './recover-passsword/recover-passsword.component';
import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { AuthComponent } from './auth/auth.component';


const routes: Routes = [
  {path:'',component:AuthComponent, children:[
    { path:'login', component: LoginComponent },
    { path:'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'recover-password', component: RecoverPassswordComponent },
  ]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
