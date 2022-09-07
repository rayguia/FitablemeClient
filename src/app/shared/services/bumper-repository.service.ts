import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarBumperResponse } from 'src/app/_interfaces/carBumperResponse.model';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class BumperRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  public getCarInfoByVin = (route: string) => {
    return this.http.get<any>(this.createCompleteRoute(route, this.envUrl.urlAddress),this.generateHeaders());
  }
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${route}`;
  }
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',

      "partner-token":" 85101e41326541389b13fd478ba676b5",
      "authorization":"Basic MTE0OGQ4YWItNjY5OS00NjRiLTljZDAtYWNlZGRhOGMwNjVl"
    })
    }
  }
}
