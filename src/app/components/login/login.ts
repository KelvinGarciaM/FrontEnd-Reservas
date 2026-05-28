import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { User } from '../../models/user';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
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

    this.user = new User(
      null,
      '',
      '',
      '',
      1,
      '',
      ''
    );

  }

  onSubmit(form: any) {

    this.status.set(-1);

    if (form.invalid) {
      this.status.set(-1);
      return;
    }

    this.authService.login(this.user).subscribe({

      next: (response: LoginResponse) => {

        console.log('LOGIN RESPONSE:', response);

        // 🔥 IMPORTANTE: el AuthService ya guarda token + user
        // NO necesitas hacer nada más aquí

        this.router.navigate(['/home']);

      },

      error: (err) => {

        console.log('LOGIN ERROR:', err);

        if (err.status === 401 || err.status === 404) {
          this.status.set(0); // usuario o password incorrecto
        } else {
          this.status.set(1); // error del servidor
        }

      }

    });

  }

}