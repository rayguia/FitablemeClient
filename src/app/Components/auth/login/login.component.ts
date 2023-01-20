import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {ErrorStateMatcher} from "@angular/material/core";
import { LoginModel } from 'src/app/models/login.model';
import { UserService } from '../../shared/services/user.service';
import { AuthResultModel } from 'src/app/models/auth.result.model';

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
  credentials: LoginModel = {name:'',email: '', password: '',c_password:''};
  loginForm: FormGroup
  returnUrl: string = '/dashboard';
  loginError:string = ''
  token: string|undefined;
  constructor(private router: Router,
    private route: ActivatedRoute,
              private userService: UserService,
              private toastrService: ToastrService,
              private spinnerService: NgxSpinnerService) {


                this.token = undefined;
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])

    });
  }

  ngOnInit(): void {
       // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] !== '/' ? this.route.snapshot.queryParams['returnUrl'] : '/dashboard';
      this.userService.removeLogged()



  }

  // RECAPCHA VALIDATOR
  // public send(form: NgForm): void {
  //   if (form.invalid) {
  //     for (const control of Object.keys(form.controls)) {
  //       form.controls[control].markAsTouched();
  //     }
  //     return;
  //   }

  //   console.debug(`Token [${this.token}] generated`);
  // }

  async login() {
    this.loginError = '';
    if (!this.loginForm.valid)
      return;
    await this.spinnerService.show();
    this.credentials.email = this.loginForm.get('username').value;
    this.credentials.password = this.loginForm.get('password').value;


    this.userService.auth(this.credentials).subscribe( {
      next: (result: AuthResultModel) => {
        if (result.success)
          this.userService.saveSession(result);
          this.spinnerService.hide();
          console.log('this.returnUrl',this.returnUrl);
          if(this.returnUrl == undefined){
            this.router.navigate(['dashboard']);
          }else{
            this.router.navigate([this.returnUrl]);
          }


          //this.router.navigate(['/dashboard']);
      },
      error: (error) =>  {

        this.loginError = 'The email and password does not match our records.'
        this.spinnerService.hide();
        //this.toastrService.error('Invalid credentials');
      }
    });
    // console.log('login...');
    // console.log('email', this.loginForm.get('username').value)
    // console.log('password', this.loginForm.get('password').value)
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
