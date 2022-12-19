import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  typesOfShoes: string[] = ['Account', 'Payment'];
  selectedOption:any = ['Account']
  loading:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  loadingChanged(value:boolean){
    console.log('from setting',value);
    this.loading = value
  }
  selectValue(event:any){
    this.loading =true
    console.log(event);

  }

}
