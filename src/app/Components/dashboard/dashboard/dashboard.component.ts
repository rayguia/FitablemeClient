import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/Components/shared/services/user.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  sideNavStatus:boolean = false;
  isLoggedIn$: Observable<boolean>;
  userLogged$: Observable<UserModel>;

  @Input() user: UserModel;
  //isLogged:boolean = false                // {1}

  constructor(private userService: UserService) {

    userService.getLoggedUser$.subscribe((user: UserModel) => {
      //this check is required only if the initial user is null
      if (!!user) {
        console.log('from dashboard',user.UserName)
        this.user = user;
      }
    });
  }

  async ngOnInit() {
    //this.isLogged = await this.userService.isLogged()
    this.isLoggedIn$ = this.userService.isLoggedIn; // {2}



  }

  onLogout(){
    this.userService.logout();                      // {3}
  }

}
