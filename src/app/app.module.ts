import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TOTS_CORE_PROVIDER, TotsCoreModule } from '@tots/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TOTS_AUTH_PROVIDER, TotsAuthConfig, TotsAuthInterceptor, TotsAuthModule } from '@tots/auth';
import { TOTS_CLOUD_STORAGE_PROVIDER } from '@tots/cloud-storage';
import { CustomLoadingComponent } from './components/custom-loading/custom-loading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { totsTableDefaultConfig } from './entities/tots-table-default-config';
import { MatIconModule } from '@angular/material/icon';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { TableComponent } from './pages/table/Table.component';
import { TOTS_TABLE_DEFAULT_CONFIG, TotsTableModule } from '@tots/table';
import { TotsDateColumnModule } from '@tots/date-column';
import { TotsEditableColumnsModule } from '@tots/editable-columns';
import { TotsFormModule } from '@tots/form';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    CustomLoadingComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    /** Tots Libraries */
    TotsCoreModule,
    TotsAuthModule,
    TotsTableModule,
    TotsDateColumnModule,
    TotsEditableColumnsModule,
    TotsFormModule,
  ],
  providers: [
    {
      provide: TOTS_CORE_PROVIDER,
      useValue: {
        baseUrl: 'https://agency-coda.uc.r.appspot.com/'
      }
    },
    {
      provide: TOTS_CLOUD_STORAGE_PROVIDER,
      useValue: {
        bucket: 'codahub-files'
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TotsAuthInterceptor,
      multi: true
    },
    {
      provide: TOTS_AUTH_PROVIDER,
      useValue: {
        signInPath: 'oauth/token',
        changePasswordPath: 'users/me/password',
      } as TotsAuthConfig
    },
    {
      provide: TOTS_TABLE_DEFAULT_CONFIG,
      useValue: totsTableDefaultConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
