import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {passwordMatchValidator} from "../custom-validators/password-validator";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  genders = [''];
  selectedGender: string;

  constructor(private router: Router) {
    this.registerForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      gender: new FormControl(''),
      terms: new FormControl('')
    }, {validators: passwordMatchValidator});
    this.genders = ['F', 'M'];
  }

  ngOnInit(): void {
  }

  register() {

  }

  async cancel() {
    await this.router.navigate(['/auth/login']);
  }
}
