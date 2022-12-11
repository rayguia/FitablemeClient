import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit,AfterViewInit {

  sideNavStatus:boolean = false;
  isLoggedIn$: Observable<boolean>;
  userLogged$: Observable<UserModel>;

  @Input() user: UserModel;
  //isLogged:boolean = false                // {1}



  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = 1;


  constructor(private userService: UserService,private router: Router) {


    userService.getLoggedUser$.subscribe((user: UserModel) => {
      //this check is required only if the initial user is null
      if (!!user) {
        console.log('from dashboard',user.UserName)
        this.user = user;
      }
    });



    /**
     *
     *

              <li routerLink="/dashboard" *ngIf="isLoggedIn$ | async">
                  <a  class="dropdown-item py-2">Dashboard</a>
                </li>

                <li routerLink="/calculator" *ngIf="isLoggedIn$ | async">
                  <a  class="dropdown-item py-2">New Estimate</a>
                </li>
                <li routerLink="/calculator/list" *ngIf="isLoggedIn$ | async">
                  <a  class="dropdown-item py-2">List of Cars</a>
                </li>
                <li routerLink="/calculator/alltime" *ngIf="isLoggedIn$ | async">
                  <a  class="dropdown-item py-2">All Expenses</a>
                </li>
              <li routerLink="/dashboard/profile" *ngIf="isLoggedIn$ | async">
                <a class="dropdown-item py-2">Your Profile</a>
              </li>
              <li (click)="onLogout()" *ngIf="isLoggedIn$ | async">
                <a class="dropdown-item py-2">Log Out</a>
              </li>
     */
    this.navLinks = [
      {
          label: 'Dashboard',
          link: '/calculator/dashboard',
          index: 0
      }, {
          label: 'New Estimate',
          link: '/calculator',
          index: 1
      }, {
          label: 'Estimates',
          link: '/calculator/list',
          index: 2
      },
      {
        label: 'Expenses',
        link: '/calculator/alltime',
        index: 3
      },
  ];
  }
   async ngAfterViewInit(){
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === this.router.url));
  });
   }
  async ngOnInit() {
    //this.isLogged = await this.userService.isLogged()
    this.isLoggedIn$ = this.userService.isLoggedIn; // {2}
    this.router.events.subscribe((res) => {
          this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === this.router.url));
      });





  }

  onLogout(){
    this.userService.logout();                      // {3}
  }

}
