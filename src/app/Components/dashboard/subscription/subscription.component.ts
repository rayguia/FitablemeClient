import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/Components/shared/services/error-handler.service';
import { MySubscribersRepositoryService } from '../../shared/services/mysubscribers-repository.service';
import { IUserSubscription } from 'src/app/_interfaces/IUserSubscription';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  errorMessage:string = '';
  mySubscribers: IUserSubscription[] = [{
    UserSubscriptionId:1,
    Price:20,
    SubscriptionPeriod:1,
    SubscriptionPeriodName:'Monthly',
    SubscriptionStatus:1,
    SubscriptionStatusName:'Active',
    SubscriptionType:1,
    SubscriptionTypeName:'All',
    SubscriptionId:1,
    createdAt:new Date(),
    PayDate:new Date(),
    UserId:1,
    UserPhoto:'foto'
    
  }];
  constructor(private repositoryMySubscribers: MySubscribersRepositoryService,
    private errorHandler: ErrorHandlerService,) { }

  ngOnInit(): void {
    this.getMySubscriptions();
  }
  private getMySubscriptions = () => {
    const apiAddress: string = 'usersubscription';
    this.repositoryMySubscribers.getMySubscribers(apiAddress)
    .subscribe({
      next: (response: any) => {
        // if(response.subscriptions.length){
        //   this.mySubscribers = response.subscriptions[0];
        // }        
      
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }


}
