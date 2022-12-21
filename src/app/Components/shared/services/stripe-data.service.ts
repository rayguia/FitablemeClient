import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
   providedIn: 'root',
})

export class StripeDataService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }
  public getPlans = (route: string) => {
    return this.http.get<any[]>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  }
    createCustomer(data){
    return this.http.post('http://127.0.0.1:8000/api/create-customer',data,this.generateHeaders());
    }

    create_subscription(data) {
        return this.http.post('http://127.0.0.1:8000/api/create-subscription',data,this.generateHeaders());
    }
    public get_payment_method = () => {
      return this.http.get<any[]>(this.createCompleteRoute('payment_method', this.envUrl.urlAddress));
    }
    public delete_payment_method = () => {
      return this.http.delete<any[]>(this.createCompleteRoute('payment_method', this.envUrl.urlAddress));
    }
    public create_payment_method = (pack:any) => {
      return this.http.post<any[]>(this.createCompleteRoute('payment_method', this.envUrl.urlAddress),pack,this.generateHeaders());
    }
    public create_payment_intent = () => {
      return this.http.post<any[]>(this.createCompleteRoute('create_payment_intent', this.envUrl.urlAddress),this.generateHeaders());
    }



    public get_subscription = () => {
      return this.http.get<any[]>(this.createCompleteRoute('subscription', this.envUrl.urlAddress));
    }
    public cancel_subscription = (subscription:any) => {
      return this.http.post<any[]>(this.createCompleteRoute('cancel_subscription', this.envUrl.urlAddress),subscription,this.generateHeaders());
    }
    public renew_subscription = (subscription:any) => {
      return this.http.post<any[]>(this.createCompleteRoute('renew_subscription', this.envUrl.urlAddress),subscription,this.generateHeaders());
    }



    public get_payment_history = () => {
      return this.http.get<any[]>(this.createCompleteRoute('payment', this.envUrl.urlAddress));
    }




  // public getCalculator = (route: string) => {

  //   return this.http.get<ApiResponse>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  // }
  // public createCalculator = (route: string, calculator: Calculator) => {
  //   return this.http.post<Calculator>(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  // }
  // public updateCalculator = (route: string, calculator: Calculator) => {
  //   return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  // }
  // public deleteCalculator = (route: string) => {
  //   return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress),);
  // }
  // public deleteCalculators = (route: string, calculators: Calculator[]) => {

  //   return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), calculators, this.generateHeaders());
  // }
  // public updateCalculatorBills = (route: string, calculatorBill: ICalculatorBills) => {
  //   return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculatorBill, this.generateHeaders());
  // }
  // public deleteCalculatorBill = (route: string) => {
  //   return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
  // }
  // public getDifferentNamesAndProviderNames = (route: string) => {

  //   return this.http.get<ApiResponse>(this.createCompleteRoute(route, this.envUrl.urlAddress));
  // }

  // public markAsSold = (route: string, calculator: Calculator) => {
  //   return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  // }
  // public markAsBought = (route: string, calculator: Calculator) => {
  //   return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), calculator, this.generateHeaders());
  // }
  // public getCalculatorBillsAlltime = (route: string) => {

  //   return this.http.get<ApiResponse>(this.createCompleteRoute(route, this.envUrl.urlAddress));
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
