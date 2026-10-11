import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public status = signal(-1);
  public username = '';
  public password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: any) {
    this.status.set(-1);

    if (form.invalid) {
      return;
    }

    // El usuario y la contraseña son los de SQL Server (usuario del motor).
    this.authService.login(this.username.trim(), this.password).subscribe({
      next: (response: LoginResponse) => {
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Sesión iniciada como ${response.user.role}`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 404) {
          this.status.set(0);   // usuario o contraseña incorrectos
        } else if (err.status === 403) {
          this.status.set(2);   // usuario del motor sin rol en el sistema
        } else {
          this.status.set(1);   // error del servidor
        }
      }
    });
  }
}