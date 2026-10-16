import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
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
  public user: User;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = new User(null, '', '', '', 1, '', '');
  }

  onSubmit(form: any) {
    this.status.set(-1);

    if (form.invalid) {
      return;
    }

    this.authService.login(this.user).subscribe({



      next: (response: LoginResponse) => {
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Hola, ${response.user.name ?? ''}`,
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        if (err.status === 401 || err.status === 404) {
          this.status.set(0);
        } else {
          this.status.set(1);
        }
      }
    });
  }
}