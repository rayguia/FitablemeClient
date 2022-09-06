import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs';

import {IAuthInfo} from '../../_interfaces/IAuthInfo';
import {IApiUser} from '../../_interfaces/IApiUser';
import {UserModel} from '../../models/user.model';
import {environment} from '../../../environments/environment';

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
    return this.httpClient.post<IApiUser>(this.baseUrl + 'login', authInfo)
      .pipe(map((iApiUser: IApiUser) => {
        const user: UserModel = this.iApiUserToUserModel(iApiUser);
        this._user = user;
        this.saveSession(this._user);
        return this._user;
      }));
  }

  public saveSession(user: UserModel) {
    sessionStorage.setItem('fitableme-user', JSON.stringify(user));
    this.onUserUpdated.emit(user);
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

  public iApiUserToUserModel(iApiUser: IApiUser) {
    return new UserModel(
      iApiUser.UserId,
      iApiUser.Email,
      iApiUser.UserName,
      iApiUser.Gender,
      iApiUser.Photo,
      iApiUser.TimeZone,
      iApiUser.Password,
      iApiUser.Token,
      iApiUser.RefreshToken,
      iApiUser.IsDeleted,
      iApiUser.IsLocked,
      iApiUser.Online,
      iApiUser.Commission,
      iApiUser.Featured,
      iApiUser.AcceptedTerms,
      iApiUser.EmailValidated,
      iApiUser.Role,
      iApiUser.Priority,
    );
  }
}
