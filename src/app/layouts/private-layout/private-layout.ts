import { Component, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './private-layout.html'
})
export class PrivateLayoutComponent {

  constructor(public authService: AuthService) {

    //  Esto imprime cada vez que cambie el usuario
    effect(() => {
      console.log(' CURRENT USER:', this.authService.currentUser());
    });

  }

  logout() {
    this.authService.logout();
  }
}