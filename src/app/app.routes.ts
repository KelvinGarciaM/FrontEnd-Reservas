import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Error } from './components/error/error';

import { authGuard, adminGuard } from './core/guards/auth-guard';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout';

import { TarifaAdd } from './components/tarifa/tarifa-add/tarifa-add';
import { TarifaList } from './components/tarifa/tarifa-list/tarifa-list';
import { TarifaEdit } from './components/tarifa/tarifa-edit/tarifa-edit';
import { TarifaDetail } from './components/tarifa/tarifa-detail/tarifa-detail';

import { UsersComponent } from './components/users/users';
import { TipoHabitacionComponent } from './components/tipo-habitacion/tipo-habitacion';
import { HabitacionComponent } from './components/habitacion/habitacion';
import { RecepcionistaComponent } from './components/recepcionista/recepcionista';
import { ClientesComponent } from './components/clientes/clientes';
import { TiposClienteComponent } from './components/tipos-cliente/tipos-cliente';
import { Reservas } from './components/reservas/reservas';
import { Dashboard } from './components/dashboard/dashboard';

// Vista nueva de respaldo.
// IMPORTANTE: el nombre entre llaves debe ser igual al "export class ..." de respaldo.ts
import { RespaldoComponent } from './components/respaldo/respaldo';

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
      { path: 'dashboard', component: Dashboard },
      { path: 'error', component: Error },
      { path: 'tarifa-list', component: TarifaList },
      { path: 'tarifa-add', component: TarifaAdd },
      { path: 'tarifas/editar/:id', component: TarifaEdit },
      { path: 'tarifas/detalle/:id', component: TarifaDetail },

      // solo admin
      { path: 'reservas', component: Reservas },
      { path: 'usuarios', component: UsersComponent, canActivate: [adminGuard] },
      { path: 'tipos-habitacion', component: TipoHabitacionComponent, canActivate: [adminGuard] },
      { path: 'habitacion', component: HabitacionComponent, canActivate: [adminGuard] },
      { path: 'recepcionistas', component: RecepcionistaComponent, canActivate: [adminGuard] },
      { path: 'respaldo', component: RespaldoComponent, canActivate: [adminGuard] },

      { path: 'tipos-cliente', component: TiposClienteComponent },
      { path: 'clientes', component: ClientesComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];