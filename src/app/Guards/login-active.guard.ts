import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../Components/shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginActiveGuard implements CanActivate {


constructor(private router:Router,
  private userService: UserService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.userService.isLogged() && state.url.includes('recover-password')){
         this.userService.logout();
      }
      if(this.userService.isLogged()){
        this.router.navigate(['/dashboard']);
      }
    return true;
  }

}
