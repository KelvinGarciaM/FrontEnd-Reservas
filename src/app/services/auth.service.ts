import { Injectable, signal } from "@angular/core";
import { User } from "../models/user";
import { Observable, tap } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { enviroment } from "../enviroments";

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url: string;

  currentUser = signal<User | null>(null);

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl;
    this.restoreSession();
  }

  private restoreSession(): void {
    const identity = sessionStorage.getItem('identity');
    const token = sessionStorage.getItem('token');

    if (identity && identity !== 'undefined' && token) {
      try {
        const user: User = JSON.parse(identity);
        this.currentUser.set(user);
      } catch (e) {
        console.error('Error parsing identity', e);
        this.clearSession();
      }
    } else {
      this.clearSession();
    }
  }

  login(credentials: User): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.post<LoginResponse>(
      this.url + "login",
      credentials,
      { headers }
    ).pipe(
      tap((response) => {
        const user = {
          ...response.user,
          cedula: (response.user.cedula as any)?.String || response.user.cedula || '',
          image: (response.user.image as any)?.String || response.user.image || '',
          role: (response.user.role as any)?.String || response.user.role || ''
        };
        this.currentUser.set(user);
        sessionStorage.setItem('token', response.access_token);
        sessionStorage.setItem('identity', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.currentUser.set(null);
  }

  private clearSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('identity');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  register(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.post(
      this.url + "users",
      user,
      { headers }
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}