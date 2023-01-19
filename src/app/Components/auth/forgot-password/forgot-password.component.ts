import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {Router} from "@angular/router";
import { UserService } from '../../shared/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  loginError:string
  message: string = 'Loading'

  constructor(private router: Router,private userService: UserService,private spinnerService: NgxSpinnerService,private toastr: ToastrService) {
    this.forgotPassForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {

    //check when we send last recovery
  }

  recoverPassword() {



    this.spinnerService.show();
    this.userService.forgotPassword({email:this.forgotPassForm.get('username').value}).subscribe( {
      next: (result: any) => {

        //if (result.success)
          //this.spinnerService.hide();

          // if(this.returnUrl == undefined){
          //   this.router.navigate(['dashboard']);
          // }else{
          //   this.router.navigate([this.returnUrl]);
          // }
          this.message = 'Email Sent'
          setTimeout(() => {
            this.toastr.success('Reset email was sent successfullly, please check your inbox.', 'Done!');
           }, 2000);

         setTimeout(() => {
          this.spinnerService.hide();
          this.router.navigate(['/auth/login']);
         }, 4000);


      },
      error: (error) =>  {

        this.toastr.error(error.error.message);
        this.loginError = 'Email not found'
        this.spinnerService.hide();
        //this.toastrService.error('Invalid credentials');
      }
    });
  }

  async toLogin() {
    await this.router.navigate(['/auth/login']);
  }
}
