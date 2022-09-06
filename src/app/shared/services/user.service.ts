import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, pipe} from 'rxjs';

import {IAuthInfo} from '../../_interfaces/IAuthInfo';
import {IApiUser} from '../../_interfaces/IApiUser';
import {AuthResultModel} from '../../models/auth.result.model';
import {UserModel} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {IAuthResponse} from "../../_interfaces/IAuthenticateResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string;
  _user: UserModel;
  public onUserUpdated: EventEmitter<UserModel>;

  constructor(private httpClient: HttpClient) {
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

  register(registerInfor: IAuthInfo) {
    return this.httpClient.post<IAuthResponse>(this.baseUrl + 'register', registerInfor);
  }

  public saveSession(result: AuthResultModel) {
    localStorage.setItem("jwt", result.token);
    localStorage.setItem("refreshToken", result.refreshToken);
    // sessionStorage.setItem('fitableme-user', JSON.stringify(user));
    // this.onUserUpdated.emit(user);
  }

  public isAuth() {
    const loggedUser: UserModel = this.getLoggedUser();
    if (loggedUser === null) {
      return false;
    }
    return true;
  }

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
