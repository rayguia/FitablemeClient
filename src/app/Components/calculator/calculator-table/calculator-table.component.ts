import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApiResponse } from 'src/app/_interfaces/ApiResponse';
import { Calculator } from 'src/app/_interfaces/calculator.model';
import { ICalculatorBills } from 'src/app/_interfaces/ICalculatorBills';
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

  displayedColumns: string[] = ['id', 'name', 'price', 'providerName', 'action'];
  dataSource = new MatTableDataSource<any>();
  isLoading = true;
  VOForm: FormGroup;
  isEditableNew: boolean = true;
  @Input() calculator: Calculator;
  errorMessage:string = '';
  editingRow:any;
  amountTotal:number = 0;

  constructor(private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private repository: CalculatorRepositoryService,
    private datePipe: DatePipe,
    private modal: BsModalService,
    private errorHandler: ErrorHandlerService) { }

    ngOnInit(): void {

      console.log('this.calculator from ngOnInit table',this.calculator);

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
       let billsAmount =0;
      this.dataSource.data.forEach(element => {

        billsAmount += element.value.price;
        console.log('element',element);

      })


      console.log('value',this.dataSource.data);
      console.log('billsAmount',billsAmount);

      this.amountTotal = this.calculator.purchasedValueFinal + billsAmount
    }

    // this function will enabled the select field for editd
    EditSVO(element, position) {
      // VOFormElement.get('VORows').at(i).get('name').disabled(false)
      element.get('VORows').at(position).get('isEditable').patchValue(false);
      this.editingRow = this.dataSource.data[position].value;
      // this.isEditableNew = true;

    }

    // On click of correct button in table (after click on edit) this method will call
    SaveVO(element, position) {
      // alert('SaveVO')
      this.updateCalculatorBills(element,position)
      this.valuesChanges()
      //VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    }

    CancelEdit(element, position) {
      element.get('VORows').at(position).get('isEditable').patchValue(true);
      element.get('VORows').at(position).get('name').patchValue(this.editingRow.name);
      element.get('VORows').at(position).get('price').patchValue(this.editingRow.price);
      element.get('VORows').at(position).get('providerName').patchValue(this.editingRow.providerName);
      this.editingRow = null;


    }



    initiateVOForm(): any {

      //console.log('this.dataSource',this.dataSource.data[0].value);

      if(this.dataSource.data.length > 0){
         let objectForm = this.dataSource.data[0].value;
         if( objectForm.name != "" && objectForm.price != ""){

      return this.fb.group({

        id: new FormControl(),
                  name: new FormControl(''),
                  price: new FormControl(0),
                  providerName: new FormControl(''),
                  calculator_id: new FormControl(this.calculator.id),
                  action: new FormControl('newRecord'),
                  isEditable: new FormControl(false),
                  isNewRow: new FormControl(true)
      });
         }
      }else if(this.dataSource.data.length == 0){
        return this.fb.group({

          id: new FormControl(),
                    name: new FormControl(''),
                    price: new FormControl(0),
                    providerName: new FormControl(''),
                    calculator_id: new FormControl(this.calculator.id),
                    action: new FormControl('newRecord'),
                    isEditable: new FormControl(false),
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

}
