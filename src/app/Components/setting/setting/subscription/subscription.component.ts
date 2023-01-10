import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { StripeDataService } from 'src/app/Components/shared/services/stripe-data.service';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';

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
  lastInvoice:any = null
  bsModalRef?: BsModalRef;
  today = new Date();
  paymentMethod:any = null
  constructor(
    private cdRef : ChangeDetectorRef,
    private service:StripeDataService,
    private datePipe: DatePipe,
    private router: Router,
    private modalService:BsModalService) { }

  ngOnInit(): void {

    this.get_subscription()
  }

   renewSubscriptionAction(action:string){

      if(this.paymentMethod != null && action == 'renew'){
        this.renew_subscription()
      }else{
        this.redirectToUpdatePage(action)
      }

   }
   get_subscription = () => {
    //this.loading = true;
    this.setLoading(true)
    this.service.get_subscription()
    .subscribe({
      next: (response: any) => {

        this.upcomingInvoice = response.data.upcomingInvoice
        this.subscription = response.data.subscription
        this.lastInvoice = response.data.lastInvoice
        this.paymentMethod = response.data.paymentMethod

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
        this.lastInvoice = null

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

  show_modal_cancel_subscription(){

    //this.datePipe.transform()

    let dateNext = this.datePipe.transform(this.upcomingInvoice.next_payment_attempt*1000, 'MMM d, y h:mm:ss a');
    //let newDate  = moment(this.upcomingInvoice.next_payment_attempt, "DD-MM-YYYY").add(5, 'days');
    let newDate = moment.unix(this.upcomingInvoice.next_payment_attempt).add(1,'days').format("MM/DD/YYYY")
    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Confirm',
        modalBodyText: `Are you sure you want to cancel?`,
        modalBodySubtitle:`If you cancel, your estimates content will be unavailable starting ${newDate}.`,
        okButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
    this.bsModalRef.content.deleteConfirmed.subscribe(_ => this.cancel_subscription());
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


   public redirectToUpdatePage = (action:string) => {

    //this.setLoading(true)
    console.log('to subcribe');

    this.actionEvent.emit(action);
    // const updateUrl: string = `subscribe`;
    // this.router.navigate([updateUrl]);
  }


}
