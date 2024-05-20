import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RegisterFormComponent } from 'src/app/components/register-form/register-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: []
})
export class LoginPageComponent implements OnInit {

  private router = inject( Router )
  private authService = inject( AuthService )

  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(30),Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
      password: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(5)]]
    });

    this.loginForm.reset();
  }

  isValid( campo: string) {
    return this.loginForm.controls[campo].errors 
            && this.loginForm.controls[campo].touched;
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(email, password)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loginForm.reset();
            this.router.navigateByUrl('/table-client');
          },
          error: (message) => {
            this.isLoading = false;
            this.loginForm.reset();
            Swal.fire('This account does not exist!', message, 'error');
          }
        });
    } else {
      Swal.fire('This account does not exist', 'Error logging in', 'error');
    }
  }

  goToRegister(): void { 
    const dialogRef = this.dialog.open(RegisterFormComponent); 
    dialogRef.afterClosed().subscribe(result => { 
      result
    }); 
  } 
}
