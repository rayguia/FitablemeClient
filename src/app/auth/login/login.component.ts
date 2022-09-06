import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { IAuthenticatedResponse } from '../../_interfaces/IAuthenticateResponse';
import { LoginModel } from '../../_interfaces/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  credentials: LoginModel = {username:'', password:''};
  loginForm: FormGroup

  constructor(private router: Router, private http: HttpClient) {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {

  }

  login(): void {
    if (!this.loginForm.valid)
      return;


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
