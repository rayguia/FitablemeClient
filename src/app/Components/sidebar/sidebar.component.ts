import { Component, Input, OnInit } from '@angular/core';
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
  constructor(private userService:UserService) { }

  ngOnInit(): void {
    //this.isLoggedIn$ = this.userService.isLoggedIn;
  }

}
