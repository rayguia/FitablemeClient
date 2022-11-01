import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ErrorHandlerService } from 'src/app/Components/shared/services/error-handler.service';
import { MySubscribersRepositoryService } from 'src/app/Components/shared/services/mysubscribers-repository.service copy';
import { IUserSubscription } from 'src/app/_interfaces/IUserSubscription';

@Component({
  selector: 'app-mysubscribers',
  templateUrl: './mysubscribers.component.html',
  styleUrls: ['./mysubscribers.component.css']
})
export class MysubscribersComponent implements OnInit {

  @Input() status:string = '';
  errorMessage:string = '';
  mySubscribers: IUserSubscription[];

   loading:boolean = true;

  constructor(private repositoryMySubscribers: MySubscribersRepositoryService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.getMySubscribers(this.status)
  }

  private getMySubscribers = (status) => {
    this.loading = true;
    const apiAddress: string = 'subscribers?status='+status;
    this.repositoryMySubscribers.getMySubscribers(apiAddress)
    .subscribe({
      next: (response: any) => {

        this.mySubscribers = response.data.subscribers;
        // if(response.subscriptions.length){
        //   this.mySubscribers = response.subscriptions[0];
        // }
         this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
          this.loading = false
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

}
