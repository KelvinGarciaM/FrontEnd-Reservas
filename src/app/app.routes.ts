import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './components/home/home';

import { authGuard } from './guards/auth-guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';
import { TarifaAdd } from './components/tarifa/tarifa-add/tarifa-add';
import { TarifaList } from './components/tarifa/tarifa-list/tarifa-list';
import { TarifaEdit } from './components/tarifa/tarifa-edit/tarifa-edit';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // PUBLICO
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'tarifa-add', component: TarifaAdd },
      { path: 'tarifa-list', component: TarifaList },
      {
        path: 'tarifas/editar/:id',
        component: TarifaEdit,
      },
    ],
  },

  // PRIVADO
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [{ path: 'home', component: Home }],
  },
];
