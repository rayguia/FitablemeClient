import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StripeDataService } from 'src/app/Components/shared/services/stripe-data.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  @Output() loadingEvent = new EventEmitter<boolean>();
  @Output() actionEvent = new EventEmitter<string>();
  loading:boolean = false;
  subscription:any = null;
  upcomingInvoice:any = null
  constructor(private cdRef : ChangeDetectorRef,private service:StripeDataService,private router: Router) { }

  ngOnInit(): void {

    this.get_subscription()
  }


   get_subscription = () => {
    //this.loading = true;
    this.setLoading(true)
    this.service.get_subscription()
    .subscribe({
      next: (response: any) => {

        this.upcomingInvoice = response.data.upcomingInvoice
        this.subscription = response.data.subscription

        console.log('this.subscription',this.subscription);

        //this.cardSaved = response.data.paymentMethod
        console.log('response',response);
        //this.loading = false;
        this.setLoading(false)

      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  cancel_subscription = () => {

    this.setLoading(true)
    this.service.cancel_subscription(this.subscription)
    .subscribe({
      next: (response: any) => {

        this.upcomingInvoice = null
        this.subscription = null

        console.log('response',response);

        this.get_subscription();

      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  renew_subscription = () => {

    this.setLoading(true)
    this.service.renew_subscription(this.subscription)
    .subscribe({
      next: (response: any) => {

        this.upcomingInvoice = null
        this.subscription = null

        console.log('response',response);

        this.get_subscription();

      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }


  subscribe(){
    console.log('subscribe');

  }
  getDate(number:number){
    return number*1000;
  }
  setLoading(value:boolean){
    this.loading = value
    this.loadingEvent.emit(value);
    this.cdRef.detectChanges();
   }


   public redirectToUpdatePage = () => {

    //this.setLoading(true)
    console.log('to subcribe');

    this.actionEvent.emit('subscribe');
    // const updateUrl: string = `subscribe`;
    // this.router.navigate([updateUrl]);
  }


}
