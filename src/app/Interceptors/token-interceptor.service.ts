import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import {  Observable,of,throwError  } from 'rxjs';
import { UserService } from '../Components/shared/services/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService, private router:Router) {}


      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userToken = this.userService.getToken();
        // const modifiedReq = req.clone({ 
        //   headers: req.headers.set('Authorization', `Bearer ${userToken}`),
        // });

        if (userToken) {
          req = req.clone({
            setHeaders: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`
            }
          });
        }


        return next.handle(req).pipe( tap(() => {},
        (err: any) => {
        if (err instanceof HttpErrorResponse) {    
          console.log('from ouside',err);
                
          if (err.status !== 401) {
            console.log('from inside 401',err);
            return next.handle(req);
          }
          this.userService.removeLogged(); 
          this.router.navigate(['auth/login']);   
               
          console.log('from navigate auth',err);
          return of(undefined);
        }
      }))
      
    }
    
  
}
