import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/Components/shared/services/user.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() user: UserModel;
  constructor(private userService: UserService) {

    userService.getLoggedUser$.subscribe((user: UserModel) => {
      //this check is required only if the initial user is null
      if (!!user) {
        console.log('from dashboard',user)
        this.user = user;
      }
    });
  }

  ngOnInit(): void {

  }
  changeUser(){
    this.userService.setLoggedUser({...this.user,UserName:"NewUser"})
  }

}
