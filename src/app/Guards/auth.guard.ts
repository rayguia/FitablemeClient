import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, Observable, take } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { IAuthResponse } from '../_interfaces/IAuthenticateResponse';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private router:Router,
    private userService: UserService){}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    if(!this.userService.isLogged()){
      this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    return true;

  }
}
