import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const isLogged =
    authService.currentUser() !== null ||
    sessionStorage.getItem('token') !== null;

  if (isLogged) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};