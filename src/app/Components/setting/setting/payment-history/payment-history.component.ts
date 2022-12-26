import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StripeDataService } from 'src/app/Components/shared/services/stripe-data.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit, AfterViewInit {

  @Output() loadingEvent = new EventEmitter<boolean>();
  loading:boolean = false;
  invoices:any[] = []
  constructor(private service:StripeDataService) { }

  ngOnInit(): void {
    this.get_payment_history()
  }
  ngAfterViewInit():void{

  }

  get_payment_history = () => {
    //this.loading = true;
    this.setLoading(true)
    this.service.get_payment_history()
    .subscribe({
      next: (response: any) => {

        this.invoices = response.data.invoices

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

  setLoading(value:boolean){
    this.loading = value
    this.loadingEvent.emit(value);
    //this.cdRef.detectChanges();
   }

}
