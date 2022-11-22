import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/_interfaces/ApiResponse';
import { Calculator } from 'src/app/_interfaces/calculator.model';
import { ICalculatorBills } from 'src/app/_interfaces/ICalculatorBills';
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

    return this.http.get<ApiResponse>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }
  public createCalculator = (route: string, calculator: Calculator) => {
    return this.http.post<Calculator>(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  }
  public updateCalculator = (route: string, calculator: Calculator) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  }
  public deleteCalculator = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress),);
  }
  public deleteCalculators = (route: string, calculators: Calculator[]) => {

    return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), calculators, this.generateHeaders());
  }
  public updateCalculatorBills = (route: string, calculatorBill: ICalculatorBills) => {
    return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculatorBill, this.generateHeaders());
  }
  public deleteCalculatorBill = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}${route}`;
  }
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }
}
