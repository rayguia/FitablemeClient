import {AfterViewInit, Component, ViewChild, OnInit, OnChanges} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { Calculator } from 'src/app/_interfaces/calculator.model';
import { CalculatorRepositoryService } from 'src/app/shared/services/calculator-repository.service';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { SuccessModalComponent } from 'src/app/shared/modals/success-modal/success-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import * as XLSX from 'xlsx';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort,SortDirection} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-calculator-list',
  templateUrl: './calculator-list.component.html',
  styleUrls: ['./calculator-list.component.css']
})
export class CalculatorListComponent implements OnInit,AfterViewInit{

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

  headerTable:string[] = ['select','calculatorId','vin' ,'year','make','model' ,'loteNumber','autionDate','maxBid','marketValue','investment','earnings','title','actions']


  dataSource:MatTableDataSource<Calculator>;
  @ViewChild(MatPaginator) set matPaginator(paginator:MatPaginator){
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort:MatSort){
    this.dataSource.sort = sort;
  }
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  constructor(private repository: CalculatorRepositoryService,
              private errorHandler: ErrorHandlerService,
              private router: Router,
              private modalService:BsModalService) {


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

   /** The label for the checkbox on the passed row */
   checkboxLabel(row?: Calculator): string {
     if (!row) {
       return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
     }
     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.calculatorId + 1}`;
   }
   /**End Select Section */

  ngOnInit(): void {
    //this.getCalculators();
  }


  ngAfterViewInit() {


    this.getCalculators();


  }


  private getCalculators = () => {
    const apiAddress: string = 'api/calculator';
    this.repository.getCalculators(apiAddress)
    .subscribe({
      next: (cal: Calculator[]) => {
        this.calculators = cal
        this.dataSource = new MatTableDataSource(cal);
        this.isLoadingResults =false;
      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  /*Export Section*/

  exportExcel(): void
  {

    var response = this.dataSource.sort ? this.dataSource.sort : new MatSort();
    var dataSorted:any = this.dataSource.sortData(this.dataSource.filteredData,response);
    var output = dataSorted.map(function(obj:any){
      return Object.keys(obj).map(function(key){
        return obj[key]
      })
    })

    output.unshift(this.headerTableToExport);
    /* pass here the table id */
    // let element = document.getElementById('excel-table');
    // const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const ws: XLSX.WorkSheet =XLSX.utils.aoa_to_sheet(output);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'CarCalculators.xlsx');

  }
  /*End Export Section*/


  openLink(link:string,newPage:boolean){


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
    const deleteUri: string = `api/calculator/selected`;
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

        ids.push(calculator.calculatorId)
        var removeIndex = this.dataSource.data.map(item => item.calculatorId).indexOf(calculator.calculatorId);
        ~removeIndex && this.dataSource.data.splice(removeIndex, 1);
        this.dataSource._updateChangeSubscription();

        // var removeIndexSelected = this.selection.selected.map(item => item.calculatorId).indexOf(calculator.calculatorId);
        // ~removeIndexSelected && this.selection.selected.splice(removeIndexSelected, 1);
      });

      this.selection = new SelectionModel<Calculator>(true, []);



  }

}
