import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AuthStatus, LoginResponse, Response } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated);

  public authStatus = computed(() => this._authStatus());

  constructor() {}

  private setAuthentication(token: string): boolean {
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/mia-auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ success, response }) => {
        if (success) {
          this.setAuthentication(response.access_token);
          return true;
        } else {
          throw new Error('Authentication failed');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}
