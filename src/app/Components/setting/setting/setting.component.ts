import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SubscriptionService } from '../../shared/services/subscription.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StripeDataService } from '../../shared/services/stripe-data.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit,AfterViewInit {

  typesOfShoes: string[] = ['Account Info', 'Payment Method','Payment History','Subscription'];
  selectedOption:any = ['']
  action:string = ''

  loading:boolean = true;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private cdRef : ChangeDetectorRef,
    private service:StripeDataService) { }

    async ngOnInit() {
    //this.subscriptionService.setSettingTab('Account Info')

    this.get_user_is_subscribed();
    // let obj = this
    // obj.subscriptionService.getSettingTab().subscribe((result)=>{
    //       console.log('result observable with data 11111111',result);

    //       if(result == 'Subscription'){
    //         console.log('result observable with data 22222222',result);
    //         obj.selectedOption = ['Subscription']
    //         this.cdRef.detectChanges();

    //       }

    // })


    // this.activatedRoute.paramMap.subscribe((params: ParamMap) => {

    //   let action = params.get('action');
    //   console.log('action from seting',action);

    //   if(action == 'subscribe'){
    //     this.action = action
    //     this.selectedOption = ['Payment Method'];

    //   }


    // });
  }


  async ngAfterViewInit(){


//     let obj = this
//     obj.subscriptionService.getSettingTab().subscribe((result)=>{
//       console.log('result observable with data 3333333',result);

//       if(result == 'Subscription'){
//         console.log('result observable with data 4444444',result);
//         obj.selectedOption = ['Subscription']
//         obj.actionChanged('Subscription')
//       }

// })
   }

  loadingChanged(value:boolean){

    this.loading = value
    this.cdRef.detectChanges();
  }
  actionChanged(action:string){

    this.action = action
    if(this.action == 'subscribe' || this.action == 'renew'){
      this.selectedOption = ['Payment Method'];
    }else if(this.action == 'subscription done'){
      this.selectedOption = ['Subscription'];
    }
    this.cdRef.detectChanges();

  }
  selectValue(event:any){
    this.loading =true
    this.action = ''
    console.log('selecValue',event);
    this.cdRef.detectChanges();
  }

  get_user_is_subscribed = () => {
    this.loading = true;
    this.service.get_user_is_subscribed()
    .subscribe({
      next: (response: any) => {

        if(response.data.isSubscribed == false)
        {
          this.selectedOption = ['Subscription'];
        }else{
           this.subscriptionService.getSettingTab().subscribe(result => {
            this.selectedOption = result ? [result] : ['Account Info']
          })

        }
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
          // this.errorHandler.handleError(err);
          // this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }




}
