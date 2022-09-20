import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, map, Observable, pipe, take} from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserModel } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { IAuthInfo } from 'src/app/_interfaces/IAuthInfo';
import { IAuthResponse } from 'src/app/_interfaces/IAuthenticateResponse';
import { AuthResultModel } from 'src/app/models/auth.result.model';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string;
  _user: UserModel;
  public onUserUpdated: EventEmitter<UserModel>;
  private loggedIn = new BehaviorSubject<boolean>(false);

  private _userLogged$: BehaviorSubject<any> =
    new BehaviorSubject<any>({});




    get getLoggedUser$(): Observable<UserModel> { return this._userLogged$.asObservable(); }

    get getLoggedUser(): UserModel { return this._userLogged$.getValue(); }




  constructor(private httpClient: HttpClient,private router: Router,private jwtHelper: JwtHelperService,
    private http:HttpClient, private localService:LocalService) {
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
  // get getLoggedUser() {
  //   return this.userLogged.asObservable(); // {2}
  // }
  setLogged(){
    this.loggedIn.next(true);
  }
  setLoggedUser(user:UserModel){
    this._userLogged$.next(user);
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
    let usr:UserModel = result.user;
    this.setLoggedUser(usr)
    this.localService.setJsonValue('user',usr)

    //localStorage.setItem('session', JSON.stringify(result.user));
    //this.userLogged.next(result.user)
    // this.onUserUpdated.emit(user);
  }

  logout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    this.localService.clearToken()                       // {4}
    this.loggedIn.next(false);
    this.setLoggedUser(null)
    this.router.navigate(['/']);
    return false
  }
  isLogged(){


    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)){
      //this.userLogged.next(this.localService.getJsonValue('user'))
      console.log('user',this.localService.getJsonValue('user'));
      let user = this.localService.getJsonValue('user');
      this._userLogged$.next(user)

      return true;
    }
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    this.localService.clearToken()
    return false;

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

  // public isAuth() {
  //   const loggedUser: UserModel = this.getLoggedUser();
  //   if (loggedUser === null) {
  //     return false;
  //   }
  //   return true;
  // }

  // public getLoggedUser(): UserModel {
  //   if (this._user) {
  //     return this._user;
  //   } else {
  //     const sessionInfo = sessionStorage.getItem('fitableme-user');
  //     if (sessionInfo !== null && sessionInfo !== undefined) {
  //       this._user = Object.setPrototypeOf(JSON.parse(sessionInfo), UserModel.prototype);
  //       return this._user;
  //     } else {
  //       return null;
  //     }
  //   }
  // }


  public iApiToAuthResponseModel(iApiAuthResponse: IAuthResponse) {
    return new AuthResultModel(
      iApiAuthResponse.success,
      iApiAuthResponse.token,
      iApiAuthResponse.refreshToken,
      iApiAuthResponse.user
    );
  }
}
