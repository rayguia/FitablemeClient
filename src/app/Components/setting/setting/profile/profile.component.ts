import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/Components/shared/services/user.service';
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() user: UserModel;
  @Output() loadingEvent = new EventEmitter<boolean>();
  loading:boolean = false;
  constructor(private cdRef : ChangeDetectorRef,private userService: UserService) {

    userService.getLoggedUser$.subscribe((user: UserModel) => {
      //this check is required only if the initial user is null
      if (!!user) {
        console.log('from dashboard',user)
        this.user = user;
      }
    });


  }

  ngOnInit(): void {
      this.setLoading(false)
  }
  changeUser(){
    this.userService.setLoggedUser({...this.user,UserName:"NewUser"})
  }
  setLoading(value:boolean){
    this.loading = value
    this.loadingEvent.emit(value);
    this.cdRef.detectChanges();

   }
}
