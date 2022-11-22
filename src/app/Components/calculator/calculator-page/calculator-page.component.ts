import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ApiResponse } from 'src/app/_interfaces/ApiResponse';


import { Calculator } from 'src/app/_interfaces/calculator.model';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';
import { BumperRepositoryService } from '../../shared/services/bumper-repository.service';
import { CalculatorRepositoryService } from '../../shared/services/calculator-repository.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';

@Component({
  selector: 'app-calculator-page',
  templateUrl: './calculator-page.component.html',
  styleUrls: ['./calculator-page.component.css']
})
export class CalculatorPageComponent implements OnInit {

   calculatorObject: Calculator = this.cleanCalculator()
   maxAmountToOffer:number = 0;
   errorMessage:string = '';
   calculatorIdToShow:number;
   showBills:boolean = false;


   bsModalRef?: BsModalRef;
  constructor(private repositoryBumper: BumperRepositoryService,
    private repository: CalculatorRepositoryService,
    private datePipe: DatePipe,
    private modal: BsModalService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }


  ngOnInit(): void {
    this.showBills = false;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.calculatorIdToShow = +params.get('id');
      this.getCalculator();
    });
  }

  getCalculator(){

    if(this.calculatorIdToShow){
      this.showBills = false
      const apiUrl = `calculator/${this.calculatorIdToShow}`;
        this.repository.getCalculator(apiUrl)
        .subscribe({
          next: (response: ApiResponse) => {
            this.calculatorObject = response.data
            this.changeSalePrice(1)
            this.showBills = true
          },
          error: (err: HttpErrorResponse) => {
              this.errorHandler.handleError(err);
              this.errorMessage = this.errorHandler.errorMessage;
          }
        })
    }

  }


  cleanCalculator():Calculator{
    this.maxAmountToOffer = 0;
  return  this.calculatorObject ={
        id:0,
        vin: "",
        loteNumber:"",
        autionDate:null,
        year:null,
        make:"",
        model:"",
        serie:"",
        saleType:"Retail",
        link:"",
        maxAmountToOffer:0,
        marketValue:0,
        marketValueFinal:0,
        titleType:"Salvage",
        buyAutionAmount:0,
        buyAutionFeePercent:0,
        buyAutionName: "IAAI",
        saleAutionAmount:0,
        saleAutionPercent:0,
        saleAutionName: "",
        floorplanAmount:0,
        earningsAmount:0,
        earningPercent:10,
        fixPrice:0,
        transportPrice:350,
        taxTitle:400,
        others:0,
        purchased:false,
        purchasedValueNoFees:0,
        purchasedValueFinal:0,
        soldValue:0,
        calculatorBills:[]
       };


  }




  executeCalculatorCreation = () => {

    this.datePipe.transform(this.calculatorObject.autionDate, 'yyyy-MM-dd');

    const apiUrl = 'calculator';
    this.repository.createCalculator(apiUrl, this.calculatorObject)
    .subscribe({
      next: (response: any) => {
        const config: ModalOptions = {
          initialState: {
            modalHeaderText: 'Success Message',
            modalBodyText: `Car was saved successfully`,
            okButtonText: 'OK'
          }
        };
        console.log(response.data);
        this.router.navigate([`/calculator/${response.data.id}`]);
        this.calculatorObject = response.data
        //this.cleanCalculator();
        //this.bsModalRef = this.modal.show(SuccessModalComponent, config);
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
  openNewTab(type:string){
    let url ="";
    switch (type) {
      case 'offerup':
        url ="https://offerup.com/search?q="+this.calculatorObject.year+"+"+this.calculatorObject.make+"+"+this.calculatorObject.model
        break;
      case 'ebay':
        url ="https://www.ebay.com/sch/i.html?_nkw="+this.calculatorObject.year+"+"+this.calculatorObject.make+"+"+this.calculatorObject.model
        break;

      case 'vincheck':

        url ="https://vincheck.info/check/vin-check.php"
        break;
      case 'kbb':
        url ="https://www.kbb.com/"+this.calculatorObject.make+"/"+this.calculatorObject.model+"/"+this.calculatorObject.year

        //https://www.kbb.com/dodge/challenger/2021
      break;
      default:
        url ="https://offerup.com/search?q="+this.calculatorObject.year+"+"+this.calculatorObject.make+"+"+this.calculatorObject.model
        break;
    }
    window.open(url, '_blank').focus();
  }
  getCarBumberInfo = (event:any) => {

    this.calculatorObject.vin = this.calculatorObject.vin.trim();
    if(this.calculatorObject.vin.length == 17){

      //const apiAddress: string = `http://api.carmd.com/v3.0/decode?vin=${this.calculatorObject.vin}`;

      const apiAddress: string = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${this.calculatorObject.vin}?format=json`;
      this.repositoryBumper.getCarInfoByVin(apiAddress)
      .subscribe({
        next: (response: any) => {

         console.log('response',response);


         var yearMakeModelArray = response.Results.filter(x => x.Variable === 'Make' || x.Variable == 'Model'
                                                        || x.Variable == 'Model Year' || x.Variable == 'Series');

         console.log(yearMakeModelArray);



         this.calculatorObject.year = yearMakeModelArray.find(x => x.Variable == 'Model Year').Value;
         this.calculatorObject.make = yearMakeModelArray.find(x => x.Variable == 'Make').Value
         this.calculatorObject.model = yearMakeModelArray.find(x => x.Variable == 'Model').Value
         this.calculatorObject.serie = yearMakeModelArray.find(x => x.Variable == 'Series').Value


        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })
    }

  }
  changeSalePrice(newValue){

    console.log('this.calculatorObject from calculator-page',this.calculatorObject);

    if(this.calculatorObject.marketValue > 0){
      this.calculatorObject.marketValueFinal = this.calculatorObject.titleType == 'Clean Title' ? this.calculatorObject.marketValue : this.calculatorObject.marketValue * 0.65;


    this.calculatorObject.earningsAmount = this.calculatorObject.marketValueFinal * this.calculatorObject.earningPercent/100;

    var totalLessCopart = this.calculatorObject.marketValueFinal - this.calculatorObject.earningsAmount -
    this.calculatorObject.transportPrice - this.calculatorObject.fixPrice -
    this.calculatorObject.floorplanAmount - this.calculatorObject.taxTitle - this.calculatorObject.others - this.calculatorObject.saleAutionAmount;

    if(this.calculatorObject.buyAutionName == 'Copart')
    {
      this.calculatorObject.buyAutionFeePercent = this.getPercentCopart(totalLessCopart);
    var differentce = 100 - this.calculatorObject.buyAutionFeePercent;
    this.calculatorObject.buyAutionAmount = Math.round(totalLessCopart * this.calculatorObject.buyAutionFeePercent/100)
    this.maxAmountToOffer =  Math.round(totalLessCopart * differentce/100);
    this.calculatorObject.maxAmountToOffer = this.maxAmountToOffer;
    console.log(this.calculatorObject);
    }else{

      //var differentce = 100 - this.calculatorObject.buyAutionFeePercent;
      let firstAtt = this.getTotalAmountIAAI(totalLessCopart)
      let toSecondAtt = totalLessCopart - firstAtt;
      let secondAtt = this.getTotalAmountIAAI(toSecondAtt)

      let totherAtt = totalLessCopart - secondAtt;
      let therAtt = this.getTotalAmountIAAI(totherAtt)

      // let totquaterAtt = totalLessCopart - therAtt;
      // let quaterAtt = this.getTotalAmountIAAI(totquaterAtt)

      let amountToPayIAAI = Math.round((firstAtt + secondAtt + therAtt) / 3)

      this.calculatorObject.buyAutionAmount = amountToPayIAAI
      this.maxAmountToOffer =  totalLessCopart - amountToPayIAAI;
      this.calculatorObject.maxAmountToOffer = this.maxAmountToOffer;

      let oneHundredPercent = totalLessCopart + amountToPayIAAI;
      this.calculatorObject.buyAutionFeePercent = amountToPayIAAI * 100 / oneHundredPercent
      console.log(this.calculatorObject);
    }




    console.log(newValue);;

  }

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
      let percent = this.getTotalAmountIAAI(amount)
      console.log('percent iiai calculated',percent);
        return percent;
        //return 18.2;
    }
  }

  getTotalAmountIAAI(amount:number){
    let serviceFee = 79;
    let enviromentFee = 10;
    let brachPay = 20;
    let bidderFee = 0;
    let iaaiFees = 0;
    let highVolumeAccount = false;
    if(amount >= 100 && amount < 500){
      bidderFee = 39;
    }else if(amount >= 500 && amount < 1000){
      bidderFee = 49;
    }else if(amount >= 1000 && amount < 1500){
      bidderFee = 69;
    }else if(amount >= 1500 && amount < 2000){
      bidderFee = 79;
    }else if(amount >= 2000 && amount < 4000){
      bidderFee = 89;
    }else if(amount >= 4000 && amount < 6000){
      bidderFee = 99;
    }else if(amount >= 6000 && amount < 8000){
      bidderFee = 119;
    }else{
      bidderFee = 129;
    }


    if(amount < 50){
      iaaiFees = highVolumeAccount ? 1 : 25
    }else if(amount >=50 && amount < 100){
      iaaiFees = highVolumeAccount ? 1 : 45;
    }else if(amount >=100 && amount < 200){
      iaaiFees = highVolumeAccount ? 25 : 80;
    }else if(amount >=200 && amount < 300){
      iaaiFees = highVolumeAccount ? 50 : 120;
    }else if(amount >=300 && amount < 400){
      iaaiFees = highVolumeAccount ? 75 : 120;
    }else if(amount >=400 && amount < 500){
      iaaiFees = highVolumeAccount ? 120 : 170;
    }else if(amount >=500 && amount < 550){
      iaaiFees = highVolumeAccount ? 135 : 195;
    }else if(amount >=550 && amount < 600){
      iaaiFees = highVolumeAccount ? 145 : 195;
    }else if(amount >=600 && amount < 700){
      iaaiFees = highVolumeAccount ? 155 : 225;
    }else if(amount >=700 && amount < 800){
      iaaiFees = highVolumeAccount ? 170 : 245;
    }else if(amount >=800 && amount < 900){
      iaaiFees = highVolumeAccount ? 185 : 265;
    }else if(amount >=900 && amount < 1000){
      iaaiFees = highVolumeAccount ? 200 : 290;
    }else if(amount >=1000 && amount < 1100){
      iaaiFees = highVolumeAccount ? 215 : 340;
    }else if(amount >=1100 && amount < 1200){
      iaaiFees = highVolumeAccount ? 230 : 355;
    }else if(amount >=1200 && amount < 1300){
      iaaiFees = highVolumeAccount ? 245 : 370;
    }else if(amount >=1300 && amount < 1400){
      iaaiFees = highVolumeAccount ? 260 : 385;
    }else if(amount >=1400 && amount < 1500){
      iaaiFees = highVolumeAccount ? 275 : 400;
    }else if(amount >=1500 && amount < 1600){
      iaaiFees = highVolumeAccount ? 290 : 415;
    }else if(amount >=1600 && amount < 1700){
      iaaiFees = highVolumeAccount ? 300 : 430;
    }else if(amount >=1700 && amount < 1800){
      iaaiFees = highVolumeAccount ? 310 : 445;
    }else if(amount >=1800 && amount < 2000){
      iaaiFees = highVolumeAccount ? 325 : 460;
    }else if(amount >=2000 && amount < 2200){
      iaaiFees = highVolumeAccount ? 340 : 480;
    }else if(amount >=2200 && amount < 2400){
      iaaiFees = highVolumeAccount ? 350 : 495;
    }else if(amount >=2400 && amount < 2600){
      iaaiFees = highVolumeAccount ? 360 : 510;
    }else if(amount >=2600 && amount < 2800){
      iaaiFees = highVolumeAccount ? 375 : 525;
    }else if(amount >=2800 && amount < 3000){
      iaaiFees = highVolumeAccount ? 400 : 550;
    }else if(amount >=3000 && amount < 3500){
      iaaiFees = highVolumeAccount ? 450 : 650;
    }else if(amount >=3500 && amount < 4000){
      iaaiFees = highVolumeAccount ? 500 : 700;
    }else if(amount >=4000 && amount < 4500){
      iaaiFees = highVolumeAccount ? 600 : 725;
    }else if(amount >=4500 && amount < 5000){
      iaaiFees = highVolumeAccount ? 625 : 750;
    }else if(amount >=5000 && amount < 6000){
      iaaiFees = highVolumeAccount ? 650 : 775;
    }else if(amount >=6000 && amount < 7000){
      iaaiFees = highVolumeAccount ? 675 : 800;
    }else if(amount >=7000 && amount < 8000){
      iaaiFees = highVolumeAccount ? 700 : 825;
    }else if(amount >=8000 && amount < 10000){
      iaaiFees = highVolumeAccount ? 725 : 850;
    }else if(amount >=10000 && amount < 15000){
      iaaiFees = highVolumeAccount ? 750 : 900;
    }else{
      iaaiFees = highVolumeAccount ? amount * 6/100 : amount * 7.5/100
    }
    // let toGetPercent = 3950 + serviceFee + enviromentFee + brachPay + bidderFee + iaaiFees;

    // let amountTotal = serviceFee + enviromentFee + brachPay + bidderFee + iaaiFees;

    // return amountTotal * 100/toGetPercent;
    console.log('amount',amount);

    console.log('iaaiFees',iaaiFees);
    console.log('serviceFee',serviceFee);

    console.log('enviromentFee',enviromentFee);

    console.log('brachPay',brachPay);
    console.log('bidderFee',bidderFee);



    return serviceFee + enviromentFee + brachPay + bidderFee + iaaiFees;
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
