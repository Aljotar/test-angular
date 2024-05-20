import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material/material.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TotsFormModule } from '@tots/form';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    TotsFormModule,
    ReactiveFormsModule  
  ]
})
export class AuthModule { }
