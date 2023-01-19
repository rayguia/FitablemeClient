import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { passwordMatchValidator } from '../custom-validators/password-validator';
import { UserService } from '../../shared/services/user.service';
import { LoginModel } from 'src/app/models/login.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-passsword',
  templateUrl: './recover-passsword.component.html',
  styleUrls: ['./recover-passsword.component.css']
})
export class RecoverPassswordComponent implements OnInit {



  resetForm: FormGroup;
  genders = [''];
  registerError:string = ''
  recoverError:string =''
  credentials: any = {email: '', password: '',passsword_confirmation:'',token:''};
  message:string = 'Loading'
  // selectedGender: string;

  constructor(private router: ActivatedRoute,
              private routerRedirect: Router,
              private spinnerService: NgxSpinnerService,
              private userService: UserService,
              private toastr: ToastrService
              ) {

    this.resetForm = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required]),
      c_password: new FormControl('',[Validators.required]),
      token: new FormControl('')
    }, {validators: passwordMatchValidator});

    router.queryParams.subscribe(params => {
      this.resetForm.patchValue({token:params['token']})
    })

  }

  // codeForm: FormGroup;
  // setPasswordForm: FormGroup;
  // codeIsValid: boolean;
  // headertext: string;
  // btnText: string;

  // constructor() {
  //   this.codeForm = new FormGroup({
  //     code: new FormControl('', [Validators.required]),
  //   });
  //   this.setPasswordForm = new FormGroup({
  //     password: new FormControl('', [Validators.required]),
  //   });
  //   this.headertext = 'Enter the code sent to your email address.';
  //   this.btnText = 'Check code';
  // }

  ngOnInit(): void {
    //this.codeIsValid = false;
  }

  checkCode() {
    //this.codeIsValid = true;
  }

  resetPassword() {



    this.spinnerService.show();
    this.credentials.email = this.resetForm.get('email').value;
    this.credentials.password = this.resetForm.get('password').value;
    this.credentials.passsword_confirmation = this.resetForm.get('c_password').value;
    this.credentials.token = this.resetForm.get('token').value;
    this.userService.recoverPassword({
      email:this.credentials.email,
      password:this.credentials.password,
      password_confirmation:this.credentials.passsword_confirmation,
      token:this.credentials.token
    }).subscribe( {
      next: (result: any) => {

        this.message = 'Password successfully changed'
        this.toastr.success('Now login with new password!', 'Done!');
          setTimeout(() => {
            this.spinnerService.hide();
            this.routerRedirect.navigate(['/auth/login']);
           }, 2000);



      },
      error: (error) =>  {
        console.log('dddddddddddd',error);

        this.toastr.error(error.error.message);
        this.recoverError = 'Email not found'
        this.spinnerService.hide();
      }
    });
  }
}
