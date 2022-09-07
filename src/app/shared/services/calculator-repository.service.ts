import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calculator } from 'src/app/_interfaces/calculator.model';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorRepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  public getCalculators = (route: string) => {
    return this.http.get<Calculator[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }
  public getCalculator = (route: string) => {

    return this.http.get<Calculator>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }
  public createCalculator = (route: string, calculator: Calculator) => {
    return this.http.post<Calculator>(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  }
  public updateCalculator = (route: string, calculator: Calculator) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  }
  public deleteCalculator = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }
}
