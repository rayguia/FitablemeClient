import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/Components/shared/services/error-handler.service';
import { MySubscribersRepositoryService } from '../../shared/services/mysubscribers-repository.service copy';
import { IUserSubscription } from 'src/app/_interfaces/IUserSubscription';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  errorMessage:string = '';
  showStatus:string = '';
  // mySubscribers: IUserSubscription[] = [{
  //   UserSubscriptionId:1,
  //   Price:20,
  //   SubscriptionPeriod:1,
  //   SubscriptionPeriodName:'Monthly',
  //   SubscriptionStatus:1,
  //   SubscriptionStatusName:'Active',
  //   SubscriptionType:1,
  //   SubscriptionTypeName:'All',
  //   SubscriptionId:1,
  //   createdAt:new Date(),
  //   PayDate:new Date(),
  //   UserId:1,
  //   UserPhoto:'foto'

  // }];
  constructor(private repositoryMySubscribers: MySubscribersRepositoryService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    //this.getMySubscriptions();
  }
  onSelectedClicked(status:string){
    console.log('dddddd',status);

    this.showStatus=status;
  }



}
