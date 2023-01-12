import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {passwordMatchValidator} from "../custom-validators/password-validator";
import {AuthResultModel} from "../../../models/auth.result.model";
import {LoginModel} from "../../../models/login.model";
import {NgxSpinnerService} from "ngx-spinner";
import {UserService} from "../../shared/services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation : ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  genders = [''];
  registerError:string = ''
  credentials: LoginModel = {name:'',email: '', password: '',c_password:''};
  // selectedGender: string;

  constructor(private router: Router,
              private spinnerService: NgxSpinnerService,
              private userService: UserService,
              private toastrService: ToastrService) {

    this.registerForm = new FormGroup({
      full_name: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required]),
      c_password: new FormControl('',[Validators.required]),
      terms: new FormControl('',[Validators.requiredTrue])
    }, {validators: passwordMatchValidator});

  }

  ngOnInit(): void {
  }

  async register() {
    if (!this.registerForm.valid)
      return;

    await this.spinnerService.show();
    this.credentials.email = this.registerForm.get('email').value;
    this.credentials.password = this.registerForm.get('password').value;
    this.credentials.c_password = this.registerForm.get('c_password').value;
    this.credentials.name = this.registerForm.get('full_name').value;

    this.userService.register(this.credentials).subscribe( {
      next: (result: AuthResultModel) => {
        console.log('result', result);
        if (result.success)
        this.toastrService.success('User register completed!, redirecting....');
        this.userService.saveSession(result);
        this.awaitForRedirection(1000, 'dashboard');
        this.spinnerService.hide();
      },
      error: () =>  {
        this.spinnerService.hide();
        this.toastrService.error('An error occurred, please try again.');
      }
    });
  }

  private awaitForRedirection(awaitTime: number, route: string) {
    setTimeout(async () => {
      await this.router.navigate([route]);
    }, awaitTime);
  }

  async cancel() {
    await this.router.navigate(['/auth/login']);
  }
}
