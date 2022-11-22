import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() sideNavStatus:boolean = false;
  isLoggedIn$: Observable<boolean>;

  itemsSidebar: any = [
    {
      number:1,
      icon:'fa-solid fa-house',
      name:'home',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:2,
      icon:'fa-solid fa-user',
      name:'edit profile',
      onSelected: () => {
        this.router.navigate(['/dashboard/profile'])
      },

    },

    {
      number:3,
      icon:'fa-solid fa-video',
      name:'streams',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:4,
      icon:'fa-solid fa-message',
      name:'messages',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:5,
      icon:'fa-solid fa-bell',
      name:'notifications',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:6,
      icon:'fas fa-photo-video',
      name:'posts',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:7,
      icon:'fa-solid fa-square-check',
      name:'subscriptions',
      onSelected: () => {
        this.router.navigate(['dashboard/subscription'])
      },
    },
    {
      number:8,
      icon:'fa fa-credit-card',
      name:'wallet',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:9,
      icon:'fa-solid fa-circle-info',
      name:'help',
      onSelected: () => {
        this.router.navigate(['/'])
      },
    },
    {
      number:10,
      icon:'fa-solid fa-arrow-right-from-bracket',
      name:'log out',
      onSelected: () => {
        this.logOut();
      },
    },
    // {
    //   number:2,
    //   icon:'fa-solid fa-calculator',
    //   name:'calculator',
    //   onSelected: () => {
    //     this.router.navigate(['/dashboard/calculator'])
    //   },

    // },
  ];


  constructor(private userService:UserService,private router: Router) { }

  ngOnInit(): void {
    //this.isLoggedIn$ = this.userService.isLoggedIn;
  }
  logOut(){
    this.userService.logout()
  }


}
