import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  typesOfShoes: string[] = ['Account Info', 'Payment Method','Payment History','Subscription'];
  selectedOption:any = ['Account Info']
  action:string = ''

  loading:boolean = true;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe((params: ParamMap) => {

    //   let action = params.get('action');
    //   console.log('action from seting',action);

    //   if(action == 'subscribe'){
    //     this.action = action
    //     this.selectedOption = ['Payment Method'];

    //   }


    // });
  }

  loadingChanged(value:boolean){
    console.log('from setting',value);
    this.loading = value
  }
  actionChanged(action:string){
    console.log('event',action);

    this.action = action
    if(this.action == 'subscribe'){
      this.selectedOption = ['Payment Method'];
    }else if(this.action == 'subscription done'){
      this.selectedOption = ['Subscription'];
    }

  }
  selectValue(event:any){
    this.loading =true
    this.action = ''
    console.log('selecValue',event);

  }


}
