import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map, Observable, startWith } from 'rxjs';
import { ApiResponse } from 'src/app/_interfaces/ApiResponse';
import { Calculator } from 'src/app/_interfaces/calculator.model';
import { ICalculatorBills } from 'src/app/_interfaces/ICalculatorBills';
import { ObjectEditing } from 'src/app/_interfaces/ObjectEditing';
import { CalculatorRepositoryService } from '../../shared/services/calculator-repository.service';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';




// const ELEMENT_DATA: ICalculatorBills[] = [
//   {position: 1, name: 'Hydrogen', price: 1.0079, providerName: 'H'},
//   {position: 2, name: 'Helium', price: 4.0026, providerName: 'He'},

// ];

@Component({
  selector: 'app-calculator-table',
  templateUrl: './calculator-table.component.html',
  styleUrls: ['./calculator-table.component.css'],
  encapsulation : ViewEncapsulation.None,
})



export class CalculatorTableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'price', 'providerName','created_at','updated_at' ,'action'];
  dataSource = new MatTableDataSource<any>();
  isLoading = true;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  @Input() calculator: Calculator;
  errorMessage:string = '';
  amountTotal:number = 0;
  billsAmount:number = 0;
  profit:number = 0;

  objectsEditing:ObjectEditing[] = [];
  options: string[] = ['Delhi', 'Mumbai', 'Banglore'];
  filteredOptions: Observable<string[]>;
  filteredOptionsProvider: Observable<string[]>;

  names:string[] = [];
  providerNames:string[] = [];

  name = new FormControl('');
  providerName = new FormControl('');

  constructor(private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private repository: CalculatorRepositoryService,
    private datePipe: DatePipe,
    private modal: BsModalService,
    private errorHandler: ErrorHandlerService) { }


    ngOnInit(): void {

      console.log('this.calculator from ngOnInit table',this.calculator);
      this.getDifferentNamesAndProviderNames();
      this.VOForm = this._formBuilder.group({
        VORows: this._formBuilder.array(this.calculator.calculatorBills)
      });

       this.VOForm = this.fb.group({
                VORows: this.fb.array(this.calculator.calculatorBills.map(val => this.fb.group({
                  id: new FormControl(val.id),
                  name: new FormControl(val.name),
                  price: new FormControl(val.price),
                  providerName: new FormControl(val.providerName),
                  calculator_id: new FormControl(val.calculator_id),
                  created_at: new FormControl(this.datePipe.transform(val.created_at, 'MM/dd/yyyy')),
                  updated_at: new FormControl(this.datePipe.transform(val.updated_at, 'MM/dd/yyyy')),
                  action: new FormControl('existingRecord'),
                  isEditable: new FormControl(true),
                  isNewRow: new FormControl(false),
                })
                ))
              });

      this.isLoading = false;
      this.dataSource = new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
      this.dataSource._updateChangeSubscription();
      this.valuesChanges()

      this.filteredOptions = this.name.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );

      this.filteredOptionsProvider = this.providerName.valueChanges.pipe(
        startWith(''),
        map(value => this._filterProvider(value || '')),
      );

    }
    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();

      return this.names.filter(option => option.toLowerCase().includes(filterValue));
    }


    private _filterProvider(value: string): string[] {
      const filterValue = value.toLowerCase();

      return this.providerNames.filter(option => option.toLowerCase().includes(filterValue));
    }

    // @ViewChild('table') table: MatTable<PeriodicElement>;
    AddNewRow() {
      // this.getBasicDetails();
      const control = this.VOForm.get('VORows') as FormArray;
      let result =this.initiateVOForm()
      if(result != false){
        control.insert(0,result);
        this.dataSource = new MatTableDataSource(control.controls)
      }

    }
    valuesChanges(){
      this.billsAmount = 0;
      this.dataSource.data.forEach(element => {
        this.billsAmount += element.value.price;
      })

      this.amountTotal = this.calculator.purchasedValueFinal + this.billsAmount

      this.profit = this.calculator.isSold ? this.calculator.soldValue - this.amountTotal : 0
    }

    // this function will enabled the select field for editd
    EditSVO(element, position) {

      this.objectsEditing.push({editingRow:this.dataSource.data[position].value,element:element,positionEditing:position})
      // if(this.objectEditing.positionEditing != -1){
      //    let actualRow = this.dataSource.data[position].value;
      //    if(this.objectEditing.editingRow.name != actualRow.name || this.objectEditing.editingRow.price != actualRow.price || this.objectEditing.editingRow.providerName != actualRow.providerName){
      //     //show dialog to save the before editing or no
      //    }else{
      //     this.CancelEdit(this.objectEditing.element, this.objectEditing.positionEditing)

      //    }
      // }
      // VOFormElement.get('VORows').at(i).get('name').disabled(false)
      element.get('VORows').at(position).get('isEditable').patchValue(false);
      // this.objectEditing.positionEditing = position
      // this.objectEditing.editingRow = this.dataSource.data[this.objectEditing.positionEditing].value;
      // this.objectEditing.element = element;
      // this.isEditableNew = true;

    }

    // On click of correct button in table (after click on edit) this method will call
    SaveVO(element, position) {
      // alert('SaveVO')
      this.updateCalculatorBills(element,position)
      this.valuesChanges()

      var removeIndex = this.objectsEditing.map(item => item.positionEditing).indexOf(position);
      ~removeIndex && this.objectsEditing.splice(removeIndex, 1);

      //VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    }

    CancelEdit(element, position) {

      let bill = this.dataSource.data[position].value;
      element.get('VORows').at(position).get('isEditable').patchValue(true);
      if(bill.id != null){

        var removeIndex = this.objectsEditing.map(item => item.positionEditing).indexOf(position);
        let editingRow = ~removeIndex && this.objectsEditing[removeIndex];
        element.get('VORows').at(position).get('name').patchValue(editingRow.editingRow.name);
        element.get('VORows').at(position).get('price').patchValue(editingRow.editingRow.price);
        element.get('VORows').at(position).get('providerName').patchValue(editingRow.editingRow.providerName);
        ~removeIndex && this.objectsEditing.splice(removeIndex, 1);
      }else{
        this.dataSource.data.splice(position, 1);
        this.dataSource._updateChangeSubscription();
      }

    }

    cellClicked(element) {
      console.log(element + ' cell clicked');
    }
    initiateVOForm(): any {

      //console.log('this.dataSource',this.dataSource.data[0].value);
      //this.name.setValue('')
      if(this.dataSource.data.length > 0){
         let objectForm = this.dataSource.data[0].value;
        //  if( objectForm.name != "" && objectForm.price != ""){
          if(objectForm.id != null){

      return this.fb.group({

        id: new FormControl(),
                  name: this.name,
                  price: new FormControl(0),
                  providerName: this.providerName,
                  calculator_id: new FormControl(this.calculator.id),
                  created_at:new FormControl(''),
                    updated_at:new FormControl(''),
                  action: new FormControl('newRecord'),
                  isEditable: new FormControl(false),
                  isNewRow: new FormControl(true)
      });
         }
      }else if(this.dataSource.data.length == 0){

        return this.fb.group({

          id: new FormControl(),
                    name: this.name,
                    price: new FormControl(0),
                    providerName: this.providerName,
                    calculator_id: new FormControl(this.calculator.id),
                    action: new FormControl('newRecord'),
                    isEditable: new FormControl(false),
                    created_at:new FormControl(''),
                    updated_at:new FormControl(''),
                    isNewRow: new FormControl(true)
        });
      }

      return false;
    }
    updateCalculatorBills = (element:any,position:number) => {

      let bill = this.dataSource.data[position].value;

      const apiUrl = `calculator/${this.calculator.id}/bill`;
      this.repository.updateCalculatorBills(apiUrl, bill)
      .subscribe({
        next: (response: ApiResponse) => {

          element.get('VORows').at(position).get('isEditable').patchValue(true);
          element.get('VORows').at(position).get('id').patchValue(response.data.id);
          element.get('VORows').at(position).get('created_at').patchValue(this.datePipe.transform(response.data.created_at, 'MM/dd/yyyy'));
          element.get('VORows').at(position).get('updated_at').patchValue(this.datePipe.transform(response.data.updated_at, 'MM/dd/yyyy'));
        //this.dataSource._updateChangeSubscription();
        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })
    }

    removeCalculatorBill = (element:any,position:number) => {


      let bill = this.dataSource.data[position].value;

      const apiUrl = `calculator/${this.calculator.id}/bill/${bill.id}`;
      this.repository.deleteCalculatorBill(apiUrl)
      .subscribe({
        next: (response: ApiResponse) => {
          this.dataSource.data.splice(position, 1);
          this.dataSource._updateChangeSubscription();
        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })




      // var ids = [];
      // calculators.forEach(calculator => {

      //     ids.push(calculator.id)
      //     var removeIndex = this.dataSource.data.map(item => item.id).indexOf(calculator.id);
      //     ~removeIndex && this.dataSource.data.splice(removeIndex, 1);
      //     this.dataSource._updateChangeSubscription();

      //     // var removeIndexSelected = this.selection.selected.map(item => item.calculatorId).indexOf(calculator.calculatorId);
      //     // ~removeIndexSelected && this.selection.selected.splice(removeIndexSelected, 1);
      //   });

      //   this.selection = new SelectionModel<Calculator>(true, []);

    }

    getDifferentNamesAndProviderNames = () => {



      const apiUrl = `calculator/names`;
      this.repository.getDifferentNamesAndProviderNames(apiUrl)
      .subscribe({
        next: (response: ApiResponse) => {

          console.log('response',response);
          this.names = response.data.names
          this.providerNames = response.data.providerNames

          console.log('names',this.names);
          console.log('providerNames',this.providerNames);


        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })
    }

    markAsSold = () => {



      const apiUrl = `calculator/markassold`;
      this.repository.markAsSold(apiUrl,this.calculator)
      .subscribe({
        next: (response: ApiResponse) => {
          this.calculator = response.data;
          this.valuesChanges()
        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })
    }
    markAsBought = () => {

      const apiUrl = `calculator/markasbought`;
      this.repository.markAsBought(apiUrl,this.calculator)
      .subscribe({
        next: (response: ApiResponse) => {
          this.calculator = response.data;
          this.valuesChanges()
        },
        error: (err: HttpErrorResponse) => {
            this.errorHandler.handleError(err);
            this.errorMessage = this.errorHandler.errorMessage;
        }
      })
    }

}
