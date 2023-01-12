import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private isSubscribed : Subject<boolean>;
  private redirectToSubscribe :Subject<string> = new BehaviorSubject<string>('Subscription');
  constructor() {
    this.isSubscribed = new Subject<boolean>();
    this.redirectToSubscribe = new BehaviorSubject<string>('');
  }
    setSettingTab(redirect: string): void {
    this.redirectToSubscribe.next(redirect);
    }

    getSettingTab(): Observable<string> {
        return this.redirectToSubscribe;
    }
}
