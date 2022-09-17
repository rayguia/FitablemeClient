import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sideNavStatus:boolean = false;
  isLoggedIn$: Observable<boolean>;
  isLogged:boolean = false                // {1}

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.isLogged = await this.userService.isLogged()
    this.isLoggedIn$ = this.userService.isLoggedIn; // {2}
  }

  onLogout(){
    this.userService.logout();                      // {3}
  }

}
