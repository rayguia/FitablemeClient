import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginModel} from '../../models/login.model';
import {UserService} from "../../shared/services/user.service";
import {AuthResultModel} from "../../models/auth.result.model";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ErrorStateMatcher} from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  credentials: LoginModel = {Email: '', Password: ''};
  loginForm: FormGroup

  constructor(private router: Router,
              private userService: UserService,
              private toastrService: ToastrService,
              private spinnerService: NgxSpinnerService) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {

  }

  async login() {
    if (!this.loginForm.valid)
      return;
    await this.spinnerService.show();
    this.credentials.Email = this.loginForm.get('username').value;
    this.credentials.Password = this.loginForm.get('password').value;

    this.userService.auth(this.credentials).subscribe( {
      next: (result: AuthResultModel) => {
        if (result.token && result.refreshToken)
          this.userService.saveSession(result);
          this.spinnerService.hide();
          this.router.navigate(['/home']);
      },
      error: () =>  {
        this.spinnerService.hide();
        this.toastrService.error('Invalid credentials');
      }
    });
    console.log('login...');
    console.log('email', this.loginForm.get('username').value)
    console.log('password', this.loginForm.get('password').value)
  }

  // login = ( form: NgForm) => {
  //   if (form.valid) {
  //     this.http.post<AuthenticatedResponse>("http://localhost:5000/api/auth/login", this.credentials, {
  //       headers: new HttpHeaders({ "Content-Type": "application/json"})
  //     })
  //     .subscribe({
  //       next: (response: AuthenticatedResponse) => {
  //         const token = response.token;
  //         const refreshToken = response.refreshToken;
  //         localStorage.setItem("jwt", token);
  //         localStorage.setItem("refreshToken", refreshToken);
  //         this.invalidLogin = false;
  //         this.router.navigate(["/"]);
  //       },
  //       error: (err: HttpErrorResponse) => this.invalidLogin = true
  //     })
  //   }
  // }
}
