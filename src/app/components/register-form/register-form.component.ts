import { Component, type OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginInterface } from 'src/app/interfaces';
import { RegisterService } from 'src/app/services/register.service';
import Swal from 'sweetalert2';
import {
  RowFieldComponent,
  StringFieldComponent,
  SubmitButtonFieldComponent,
  TotsActionForm,
  TotsFieldForm,
} from '@tots/form';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit {
  fields = new Array<TotsFieldForm>();
  item = {};
  errorForm!: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private registerService: RegisterService,
    public dialogRef: MatDialogRef<RegisterFormComponent>
  ) {}
  ngOnInit(): void {
    this.configForm();
  }

  onActionForm(action: TotsActionForm) {
    console.log(action);
    if (action.key == 'submit') {
      this.registerUser(action.item);
    }
  }

  configForm() {
    this.fields = [
      {
        key: '',
        component: RowFieldComponent,
        extra: {
          fields: [
            {
              key: 'email',
              component: StringFieldComponent,
              label: 'Email',
              validators: [
                Validators.required,
                Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                Validators.maxLength(30),
                Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
              ],
              errors: [
                { name: 'required', message: 'You must enter a value' },
                {
                  name: 'pattern',
                  message: 'You must enter a correct email account',
                },
              ],
            },
            {
              key: 'password',
              component: StringFieldComponent,
              label: 'Password',
              validators: [
                Validators.required,
                Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                Validators.maxLength(30),
              ],
              errors: [{ name: 'required', message: 'You must enter a value' }],
            },
          ],
        },
      },
      { key: 'submit', component: SubmitButtonFieldComponent, label: 'Send' },
    ];
  }

  registerUser(formData: LoginInterface) {
    this.registerService.userRegistration(formData.email, formData.password).subscribe({
      next: (response) => {
        if (response) {
          Swal.fire({
            title: "Registration completed",
            text: "you can now log in!",
            icon: "success"
          });
          this.dialogRef.close();
        }
      },
      error: (message) => {
        Swal.fire('This account already exists!', message, 'error');
      }
    });
  }
}
