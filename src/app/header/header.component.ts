import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggle = new EventEmitter<boolean>();
  isLoggedIn2$: Observable<boolean>;
  menuStatus:boolean = false;
  isLogged:boolean =false;
  isLoggedIn:boolean = false
  constructor(public userService: UserService) { }

  async ngOnInit() {
    //this.isLoggedIn$ = this.userService.isLoggedIn;

    //console.log(this.isLoggedIn$);
   this.isLogged = await this.userService.isLogged();
   console.log('isLogged',this.isLogged);

  }

  sideNavToggleFunction(){

    this.menuStatus = !this.menuStatus
    this.sideNavToggle.emit(this.menuStatus)

  }
  onLogout(){
    this.userService.logout();                      // {3}
  }

}
