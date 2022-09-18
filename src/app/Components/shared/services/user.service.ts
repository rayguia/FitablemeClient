import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, map, Observable, pipe, take} from 'rxjs';

import {IAuthInfo} from '../../../_interfaces/IAuthInfo';
import {IApiUser} from '../../../_interfaces/IApiUser';
import {AuthResultModel} from '../../../models/auth.result.model';
import {UserModel} from '../../../models/user.model';
import {environment} from '../../../../environments/environment';
import {IAuthResponse} from "../../../_interfaces/IAuthenticateResponse";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string;
  _user: UserModel;
  public onUserUpdated: EventEmitter<UserModel>;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,private router: Router,private jwtHelper: JwtHelperService,
    private http:HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  auth(authInfo: IAuthInfo) {
    return this.httpClient.post<IAuthResponse>(this.baseUrl + 'login', authInfo)
    pipe(map((iApiAuthResponse: IAuthResponse) => {
      const result: AuthResultModel = this.iApiToAuthResponseModel(iApiAuthResponse);
      localStorage.setItem("jwt", result.token);
      localStorage.setItem("refreshToken", result.refreshToken);
    }));
  }
  //New to use
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  setLogged(){
    this.loggedIn.next(true);
  }

  register(registerInfor: IAuthInfo) {
    return this.httpClient.post<IAuthResponse>(this.baseUrl + 'register', registerInfor);
  }
  // setIsLogged(isLogged:boolean){

  //   let result =this.checkIsLogged()
  //   console.log('result',this.isLoggedIn);
  //   console.log('parameter',isLogged);


  //   if(isLogged != result ){
  //     this.loggedIn.next(isLogged);
  //   }

  // }

  public saveSession(result: AuthResultModel) {
    //this.setIsLogged(true)
    this.loggedIn.next(true);
    localStorage.setItem("jwt", result.token);
    localStorage.setItem("refreshToken", result.refreshToken);
    //sessionStorage.setItem('fitableme-user', JSON.stringify(user));
    // this.onUserUpdated.emit(user);
  }

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");                         // {4}
    this.loggedIn.next(false);
    //this.setIsLogged(false)

    this.router.navigate(['/']);
    return false
  }
  isLogged(){


    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)){
      console.log('true');
      // this.loggedIn.subscribe(x => {
      //   if(!x){
      //     this.loggedIn.next(true);
      //   }
      // })

      //this.userService.setIsLogged(true)


      return true;
    }
    console.log('false');
    // this.loggedIn.subscribe(x => {
    //   if(x){
    //     this.loggedIn.next(false);
    //   }
    // })
    //this.loggedIn.next(false);

    return false;
    //const isRefreshSuccess = await this.tryRefreshingTokens(token);
    //if (!isRefreshSuccess) {
      //this.userService.setIsLogged(false)
      //this.router.navigate(["auth/login"]);
        return false;

    //}

    //return isRefreshSuccess;
  }
  private async tryRefreshingTokens(token: string): Promise<boolean> {
    const refreshToken: string = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    }

    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    let isRefreshSuccess: boolean;

    const refreshRes = await new Promise<IAuthResponse>((resolve, reject) => {
      this.http.post<IAuthResponse>("http://localhost:5000/api/token/refresh", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (res: IAuthResponse) => resolve(res),
        error: (_) => { reject; isRefreshSuccess = false;}
      });
    });

    localStorage.setItem("jwt", refreshRes.token);
    localStorage.setItem("refreshToken", refreshRes.refreshToken);
    isRefreshSuccess = true;

    return isRefreshSuccess;
  }

  public isAuth() {
    const loggedUser: UserModel = this.getLoggedUser();
    if (loggedUser === null) {
      return false;
    }
    return true;
  }
  // private checkIsLogged(){

  //   var resutl = false;

  //   this.loggedIn.subscribe(event => resutl = event);

  //   return resutl;


  //      return this.isLoggedIn         // {1}
  //     .pipe(
  //       take(1),                              // {2}
  //       map((isLoggedIn: boolean) => {         // {3}
  //         if (!isLoggedIn){
  //           //this.router.navigate(['/login']);  // {4}
  //           return false;
  //         }
  //         return true;
  //       })
  //     )
  // }

  public getLoggedUser(): UserModel {
    if (this._user) {
      return this._user;
    } else {
      const sessionInfo = sessionStorage.getItem('fitableme-user');
      if (sessionInfo !== null && sessionInfo !== undefined) {
        this._user = Object.setPrototypeOf(JSON.parse(sessionInfo), UserModel.prototype);
        return this._user;
      } else {
        return null;
      }
    }
  }


  public iApiToAuthResponseModel(iApiAuthResponse: IAuthResponse) {
    return new AuthResultModel(
      iApiAuthResponse.success,
      iApiAuthResponse.token,
      iApiAuthResponse.refreshToken
    );
  }
}
