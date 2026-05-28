import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';

import { authGuard } from './guards/auth-guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';
export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // PUBLICO
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },

  // PRIVADO
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: Home }
    ]
  }

];