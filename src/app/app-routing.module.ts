import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { AuthGuard } from './Guards/auth.guard';
import {HomeComponent} from "./home/home.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {RecoverPassswordComponent} from "./recover-passsword/recover-passsword.component";
import { LoginActiveGuard } from './Guards/login-active.guard';


const routes: Routes = [
  // {
  //   path: 'home', loadChildren: () =>
  //     import('./home/home.module').then(m => m.HomeModule)
  // },
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '', component:HomeComponent,canActivate:[AuthGuard]},

  { path: 'owner', loadChildren: () => import('./owner/owner.module').then(m => m.OwnerModule),canActivate:[AuthGuard] },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[AuthGuard] },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),canActivate:[LoginActiveGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'recover-password', component: RecoverPassswordComponent },
  { path: '404', component: NotFoundComponent },
  { path: '500', component: InternalServerComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
