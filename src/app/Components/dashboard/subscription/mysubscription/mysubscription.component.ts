import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/Components/shared/services/error-handler.service';
import { MySubscriptionRepositoryService } from 'src/app/Components/shared/services/mysubscription-repository.service';
import { ISubscriptionShow } from 'src/app/_interfaces/ISubscriptionShow';

@Component({
  selector: 'app-mysubscription',
  templateUrl: './mysubscription.component.html',
  styleUrls: ['./mysubscription.component.css']
})
export class MysubscriptionComponent implements OnInit {

  mySubscription:ISubscriptionShow = null;
  errorMessage:string = '';
  constructor(private repository: MySubscriptionRepositoryService,
    private errorHandler: ErrorHandlerService,
    private router: Router) { }

  ngOnInit(): void {
    this.getMySubscriptions()
  }

  private getMySubscriptions = () => {
    const apiAddress: string = 'subscription';
    this.repository.getMySubscription(apiAddress)
    .subscribe({
      next: (response: any) => {
        if(response.data.subscriptions.length){
          this.mySubscription = response.data.subscriptions[0];
        }        
      
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

}
