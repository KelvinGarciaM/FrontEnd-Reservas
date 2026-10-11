import { Injectable, signal, computed } from "@angular/core";
import { User } from "../models/user";
import { Observable, tap, catchError, of } from "rxjs";
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

  // Atajo para mostrar u ocultar funciones en las pantallas.
  isAdmin = computed(() => this.currentUser()?.role === 'Administrador');

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

  // Inicia sesión con un usuario del motor de base de datos.
  login(username: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this._http.post<LoginResponse>(
      this.url + "login",
      { username, password },
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

  // Avisa al servidor (queda en la auditoría) y limpia la sesión local.
  // Aunque el servidor falle o la sesión ya haya vencido, igual se limpia.
  logout(): Observable<unknown> {
    return this._http.post(this.url + "logout", {}).pipe(
      catchError(() => of(null)),
      tap(() => this.clearLocalSession())
    );
  }

  // Limpia la sesión solo en el navegador (sin llamar al servidor).
  clearLocalSession(): void {
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

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}