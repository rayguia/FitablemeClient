import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable , startWith} from 'rxjs';
import { ApiResponse } from 'src/app/_interfaces/ApiResponse';
import { IAlltimebills } from 'src/app/_interfaces/IAlltimebills';
import { CalculatorRepositoryService } from '../../shared/services/calculator-repository.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import * as moment from 'moment';

@Component({
  selector: 'app-calculator-alltimebills',
  templateUrl: './calculator-alltimebills.component.html',
  styleUrls: ['./calculator-alltimebills.component.css'],
  encapsulation : ViewEncapsulation.None,
})
export class CalculatorAlltimebillsComponent implements OnInit,AfterViewInit {

  errorMessage:string = ''
  alltimebills:IAlltimebills[] = []
  headerTable:string[] = ['year','make','model' ,'serie','name', 'price', 'providerName','created_at','updated_at']
  headerKeyToExport = {'year':'Year','make':'Make','model':'Model' ,'serie':'Serie','name':'Name', 'price':'Price', 'providerName':'Provider Name','created_at':'Created on','updated_at':'Updated on'}
  isLoadingResults:boolean= true;
  // dataSource:MatTableDataSource<IAlltimebills>;
  dataSource = new MatTableDataSource<IAlltimebills>([]);
  @ViewChild(MatPaginator) set matPaginator(paginator:MatPaginator){
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort:MatSort){
    this.dataSource.sort = sort;
  }

  filteredYearsOptions:Observable<string[]>;
  filteredMakesOptions:Observable<string[]>;
  filteredModelOptions:Observable<string[]>;
  filteredNameOptions:Observable<string[]>;
  filteredProviderNameOptions:Observable<string[]>;


  year = new FormControl('')
  make = new FormControl('')
  model = new FormControl('')
  name = new FormControl('')
  providerName = new FormControl('')

  fromDate = new FormControl('')
  toDate = new FormControl('')

  // fromDate = new Date("12-08-2019");
  // toDate:Date = new Date();

  pipe: DatePipe;

  years:string[]=[]
  makes:string[]=[]
  models:string[]=[]
  names:string[]=[]
  providerNames:string[]=[]

    //   filterForm = new FormGroup({
    //     fromDate: new FormControl(),
    //     toDate: new FormControl(),
    // });

    // get fromDate() { return this.filterForm.get('fromDate').value; }
    // get toDate() { return this.filterForm.get('toDate').value; }

  filteredValues = {
    year: '', make: '', model: '',
    serie: '',name:'',providerName:'',fromDate:'',toDate:''
  };

  constructor(
    private repository: CalculatorRepositoryService,
    private datePipe: DatePipe,
    private errorHandler: ErrorHandlerService) {


      // this.dataSource.filterPredicate = (data, filter) =>{
      //   if (this.fromDate && this.toDate) {
      //     return data.created_at >= this.fromDate && data.created_at <= this.toDate;
      //   }
      //   return true;
      // }
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

    this.filteredNameOptions = this.name.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNames(value || '')),
    );

    this.filteredProviderNameOptions = this.providerName.valueChanges.pipe(
      startWith(''),
      map(value => this._filterProviderNames(value || '')),
    );

    console.log('this.filteredMakesOptions',this.filteredMakesOptions);


    // this.year.valueChanges.subscribe((year) => {
    //   this.filteredValues['year'] = year;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues);
    // });

    // this.make.valueChanges.subscribe((make) => {
    //   this.filteredValues['make'] = make;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues);
    // });
    // this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  // applyFilter(){
  //   this.dataSource.filter = ''+Math.random();
  // }
  ngAfterViewInit(){
    this.getCalculatorBillsAlltime()
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

    this.name.valueChanges.subscribe((name) => {
      this.filteredValues['name'] = name;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.providerName.valueChanges.subscribe((name) => {
      this.filteredValues['providerName'] = name;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.fromDate.valueChanges.subscribe((date) => {
      this.filteredValues['fromDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.toDate.valueChanges.subscribe((date) => {
      this.filteredValues['toDate'] = this.datePipe.transform(date, 'MM/dd/yyyy');
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
    this.pipe = new DatePipe('en');
    // this.dataSource.filterPredicate = (data, filter) =>{
    //   if (this.fromDate && this.toDate) {
    //     return data.created_at >= this.fromDate && data.created_at <= this.toDate;
    //   }
    //   return true;
    // }
    this.dataSource.filterPredicate = this.customFilterPredicate();


    //TODO Do it in a better way
    this.makes = [...new Set(this.alltimebills.map(item => item.make.toLocaleUpperCase()))];
    this.years = [...new Set(this.alltimebills.map(item => item.year.toString().toLocaleUpperCase()))];
    this.models = [...new Set(this.alltimebills.map(item => item.model.toLocaleUpperCase()))];
    this.names = [...new Set(this.alltimebills.map(item => item.name.toLocaleUpperCase()))];
    this.providerNames = [...new Set(this.alltimebills.map(item => item.providerName.toLocaleUpperCase()))];



  }
  customFilterPredicate() {
    const myFilterPredicate = (data: IAlltimebills, filter: string): boolean => {

      console.log('searchString before',filter);

      let searchString = JSON.parse(filter);
      console.log('searchString',searchString);

      if(data.year.toString().trim().indexOf(searchString.year.toString()) !== -1
       &&
       data.make.toString().trim().toLowerCase().indexOf(searchString.make.toLowerCase()) !== -1
       &&
       data.model.toString().trim().toLowerCase().indexOf(searchString.model.toLowerCase()) !== -1
       &&
       data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
       &&
       data.providerName.toString().trim().toLowerCase().indexOf(searchString.providerName.toLowerCase()) !== -1){


        if(searchString.fromDate || searchString.toDate){


          let fromdate=moment(searchString.fromDate).format('MM/DD/YYYY');
          let todate=moment(searchString.toDate).format('MM/DD/YYYY');
          let created =moment(data.created_at).format('MM/DD/YYYY');

             if(searchString.fromDate && searchString.toDate){

                if( created>=fromdate && created <= todate){
                  return true
                }
                return false

              }else if(searchString.fromDate && !searchString.toDate){

                if( created>=fromdate){
                  return true
                }
                return false

              }else if(!searchString.fromDate && searchString.toDate){

                    if( created<=todate){
                      return true
                    }
                    return false
                  }
          return true
        }
        return true

       }else{
        return false
       }
    }
    return myFilterPredicate;
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
  private _filterNames(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterProviderNames(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.providerNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  getCalculatorBillsAlltime(){
    const apiUrl = `calculator/alltimebills`;
    this.repository.getCalculatorBillsAlltime(apiUrl)
    .subscribe({
      next: (response: ApiResponse) => {

       this.alltimebills = response.data
       this.dataSource = new MatTableDataSource(this.alltimebills);
       this.isLoadingResults = false
      //  if (this.dataSource.paginator) {
      //   setTimeout(() => this.dataSource.paginator.firstPage(),2000);

      // }
      //console.log('responseeehhhhhhhhhhhhhhhhhh',response);

      this.setupFilters()

      },
      error: (err: HttpErrorResponse) => {
          this.errorHandler.handleError(err);
          this.errorMessage = this.errorHandler.errorMessage;
      }
    })
  }

}


