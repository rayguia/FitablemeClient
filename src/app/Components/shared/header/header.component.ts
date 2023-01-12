import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggle = new EventEmitter<boolean>();
  isLoggedIn$: Observable<boolean>;
  @Input() hideIconSidebar:boolean = false;
  @Input() user: UserModel;
  menuStatus:boolean = false;
  isLogged:boolean =false;

  constructor(public userService: UserService,private router:Router,
    private subscriptionService: SubscriptionService) {

    userService.getLoggedUser$.subscribe((user: UserModel) => {
      //this check is required only if the initial user is null
      if (!!user) {
        console.log('from header',user.UserName)
        this.user = user;
      }
    });
   }

  async ngOnInit() {
    //this.isLoggedIn$ = this.userService.isLoggedIn;
    if(await this.userService.isLogged() == true){
       this.userService.setLogged()
    }
    //console.log(this.isLoggedIn$);
   //this.isLogged = await this.userService.isLogged();
   this.isLoggedIn$ = this.userService.isLoggedIn; // {2}
   console.log('isLogged2',this.isLogged);

  }
  goToSettingTab(){
    setTimeout( () => {
      this.subscriptionService.setSettingTab('Subscription')
      this.router.navigate(['settings']);
    }, 500);
  }
  sideNavToggleFunction(){

    this.menuStatus = !this.menuStatus
    this.sideNavToggle.emit(this.menuStatus)

  }
  onLogout(){
    this.userService.logout();                      // {3}
  }

}
