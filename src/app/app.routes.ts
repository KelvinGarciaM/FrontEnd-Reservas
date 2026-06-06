import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Error } from './components/error/error'; 

import { authGuard, adminGuard } from './core/guards/auth-guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';
import { UsersComponent } from './components/users/users';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: Login }
    ]
  },

  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home',  component: Home  },
      { path: 'error', component: Error }, 

      // solo admin
      { path: 'usuarios', component: UsersComponent, canActivate: [adminGuard] },
    ]
  },

  { path: '**', redirectTo: 'login' }

];