import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Error } from './components/error/error'; 

import { authGuard, adminGuard } from './core/guards/auth-guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';

import { TarifaAdd } from './components/tarifa/tarifa-add/tarifa-add';
import { TarifaList } from './components/tarifa/tarifa-list/tarifa-list';
import { TarifaEdit } from './components/tarifa/tarifa-edit/tarifa-edit';

import { UsersComponent } from './components/users/users';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: PublicLayoutComponent,
    children: [

      { path: 'login', component: Login },
      //{ path: 'register', component: Register },
     
      
      
    ],

  },

  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],

    children: [
      { path: 'home',  component: Home  },
      { path: 'error', component: Error },
      { path: 'tarifa-list', component: TarifaList }, 
       { path: 'tarifa-add', component: TarifaAdd },
       {path: 'tarifas/editar/:id',component: TarifaEdit,},

      // solo admin
      { path: 'usuarios', component: UsersComponent, canActivate: [adminGuard] },
    ]
  },

  { path: '**', redirectTo: 'login' }

];

