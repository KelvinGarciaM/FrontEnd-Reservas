import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/users.service';

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
  userImageBase64: string | null = null;
  initials         = '';

  private cfgRoutes = ['/tarifas', '/habitaciones', '/usuarios', '/recepcionistas'];

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();

    const name    = user?.name ?? '';
    this.initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    if (user?.image) {
      this.userService.getImageBlob(user.image).subscribe({
        next: (base64) => {
          this.userImageBase64 = base64;
          this.cdr.detectChanges();
        },
        error: () => this.userImageBase64 = null
      });
    }

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
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}