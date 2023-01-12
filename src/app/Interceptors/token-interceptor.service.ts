import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import {  Observable,of,throwError  } from 'rxjs';
import { UserService } from '../Components/shared/services/user.service';
import { Router } from '@angular/router';
import { SubscriptionService } from '../Components/shared/services/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService, private router:Router,
   private subscriptionService: SubscriptionService) {}


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


        return next.handle(req).pipe( tap((res:any) => {
          console.log('from intercept',res);
          // this.subscriptionService.setSettingTab('Subscription')
          // this.router.navigate(['settings']);
           let obj = this
          if(res.body && res.body.message && res.body.message == 'no subscribed'){
            console.log('entro intercempto to change to subscription',res);
            setTimeout( () => {
              obj.subscriptionService.setSettingTab('Subscription')
              obj.router.navigate(['settings']);
            }, 200);

            return;
          }
        },
        (err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log('from ouside',err);

          if (err.status !== 401) {
            console.log('from inside 401',err);
            return next.handle(req);
          }
          setTimeout( () => {
            this.userService.removeLogged();
            this.router.navigate(['auth/login']);
          }, 200);


          console.log('from navigate auth',err);
          return of(undefined);
        }
      }))

    }


}
