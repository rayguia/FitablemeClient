import {AfterViewInit, Component, ViewChild, OnInit, OnChanges, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Calculator } from 'src/app/_interfaces/calculator.model';


import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import * as XLSX from 'xlsx';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort,SortDirection} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { CalculatorRepositoryService } from '../../shared/services/calculator-repository.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { SuccessModalComponent } from '../../shared/modals/success-modal/success-modal.component';
import { FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';



@Component({
  selector: 'app-calculator-list',
  templateUrl: './calculator-list.component.html',
  styleUrls: ['./calculator-list.component.css'],
  encapsulation : ViewEncapsulation.None,

})
export class CalculatorListComponent implements OnInit,AfterViewInit{


  showResetFilter:boolean = false
  filteredValues = {
    year: '', make: '', model: '', vin:'',carfaxSelect:'2',boughtSelect:'2',soldSelect:'2',
    fromAddedDate:'',toAddedDate:'',fromAuctionDate:'',toAuctionDate:'',fromBoughtDate:'',toBoughtDate:'',fromSoldDate:'',toSoldDate:''
  };
  pipe: DatePipe;

  filteredYearsOptions:Observable<string[]>;
  filteredMakesOptions:Observable<string[]>;
  filteredModelOptions:Observable<string[]>;
  year = new FormControl('')
  make = new FormControl('')
  model = new FormControl('')
  years:string[]=[]
  makes:string[]=[]
  models:string[]=[]

  fromAddedDate = new FormControl('')
  toAddedDate = new FormControl('')
  fromAuctionDate = new FormControl('')
  toAuctionDate = new FormControl('')
  fromBoughtDate = new FormControl('')
  toBoughtDate= new FormControl('')
  fromSoldDate= new FormControl('')
  toSoldDate= new FormControl('')

  boughtSelect = new FormControl('2')
  soldSelect = new FormControl('2')
  carfaxSelect = new FormControl('2')



  calculators: Calculator[] = [];
  isLoadingResults:boolean = true;
  errorMessage: string = '';
  bsModalRef?: BsModalRef;
  headerTableToExport:string[] = ['Calculator ','Vin','Lote Number','Ation Date','Year','Make','Model','Serie','Type','Link','Max Amount To Offer','Market Value','Market Value Final',
                           'Title Type','Buy Aution Amount','Buy Acution Fee Percent','Buy Aution Name', 'Sale Aution Amount','Sale Aution Percent','Sale Aution Amount',
                            'Floorplan Amount','Earnings Amount','Earning Percent','Fix Price','Transport Price','Tax Title','Others' ]
  // headerTable:string[] = ['Calculator #','Vin','Lote Number','Ation Date','Year','Make','Model','Serie','Type','Link','Max Amount To Offer','Market Value','Market Value Final',
  //                          'Title Type','Buy Aution Amount','Buy Acution Fee Percent','Buy Aution Name', 'Sale Aution Amount','Sale Aution Percent','Sale Aution Amount',
  //                           'Floorplan Amount','Earnings Amount','Earning Percent','Fix Price','Transport Price','Tax Title','Others' ]

  headerTable:string[] = ['select','id','vin' ,'year','make','model' ,'loteNumber','auctionDate','maxBid','marketValue','investment','earnings','title','created_at','actions']



  dataSource = new MatTableDataSource<Calculator>([]);
  @ViewChild(MatPaginator) set matPaginator(paginator:MatPaginator){
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort:MatSort){
    this.dataSource.sort = sort;
  }

  onlySold = false;
  onlyBought = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  filters = this._formBuilder.group({
    sold: false,
    bought: false,

  });
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  constructor(private repository: CalculatorRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private modalService:BsModalService,
              private _formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private cdRef : ChangeDetectorRef) {


               }


   /**Select Section */

   selection = new SelectionModel<Calculator>(true, []);

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
     const numSelected = this.selection.selected.length;
     const numRows = this.dataSource.data.length;

     return numSelected === numRows;
   }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   toggleAllRows() {
     if (this.isAllSelected()) {
       this.selection.clear();
       return;
     }
     this.selection.select(...this.dataSource.data);
   }

   resetFilters(){

    this.year.setValue('')
    this.make.setValue('')
    this.model.setValue('')

    this.fromAddedDate.setValue('')
    this.toAddedDate.setValue('')
    this.fromBoughtDate.setValue('')
    this.toBoughtDate.setValue('')
    this.fromSoldDate.setValue('')
    this.toSoldDate.setValue('')
    this.fromAuctionDate.setValue('')
    this.toAuctionDate.setValue('')

    this.carfaxSelect.setValue('2')
    this.boughtSelect.setValue('2')
    this.soldSelect.setValue('2')

    this.cdRef.detectChanges();

   }

   /** The label for the checkbox on the passed row */
   checkboxLabel(row?: Calculator): string {
     if (!row) {
       return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
     }
     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
   }
   /**End Select Section */
   showFilters(){
    return this.showResetFilter
   }
  ngOnInit(): void {

    this.filteredYearsOptions = this.year.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredMakesOptions = this.make.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMakes(value || '')),
    );
    this.filteredModelOptions = this.model.valueChanges.pipe(
      startWith(''),
      map(value => this._filterModels(value || '')),
    );
    // this.dataSource.filterPredicate = ((data: Calculator, filter: string): boolean => {
    //   const filterValues = JSON.parse(filter);

    //   return (this.onlyBought ? data.purchased === filterValues.purchased : false) &&
    //   (this.onlySold ? data.isSold == true : false);
    // })

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();

    // }

  }
  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.years.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterMakes(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.makes.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterModels(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.models.filter(option => option.toLowerCase().includes(filterValue));
  }
  setupFilters(){
    this.year.valueChanges.subscribe((year) => {
      this.filteredValues['year'] = year;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.make.valueChanges.subscribe((make) => {
      this.filteredValues['make'] = make;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.model.valueChanges.subscribe((model) => {
      this.filteredValues['model'] = model;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.carfaxSelect.valueChanges.subscribe((carfaxSelect) => {
      this.filteredValues['carfaxSelect'] = carfaxSelect;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.boughtSelect.valueChanges.subscribe((boughtSelect) => {
      this.filteredValues['boughtSelect'] = boughtSelect;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.soldSelect.valueChanges.subscribe((soldSelect) => {
      this.filteredValues['soldSelect'] = soldSelect;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });



    this.fromAddedDate.valueChanges.subscribe((date) => {
      this.filteredValues['fromAddedDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.toAddedDate.valueChanges.subscribe((date) => {
      this.filteredValues['toAddedDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.fromAuctionDate.valueChanges.subscribe((date) => {
      this.filteredValues['fromAuctionDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.toAuctionDate.valueChanges.subscribe((date) => {
      this.filteredValues['toAuctionDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.fromBoughtDate.valueChanges.subscribe((date) => {
      this.filteredValues['fromBoughtDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.toBoughtDate.valueChanges.subscribe((date) => {
      this.filteredValues['toBoughtDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.fromSoldDate.valueChanges.subscribe((date) => {
      this.filteredValues['fromSoldDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.toSoldDate.valueChanges.subscribe((date) => {
      this.filteredValues['toSoldDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.pipe = new DatePipe('en');

    this.dataSource.filterPredicate = this.customFilterPredicate();


    //TODO Do it in a better way
    this.makes = [...new Set(this.calculators.map(item => item.make.toLocaleUpperCase()))];
    this.years = [...new Set(this.calculators.map(item => item.year.toString().toLocaleUpperCase()))];
    this.models = [...new Set(this.calculators.map(item => item.model.toLocaleUpperCase()))];
    // this.names = [...new Set(this.alltimebills.map(item => item.name.toLocaleUpperCase()))];
    // this.providerNames = [...new Set(this.alltimebills.map(item => item.providerName.toLocaleUpperCase()))];



  }
  customFilterPredicate() {
    const myFilterPredicate = (data: Calculator, filter: string): boolean => {

     // console.log('searchString before',filter);

      let searchString = JSON.parse(filter);
      if(
        searchString.year!= '' || searchString.make!= '' || searchString.model!= '' ||
        searchString.vin!='' || searchString.carfaxSelect != 2 ||
        searchString.boughtSelect !=2 || searchString.soldSelect !=2 ||
      searchString.fromAddedDate != '' || searchString.toAddedDate != '' ||
      searchString.fromAuctionDate != '' || searchString.toAddedDate != '' ||
      searchString.fromBoughtDate != '' || searchString.toBoughtDate != '' ||
      searchString.fromSoldDate != '' || searchString.toSoldDate != ''
      ){
        this.showResetFilter = true
      }

      // console.log('searchString',searchString);
      // console.log('searchString',data);


      return data.year.toString().trim().indexOf(searchString.year.toString()) !== -1
       &&
       data.make.toString().trim().toLowerCase().indexOf(searchString.make.toLowerCase()) !== -1
       &&
       data.model.toString().trim().toLowerCase().indexOf(searchString.model.toLowerCase()) !== -1 &&
       (searchString.boughtSelect == 2 || data.purchased == searchString.boughtSelect) &&
       (searchString.carfaxSelect == 2 || data.hasCarfax == searchString.carfaxSelect) &&
       (searchString.soldSelect == 2 || data.isSold == searchString.soldSelect) &&
       this.checkFilterAddedDate(data,searchString) &&
       this.checkFilterAuctionDate(data,searchString) &&
       this.checkFilterBoughtDate(data,searchString) &&
       this.checkFilterSoldDate(data,searchString)

    }
    return myFilterPredicate;
  }

  checkFilterAddedDate(data:Calculator ,searchString:any):boolean{
    if(searchString.fromAddedDate || searchString.toAddedDate){

      let fromAddedDate=moment(searchString.fromAddedDate).format('MM/DD/YYYY');
      let toAddedDate=moment(searchString.toAddedDate).format('MM/DD/YYYY');
      let created =moment(data.created_at).format('MM/DD/YYYY');

         if(searchString.fromAddedDate && searchString.toAddedDate){

            if( created>=fromAddedDate && created <= toAddedDate){

              return true
            }
            return false

          }else if(searchString.fromAddedDate && !searchString.toAddedDate){

            if( created>=fromAddedDate){
              return true
            }
            return false

          }else if(!searchString.fromAddedDate && searchString.toAddedDate){

                if( created<=toAddedDate){
                  return true
                }
                return false
              }
      return true
    }
    return true
  }
  checkFilterAuctionDate(data:Calculator ,searchString:any){

    if(searchString.fromAuctionDate || searchString.toAuctionDate){

      let fromAuctionDate=moment(searchString.fromAuctionDate).format('MM/DD/YYYY');
      let toAuctionDate=moment(searchString.toAuctionDate).format('MM/DD/YYYY');
      let created =moment(data.auctionDate).format('MM/DD/YYYY');

         if(searchString.fromAuctionDate && searchString.toAuctionDate){

            if( created>=fromAuctionDate && created <= toAuctionDate){

              return true
            }
            return false

          }else if(searchString.fromAuctionDate && !searchString.toAuctionDate){

            if( created>=fromAuctionDate){
              return true
            }
            return false

          }else if(!searchString.fromAuctionDate && searchString.toAuctionDate){

                if( created<=toAuctionDate){
                  return true
                }
                return false
              }
      return true
    }
    return true

  }
  checkFilterBoughtDate(data:Calculator ,searchString:any){

    if(searchString.fromBoughtDate || searchString.toBoughtDate){

      let fromBoughtDate=moment(searchString.fromBoughtDate).format('MM/DD/YYYY');
      let toBoughtDate=moment(searchString.toBoughtDate).format('MM/DD/YYYY');
      let created =moment(data.purchasedDate).format('MM/DD/YYYY');

      console.log('fromBoughtDate',fromBoughtDate);
      console.log('searcchString',toBoughtDate);
      console.log('created',created);

         if(searchString.fromBoughtDate && searchString.toBoughtDate){

            if( created>=fromBoughtDate && created <= toBoughtDate){
              console.log('dos',created);
              return true
            }
            return false

          }else if(searchString.fromBoughtDate && !searchString.toBoughtDate){

            if( created>=fromBoughtDate){
              console.log('fromBoughtDate entro',created);
              return true
            }
            return false

          }else if(!searchString.fromBoughtDate && searchString.toBoughtDate){

                if( created<=toBoughtDate){
                  console.log('toBoughtDate entro',created);
                  return true
                }
                return false
              }
      return true
    }
    return true

  }
  checkFilterSoldDate(data:Calculator ,searchString:any):boolean{
    if(searchString.fromSoldDate || searchString.toSoldDate){

      let fromSoldDate=moment(searchString.fromSoldDate).format('MM/DD/YYYY');
      let toSoldDate=moment(searchString.toSoldDate).format('MM/DD/YYYY');
      let created =moment(data.soldDate).format('MM/DD/YYYY');

         if(searchString.fromSoldDate && searchString.toSoldDate){

            if( created>=fromSoldDate && created <= toSoldDate){

              return true
            }
            return false

          }else if(searchString.fromSoldDate && !searchString.toSoldDate){

            if( created>=fromSoldDate){
              return true
            }
            return false

          }else if(!searchString.fromSoldDate && searchString.toSoldDate){

                if( created<=toSoldDate){
                  return true
                }
                return false
              }
      return true
    }
    return true
  }




  ngAfterViewInit() {


    this.getCalculators();
    this.cdRef.detectChanges();

  }


  private getCalculators = () => {
    const apiAddress: string = 'calculator';
    this.repository.getCalculators(apiAddress)
    .subscribe({
      next: (response: any) => {
        this.calculators = response.data.calculators
        this.dataSource = new MatTableDataSource(this.calculators);
        this.isLoadingResults =false;
        this.setupFilters()
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }


  // applyFilter(event: Event) {
  //   console.log('event',event);

  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  // applyFilterCheck(){

  //   let cal:Calculator[] = [];
  //   if(this.onlyBought && this.onlySold){

  //     cal = this.calculators.filter(function (cal) {

  //       return cal.isSold == true && cal.purchased == true
  //     });

  //   }
  //   else if(this.onlyBought && !this.onlySold){
  //     cal = this.calculators.filter(function (cal) {

  //       return cal.purchased == true
  //     });
  //   }
  //   else if(!this.onlyBought && this.onlySold){
  //     cal = this.calculators.filter(function (cal) {

  //       return cal.isSold == true
  //     });
  //   }else{
  //     cal = this.calculators
  //   }
  //   console.log('this.calculators',this.calculators)
  //   console.log('this.onlyBought',this.onlyBought);

  //   console.log('this.onlySold',this.onlySold);
  //   console.log('this.cal',cal);





  //   this.dataSource = new MatTableDataSource(cal);


  //   if (this.dataSource.paginator) {
  //     setTimeout(() => this.dataSource.paginator.firstPage(),2000);

  //   }


  // }



  openLink(link:string,newPage:boolean){
    window.open(link, '_blank')
  }
  public getCalculation(calculation:Calculator){

    return calculation.buyAutionAmount + calculation.saleAutionAmount +
     calculation.floorplanAmount + calculation.fixPrice + calculation.transportPrice +
     calculation.taxTitle + calculation.others;

  }

  showModalToDelete(calculator:any){
    let text = this.selection.selected.length > 1 ? 'items' : 'item'
    const config: ModalOptions = {
      initialState: {
        modalHeaderText: 'Confirm',
        modalBodyText: `Are you sure you want to remove ${this.selection.selected.length} ${text}?`,
        okButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
    this.bsModalRef.content.deleteConfirmed.subscribe(_ => this.deleteCalculator(calculator));
  }
  deleteCalculator = (calculators:any) => {

    var all = calculators == 'all' ? this.selection.selected : [calculators];
    const deleteUri: string = `calculator/selected`;
    this.repository.deleteCalculators(deleteUri,all)
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
        this.bsModalRef.content.redirectOnOk.subscribe(_ => this.removeCalculatorFromList(all));
      },
      error: (err: HttpErrorResponse) => this.errorHandler.handleError(err)
    })
  }
  removeCalculatorFromList(calculators:any[]){
    var ids = [];
    calculators.forEach(calculator => {

        ids.push(calculator.id)
        var removeIndex = this.dataSource.data.map(item => item.id).indexOf(calculator.id);
        ~removeIndex && this.dataSource.data.splice(removeIndex, 1);
        this.dataSource._updateChangeSubscription();

        // var removeIndexSelected = this.selection.selected.map(item => item.calculatorId).indexOf(calculator.calculatorId);
        // ~removeIndexSelected && this.selection.selected.splice(removeIndexSelected, 1);
      });

      this.selection = new SelectionModel<Calculator>(true, []);
  }


}
