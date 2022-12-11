import { Component, Input, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  @Input() dataSource: MatTableDataSource<any>;

  @Input() headerKeyToExport:string[]=[];
  @Input() nameExcel: string;
  constructor() { }

  ngOnInit(): void {
  }

  exportExcel(): void
  {


    var response = this.dataSource.sort ? this.dataSource.sort : new MatSort();
    var dataSorted:any = this.dataSource.sortData(this.dataSource.filteredData,response);
    let header = [];
    let position = 0
    console.log('from export',this.headerKeyToExport);
    var output = dataSorted.map((obj:any) => {
      let newObject=[];


      for (var key in this.headerKeyToExport) {
        newObject.push(obj[key])
        if(position == 0){
           header.push(this.headerKeyToExport[key])
        }


      }
      position++;


      //  Object.keys(obj).map((key,index) =>{
      //   if(this.headerKeyToExport.length == 0 || this.headerKeyToExport.includes(key)){
      //     console.log('key',key);

      //     newObject.push(obj[key])
      //   }
      // })

      return newObject
    })

    console.log('output');

    output.unshift(header);
    /* pass here the table id */
    // let element = document.getElementById('excel-table');
    // const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const ws: XLSX.WorkSheet =XLSX.utils.aoa_to_sheet(output);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, `${this.nameExcel}.xlsx`);

  }

}
