import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

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
