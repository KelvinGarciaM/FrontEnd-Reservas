import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './private-layout.html',
  styleUrl: './private-layout.css'
})
export class PrivateLayoutComponent implements OnInit {

  pageTitle        = 'Dashboard';
  collapsed        = false;
  cfgOpen          = false;
  userImageBase64: string | null = null;   // ya no hay fotos de usuario
  initials         = '';

  private cfgRoutes = ['/tarifas', '/tipos-habitacion', '/habitacion', '/recepcionistas'];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();

    // Iniciales a partir del rol (AD = Administrador, RE = Recepcionista)
    const base = user?.role || user?.name || '';
    this.initials = base.slice(0, 2).toUpperCase();

    // abre el submenú si ya estás en una ruta de configuración
    this.checkCfgRoute(this.router.url);

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.checkCfgRoute(e.urlAfterRedirects);
    });
  }

  private checkCfgRoute(url: string): void {
    this.cfgOpen = this.cfgRoutes.some(r => url.startsWith(r));
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    // Registra el cierre de sesión en el servidor y limpia la sesión local.
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}