import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Owner } from 'src/app/models/owner.model';
import { ISubscriptionShow } from 'src/app/_interfaces/ISubscriptionShow';
import { OwnerForCreation } from 'src/app/_interfaces/ownerforcreation.model';
import { OwnerForUpdate } from 'src/app/_interfaces/ownerforupdate';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class MySubscriptionRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  // public getOwners = (route: string) => {
  //   return this.http.get<Owner[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  // }
  public getMySubscription = (route: string) => {
    return this.http.get<any>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }
  // public createOwner = (route: string, owner: OwnerForCreation) => {
  //   return this.http.post<Owner>(this.createCompleteRoute(route, this.envUrl.urlAddress), owner, this.generateHeaders());
  // }
  // public updateOwner = (route: string, owner: OwnerForUpdate) => {
  //   return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), owner, this.generateHeaders());
  // }
  // public deleteOwner = (route: string) => {
  //   return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  // }
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }
}
