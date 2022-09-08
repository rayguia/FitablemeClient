import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Calculator } from 'src/app/_interfaces/calculator.model';
import { CalculatorRepositoryService } from 'src/app/shared/services/calculator-repository.service';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-calculator-list',
  templateUrl: './calculator-list.component.html',
  styleUrls: ['./calculator-list.component.css']
})
export class CalculatorListComponent implements OnInit {

  calculators: Calculator[] = [];
  errorMessage: string = '';
  bsModalRef?: BsModalRef;
  constructor(private repository: CalculatorRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private modalService:BsModalService) { }

  ngOnInit(): void {
    this.getCalculators();
  }

  private getCalculators = () => {
    const apiAddress: string = 'api/calculator';
    this.repository.getCalculators(apiAddress)
    .subscribe({
      next: (cal: Calculator[]) => this.calculators = cal,
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  openLink(link:string,newPage:boolean){
    console.log("link",link);

    window.open(link, '_blank')
  }
  public getCalculation(calculation:Calculator){


    return calculation.buyAutionAmount + calculation.saleAutionAmount +
     calculation.floorplanAmount + calculation.fixPrice + calculation.transportPrice +
     calculation.taxTitle + calculation.others;

  }
  public getCarculationDetails = (cal:Calculator) => {
    const detailsUrl: string = `/owner/details/${cal.calculatorId}`;
    this.router.navigate([detailsUrl]);
  }
  public redirectToUpdatePage = (cal:Calculator) => {
    const updateUrl: string = `/owner/update/${cal.calculatorId}`;
    this.router.navigate([updateUrl]);
  }
  public redirectToDeletePage = (cal:Calculator) => {
    // const deleteUrl: string = `/calculator/delete/${cal.calculatorId}`;
    // this.router.navigate([deleteUrl]);

    BsModalService
  }
  showModalToDelete(calculator:Calculator){
    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Confirm',
        modalBodyText: `Are you sure you want to remove it?`,
        okButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
    this.bsModalRef.content.deleteConfirmed.subscribe(_ => this.deleteCalculator(calculator));
  }
  deleteCalculator = (calculator:Calculator) => {
    const deleteUri: string = `api/calculator/${calculator.calculatorId}`;
    this.repository.deleteCalculator(deleteUri)
    .subscribe({
      next: (_) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: `Calculator deleted successfully`,
            okButtonText: 'OK'
          }
        };
        this.bsModalRef = this.modalService.show(SuccessModalComponent, config);
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.removeCalculatorFromList(calculator));
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }
  removeCalculatorFromList(calculator:Calculator){
     console.log('after ok button');
     var removeIndex = this.calculators.map(item => item.calculatorId).indexOf(calculator.calculatorId);
         ~removeIndex && this.calculators.splice(removeIndex, 1);

  }

}
