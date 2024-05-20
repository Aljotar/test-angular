import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';
import { RegisterResponse } from '../interfaces';
import { RegistryResponse } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  constructor() { }

  userRegistration(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/mia-auth/register`;
    const body = { email, password };

    return this.http.post<RegisterResponse>(url, body).pipe(
      map(( response: RegisterResponse ) => {
        if (response.success) {
          return true;
        } else {
          throw new Error(response.error?.message || 'Registration failed');
        }
      }),
    );
  }
}
