import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-recover-passsword',
  templateUrl: './recover-passsword.component.html',
  styleUrls: ['./recover-passsword.component.css']
})
export class RecoverPassswordComponent implements OnInit {

  codeForm: FormGroup;
  setPasswordForm: FormGroup;
  codeIsValid: boolean;
  headertext: string;
  btnText: string;

  constructor() {
    this.codeForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
    this.setPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
    });
    this.headertext = 'Enter the code sent to your email address.';
    this.btnText = 'Check code';
  }

  ngOnInit(): void {
    this.codeIsValid = false;
  }

  checkCode() {
    this.codeIsValid = true;
  }

  resetPassword() {
    console.log('password reseted...');
  }
}
