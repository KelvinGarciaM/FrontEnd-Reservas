import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html'
})
export class Register {

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
      return;
    }

    this.authService.register(this.user).subscribe({

      next: (res) => {
        console.log('USER CREATED:', res);

        this.status.set(1);

        // redirigir al login después de crear usuario
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },

      error: (err) => {
        console.log(err);

        this.status.set(0);
      }

    });
  }
}