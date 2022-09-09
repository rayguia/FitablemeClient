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

  headerTable:string[] = ['select','calculatorId','vin' ,'loteNumber','autionDate','maxBid','marketValue','investment','earnings','title','actions']


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
     console.log('isAllSelected selection',this.selection);

     return numSelected === numRows;
   }

   /** Selects all rows if they are not all selected; otherwise clear selection. */
   toggleAllRows() {
     if (this.isAllSelected()) {
       this.selection.clear();
       return;
     }
     console.log('toggleAllRows selection',this.selection);
     this.selection.select(...this.dataSource.data);
   }

   /** The label for the checkbox on the passed row */
   checkboxLabel(row?: Calculator): string {
     if (!row) {
      console.log('checkboxLabel no row selection',this.selection);
       return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
     }
     console.log('checkboxLabel all selection',this.selection);
     return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.calculatorId + 1}`;
   }
   /**End Select Section */

  ngOnInit(): void {
    //this.getCalculators();
  }



  // pageChange(){
  //   this.paginator?.page.pipe(
  //     switchMap(() => {
  //       let currentPage = (this.paginator?.pageIndex ?? 0)+1;
  //       return this.appService.getTodos(currentPage, (this.paginator?.pageSize ?? 0));
  //     }),
  //     map( result => {
  //       if(!result){
  //         return [];
  //       }
  //       this.totalRecords = result.totalCount;
  //       return result.data;
  //     })
  //   )
  //   .subscribe(data => {
  //     this.todos = data;
  //   });
  // }
  ngAfterViewInit() {

    //this.pageChange();
    //this.initialLoad();
    this.getCalculators();



    //this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getRepoIssues(
    //         this.sort.active,
    //         this.sort.direction,
    //         this.paginator.pageIndex,
    //       ).pipe(catchError(() => observableOf(null)));
    //     }),
    //     map(data => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.isRateLimitReached = data === null;

    //       if (data === null) {
    //         return [];
    //       }

    //       // Only refresh the result length if there is new data. In case of rate
    //       // limit errors, we do not want to reset the paginator to zero, as that
    //       // would prevent users from re-triggering requests.
    //       this.resultsLength = data.total_count;
    //       return data.items;
    //     }),
    //   )
    //   .subscribe(data => (this.data = data));
  }


  private getCalculators = () => {
    const apiAddress: string = 'api/calculator';
    this.repository.getCalculators(apiAddress)
    .subscribe({
      next: (cal: Calculator[]) => {
        this.calculators = cal
        this.dataSource = new MatTableDataSource(cal);
        console.log('dataSourse View',this.dataSource);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
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
    //  var removeIndex = this.calculators.map(item => item.calculatorId).indexOf(calculator.calculatorId);
    //      ~removeIndex && this.calculators.splice(removeIndex, 1);
         var removeIndex = this.dataSource.data.map(item => item.calculatorId).indexOf(calculator.calculatorId);
         ~removeIndex && this.dataSource.data.splice(removeIndex, 1);
         this.dataSource._updateChangeSubscription();

         var removeIndexSelected = this.selection.selected.map(item => item.calculatorId).indexOf(calculator.calculatorId);
         ~removeIndexSelected && this.selection.selected.splice(removeIndexSelected, 1);


  }

}
