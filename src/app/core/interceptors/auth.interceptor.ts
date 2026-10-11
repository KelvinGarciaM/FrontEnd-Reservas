import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../../services/auth.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      const esLogin = req.url.endsWith('login');
      const esLogout = req.url.endsWith('logout');

      // 401 en una petición normal: la sesión venció o ya no es válida.
      // (El 401 del login significa "usuario o contraseña incorrectos".)
      if (err.status === 401 && !esLogin && !esLogout && auth.isAuthenticated()) {
        auth.clearLocalSession();
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Inicia sesión nuevamente para continuar.'
        }).then(() => router.navigate(['/login']));
      }

      // 403: el rol del usuario no permite esta acción.
      else if (err.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Sin permiso',
          text: err.error?.error ?? 'No tienes permiso para realizar esta acción.'
        });
      }

      return throwError(() => err);
    })
  );
};