import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { BumperRepositoryService } from 'src/app/shared/services/bumper-repository.service';
import { CalculatorRepositoryService } from 'src/app/shared/services/calculator-repository.service';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Calculator } from 'src/app/_interfaces/calculator.model';
@Component({
  selector: 'app-calculator-page',
  templateUrl: './calculator-page.component.html',
  styleUrls: ['./calculator-page.component.css']
})
export class CalculatorPageComponent implements OnInit {

  calculatorObject: Calculator = this.cleanCalculator()
   maxAmountToOffer:number = 0;
   errorMessage:string = '';

   bsModalRef?: BsModalRef;
  constructor(private repositoryBumper: BumperRepositoryService,
    private repository: CalculatorRepositoryService,
    private datePipe: DatePipe,
    private modal: BsModalService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {

  }
  cleanCalculator():Calculator{
    this.maxAmountToOffer = 0;
  return  this.calculatorObject ={
        calculatorId:0,
        vin: "",
        loteNumber:"",
        autionDate:null,
        year:null,
        make:"",
        model:"",
        type:"Wholesale",
        link:"",
        maxAmountToOffer:0,
        marketValue:0,
        marketValueFinal:0,
        titleType:"Clean Title",
        buyAutionAmount:0,
        buyAutionFeePercent:0,
        buyAutionName: "Copart",
        saleAutionAmount:0,
        saleAutionPercent:0,
        saleAutionName: "",
        floorplanAmount:0,
        earningsAmount:0,
        earningPercent:10,
        fixPrice:0,
        transportPrice:0,
        taxTitle:0,
        others:0
       };


  }
  executeCalculatorCreation = () => {

    this.datePipe.transform(this.calculatorObject.autionDate, 'yyyy-MM-dd');

    const apiUrl = 'api/calculator';
    this.repository.createCalculator(apiUrl, this.calculatorObject)
    .subscribe({
      next: (own: Calculator) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: `Car was saved successfully`,
            okButtonText: 'OK'
          }
        };
        this.cleanCalculator();
        this.bsModalRef = this.modal.show(SuccessModalComponent, config);
        //this.bsModalRef.content.redirectOnOk.subscribe(_ => this.redirectToOwnerList());
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }
  // private saveCalculator = () => {
  //   const apiAddress: string = 'api/calculator';
  //   this.repository.createCalculator(apiAddress,this.calculatorObject)
  //   .subscribe({
  //     next: (cal: Calculator[]) => this.calculators = cal,
  //     error: (err: HttpErrorResponse) => {
  //         this.errorHandler.handleError(err);
  //         this.errorMessage = this.errorHandler.errorMessage;
  //     }
  //   })
  // }
  getCarBumberInfo = (event:any) => {

    this.calculatorObject.vin = this.calculatorObject.vin.trim();
    if(this.calculatorObject.vin.length == 17){
      const apiAddress: string = `http://api.carmd.com/v3.0/decode?vin=${this.calculatorObject.vin}`;
      this.repositoryBumper.getCarInfoByVin(apiAddress)
      .subscribe({
        next: (response: any) => {

         console.log('response',response);
         this.calculatorObject.year = response.data.year;
         this.calculatorObject.make = response.data.make;
         this.calculatorObject.model = response.data.model;

        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })
    }

  }
  changeSalePrice(newValue){
    this.calculatorObject.marketValueFinal = this.calculatorObject.titleType == 'Clean Title' ? this.calculatorObject.marketValue : this.calculatorObject.marketValue * 0.65;


    this.calculatorObject.earningsAmount = this.calculatorObject.marketValueFinal * this.calculatorObject.earningPercent/100;

    var totalLessCopart = this.calculatorObject.marketValueFinal - this.calculatorObject.earningsAmount -
    this.calculatorObject.transportPrice - this.calculatorObject.fixPrice -
    this.calculatorObject.floorplanAmount - this.calculatorObject.taxTitle - this.calculatorObject.others - this.calculatorObject.saleAutionAmount;


    this.calculatorObject.buyAutionFeePercent = this.getPercentCopart(totalLessCopart);
    var differentce = 100 - this.calculatorObject.buyAutionFeePercent;
    this.calculatorObject.buyAutionAmount = Math.round(totalLessCopart * this.calculatorObject.buyAutionFeePercent/100)
    this.maxAmountToOffer =  Math.round(totalLessCopart * differentce/100);
    this.calculatorObject.maxAmountToOffer = this.maxAmountToOffer;
    console.log(this.calculatorObject);



    console.log(newValue);;

  }

  getPercentCopart(amount:number){
    if(this.calculatorObject.buyAutionName == 'Copart'){
      if(amount <= 5000){
        return 15;
      }else if(amount > 5000 && amount <= 7500){
        return amount > 6250 ? 11:13;
      }else if(amount > 7500 && amount <=10000){
        return amount > 87500 ? 9 : 11;
      }else if(amount > 10000 && amount <=12500){
        return amount > 87500 ? 9 : 11;
      }else if(amount > 12500 && amount <=15000){
        return 7.5;
      }else{ return 7}
    }else{
      return 8;
    }
  }
  pasteLoteNumber() {
    navigator.clipboard.readText()
  .then(text => {
    this.calculatorObject.loteNumber = text
    console.log('Pasted content: ', text);
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
   }

   pasteVin() {
    navigator.clipboard.readText()
  .then(text => {
    this.calculatorObject.vin = text
    this.getCarBumberInfo('');
    console.log('Pasted content: ', text);
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
   }

  pasteLink() {
    navigator.clipboard.readText()
  .then(text => {
    this.calculatorObject.link = text
    console.log('Pasted content: ', text);
  })
  .catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
   }


}
