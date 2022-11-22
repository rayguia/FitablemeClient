import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  genders = [''];
  credentials: LoginModel = {name:'',email: '', password: '',c_password:''};
  // selectedGender: string;

  constructor(private router: Router,
              private spinnerService: NgxSpinnerService,
              private userService: UserService,
              private toastrService: ToastrService) {

    this.registerForm = new FormGroup({
      name: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl(''),
      c_password: new FormControl(''),
      gender: new FormControl(''),
      terms: new FormControl('')
    }, {validators: passwordMatchValidator});
    this.genders = ['F', 'M'];
  }

  ngOnInit(): void {
  }

  async register() {
    if (!this.registerForm.valid)
      return;

    await this.spinnerService.show();
    this.credentials.email = this.registerForm.get('username').value;
    this.credentials.password = this.registerForm.get('password').value;
    this.credentials.c_password = this.registerForm.get('c_password').value;
    this.credentials.name = this.registerForm.get('name').value;

    this.userService.register(this.credentials).subscribe( {
      next: (result: AuthResultModel) => {
        console.log('result', result);
        if (result.success)
        this.spinnerService.hide();
        this.toastrService.success('User register completed!, please log in.');
        this.awaitForRedirection(5000, '/auth/login');
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
