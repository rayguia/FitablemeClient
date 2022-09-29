import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalServerComponent } from './error-pages/internal-server/internal-server.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { AuthGuard } from '../Guards/auth.guard';
import { LoginActiveGuard } from '../Guards/login-active.guard';


const routes: Routes = [


  { path: 'owner', loadChildren: () => import('./owner/owner.module').then(m => m.OwnerModule),canActivate:[AuthGuard] },
  // { path: 'calculator', loadChildren: () => import('./calculator/calculator.module').then(m => m.CalculatorModule),canActivate:[AuthGuard] },
 


  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate:[AuthGuard] },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),canActivate:[LoginActiveGuard]},
  { path: '404', component: NotFoundComponent },
  { path: '500', component: InternalServerComponent },
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
