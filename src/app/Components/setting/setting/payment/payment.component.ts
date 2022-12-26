



  import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { StripeService, StripePaymentElementComponent, StripeCardComponent, StripeCardNumberComponent
} from 'ngx-stripe';
import {
  StripeElementsOptions,
  StripeCardCvcElementOptions,
  StripeCardNumberElementOptions,
  PaymentIntent,
  StripeCardElementOptions
} from '@stripe/stripe-js';


import { StripeDataService } from '../../../shared/services/stripe-data.service';
import { outputAst } from '@angular/compiler';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  encapsulation : ViewEncapsulation.None,
})
export class PaymentComponent implements OnInit {


  cardSaved = new FormControl('')
  editCardSaved:boolean = false
  bsModalRef?: BsModalRef;


  @Output() loadingEvent = new EventEmitter<boolean>();
  @Output() actionEvent = new EventEmitter<string>();
  @Input() action;


  loading:boolean = false;

  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  @ViewChild(StripeCardNumberComponent)
  cardNumber: StripeCardNumberComponent;

  @ViewChild(StripeCardComponent) card: StripeCardComponent;


  cardOptions: StripeCardElementOptions = {



        style: {

            base: {
             lineHeight:'20px',
             iconColor: '#666EE8',
             color: '#31325F',
             fontWeight: '300',
             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
             fontSize: '18px',

            '::placeholder': {
            color: '#CFD7E0',
            },
          },
       },
    };
 cardNumberOptions: StripeCardNumberElementOptions ={
  ...this.cardOptions,
    showIcon:true,
    iconStyle:'solid'


 }





  elementsOptions: StripeElementsOptions = {
    locale: 'en',
    appearance:{
     theme:'flat'}
  };

  paying = false;

  plans:any[] = []
  intent:any
  plan:any;
  showIntent:boolean = false
  planAmount: number = 10;

  paymentElementForm = this.fb.group({
    name: ['', [Validators.required]],
    address: ['',[Validators.required]],
    zipcode: ['',[Validators.required]],
    city: ['',[Validators.required]]
  });
  paymentMethod:any = null

  constructor(
    private http: HttpClient,
    private service:StripeDataService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private cdRef : ChangeDetectorRef,
    private modalService:BsModalService,
  ) {}

  ngOnInit() {

    console.log('action from payment',this.action);

    // this.createPaymentIntent(this.paymentElementForm.get('amount').value)
    //   .subscribe(pi => {
    //     this.elementsOptions.clientSecret = pi.client_secret;
    //   });

    this.get_payment_method()
    // this.delete_payment_method();
    // this.getPlans()
  }

  customerID;

  onClickSubmit(data) {
    this.service.createCustomer({ email: data.emailID }).subscribe((res:any) => {
      console.log('res',res);

  this.customerID = res.data.customer.id;
  console.log(this.customerID);
 });}




 PaymentMethodID;
 create_payment_method() : void{
  {

    // this.stripeService.confirmPayment()
    this.stripeService.createPaymentMethod({
       type: 'card',
       card: this.cardNumber.element,
       billing_details:{
        name: this.paymentElementForm.get('name').value,
        address: {
          line1: this.paymentElementForm.get('address').value || '',
          postal_code: this.paymentElementForm.get('zipcode').value || '',
          city: this.paymentElementForm.get('city').value || '',
        }
      },
    }).subscribe((result:any) => {

      this.setLoading(true)

          if (result.paymentMethod) {
             const pack = {
               paymentMethodId: result.paymentMethod.id,
               customerID: this.customerID,
          };// Send the payment method and customer ID to your server
        this.service.create_payment_method(pack).subscribe((res:any) => {
            console.log('res',res);
            this.paymentMethod = res.data.paymentMethod

            this.setPayment()
            //this.cardSaved = res.data.paymentMethod
            //this.loading =false;
            this.setLoading(false)

        });
         console.log(result.paymentMethod.id);
  }   else if (result.error) {
         // Error creating the token
         //this.loading = false
         this.setLoading(false)
         console.log(result.error.message);
      }});}
 }

 create_subscription_with_payment_method_saved(){
        this.setLoading(true)
        const pack = {
          paymentMethodId: this.paymentMethod,
          customerID: this.customerID,
      };// Send the payment method and customer ID to your server
      this.service.create_subscription(pack).subscribe((res) => {
      this.action = ''
      this.actionEvent.emit('subscription done');
      this.setLoading(false)

      console.log('res',res);
      });
 }
 create_subscription(): void {
  this.paymentElementForm.disable()
  this.stripeService.createPaymentMethod({
     type: 'card',
     card: this.cardNumber.element,
     billing_details:{
      name: this.paymentElementForm.get('name').value,
      address: {
        line1: this.paymentElementForm.get('address').value || '',
        postal_code: this.paymentElementForm.get('zipcode').value || '',
        city: this.paymentElementForm.get('city').value || '',
      }
    },
  }).subscribe((result:any) => {
    this.paymentElementForm.enable()
        this.setLoading(true)
        if (result.paymentMethod) {
           const pack = {
             paymentMethodId: result.paymentMethod,
             customerID: this.customerID,
        };// Send the payment method and customer ID to your server
      this.service.create_subscription(pack).subscribe((res) => {
          console.log('res',res);
          this.actionEvent.emit('subscription done');
          //this.action = ''
          //this.get_payment_method()
          //this.setLoading(false)
      });
       console.log(result.paymentMethod.id);
}   else if (result.error) {
       // Error creating the token
       this.setLoading(false)
       console.log(result.error.message);
    }});}


  pay() {
    if (true || this.paymentElementForm.valid) {

      // this.stripeService.confirmCardSetup
      // this.stripeService.confirmSetup
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.paymentElementForm.get('name').value,
              email: this.paymentElementForm.get('email').value,
              address: {
                line1: this.paymentElementForm.get('address').value || '',
                postal_code: this.paymentElementForm.get('zipcode').value || '',
                city: this.paymentElementForm.get('city').value || '',
              }
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        this.paying = false;
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
    } else {
      console.log(this.paymentElementForm);
    }
  }

  private createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `http://127.0.0.1:8000/api/create-payment-intent`,
      { amount }
    );
  }

  private getPlans = () => {
    const apiAddress: string = 'plans';
    this.service.getPlans(apiAddress)
    .subscribe({
      next: (response: any) => {
        this.plans = response.data.plans

        console.log('plans',this.plans);

        // this.dataSource = new MatTableDataSource(this.calculators);
        // this.isLoadingResults =false;
        // this.setupFilters()
      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  CreateIntent = (plan:any) => {
    this.planAmount = plan.price
    const apiAddress: string = `plans/${plan.slug}`;
    this.service.getPlans(apiAddress)
    .subscribe({
      next: (response: any) => {
        this.intent = response.data.intent
        this.elementsOptions.clientSecret = this.intent.client_secret
        this.plan = response.data.plan
        this.showIntent = true

        console.log('response intent',response);

        // this.dataSource = new MatTableDataSource(this.calculators);
        // this.isLoadingResults =false;
        // this.setupFilters()
      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  get_payment_method = () => {
    //this.loading = true;
    this.setLoading(true)
    this.service.get_payment_method()
    .subscribe({
      next: (response: any) => {

        this.paymentMethod = response.data.paymentMethod

        this.setPayment()
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

  delete_payment_method = () => {
    //this.loading = true;
    this.setLoading(true)
    this.service.delete_payment_method()
    .subscribe({
      next: (response: any) => {
        this.get_payment_method();
        console.log('remove payment method',response);
        //this.loading = false;
        //this.setLoading(false)

      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  create_payment_intent = () => {

    let el = this;
    this.paymentElementForm.disable();
    this.service.create_payment_intent()
    .subscribe({
      next: (response: any) => {
        this.intent = response.data.intent
        this.elementsOptions.clientSecret = this.intent.client_secret

        el.stripeService.confirmCardSetup(this.intent.client_secret,

          {
            payment_method: {
              card: this.cardNumber.element,
              billing_details: {
                name: this.paymentElementForm.get('name').value,
                address: {
                  line1: this.paymentElementForm.get('address').value || '',
                  postal_code: this.paymentElementForm.get('zipcode').value || '',
                  city: this.paymentElementForm.get('city').value || '',
                }
              }
            }
          }
          ).subscribe((result:any) => {
          this.paying = false;
          this.editCardSaved = false;
          this.resetFormValues()

          this.setLoading(true)
          console.log('Result', result);
          this.paymentElementForm.enable()
          if (result.error) {
            this.setLoading(false)
            // Show error to your customer (e.g., insufficient funds)
            //alert({ success: false, error: result.error.message });

          } else {

            console.log('save_payment_method',result);
            el.save_payment_method(result)
            // The payment has been processed!
            if (result.status === 'succeeded') {
              // Show a success message to your customer
              alert({ success: true });
            }
          }
        });
        el.showIntent = true

        console.log('response intent',response);

        // this.dataSource = new MatTableDataSource(this.calculators);
        // this.isLoadingResults =false;
        // this.setupFilters()
      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  save_payment_method(paymentIntent:any){

     this.setLoading(true)
    console.log('paymentIntent',paymentIntent.setupIntent
    );

    const pack = {
      paymentMethodId: paymentIntent.setupIntent.payment_method,
      customerID: this.customerID,
    };// Send the payment method and customer ID to your server

    this.service.create_payment_method(pack).subscribe((res:any) => {
      console.log('res',res);
      this.paymentMethod = res.data.paymentMethod
      //this.cardSaved = res.data.paymentMethod

      this.setPayment()

      //this.loading =false;
      this.setLoading(false)

     });


  }
  showModalToDeletePaymentMethod(){

    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Confirm',
        modalBodyText: `Are you sure you want to delete your payment method?`,
        modalBodySubtitle:'This action will unsubscribe you from active subscriptions that use this card. To avoid this, please edit your card information',
        okButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
    this.bsModalRef.content.deleteConfirmed.subscribe(_ => this.delete_payment_method());
  }
  setPayment(){

    if(this.paymentMethod != null){
      this.cardSaved.setValue('XXXX-XXXX-XXXX-'+this.paymentMethod.card.last4)
      this.cdRef.detectChanges();
    }


  }
  setLoading(value:boolean){
    this.loading = value
    this.loadingEvent.emit(value);
   }
   resetFormValues(){
    this.paymentElementForm.reset();
   }





}
