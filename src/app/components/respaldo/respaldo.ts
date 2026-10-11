
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Respaldo {
  nombre: string;
  fecha: string;
  tamano?: string;
}

@Component({
  selector: 'app-respaldo',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './respaldo.html',
  styleUrl: './respaldo.css'
})
export class RespaldoComponent implements OnInit {

  private readonly apiUrl = 'http://localhost:8080/api/v1';

  respaldos: Respaldo[] = [];
  respaldoSeleccionado: string | null = null;

  cargando = false;
  creandoRespaldo = false;
  restaurando = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRespaldos();
  }

  cargarRespaldos(): void {
    this.cargando = true;

    this.http.get<Respaldo[]>(`${this.apiUrl}/respaldos`).subscribe({
      next: (data) => {
        this.respaldos = data ?? [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.respaldos = [];
        this.cargando = false;
        this.cdr.detectChanges();

        Swal.fire({
          icon: 'error',
          title: 'Error al cargar respaldos',
          text: err.error?.mensaje ??
            'No se pudieron consultar los respaldos. Comprueba que el backend esté disponible.'
        });
      }
    });
  }

  crearRespaldo(): void {
    if (this.creandoRespaldo || this.restaurando) return;

    Swal.fire({
      icon: 'question',
      title: '¿Crear respaldo completo?',
      text: 'Se solicitará al servidor una copia de seguridad completa de la base de datos.',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear respaldo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b'
    }).then((resultado) => {
      if (!resultado.isConfirmed) return;

      this.creandoRespaldo = true;
      this.cdr.detectChanges();

      this.http.post<{ mensaje?: string }>(
        `${this.apiUrl}/respaldos`,
        {}
      ).subscribe({
        next: (respuesta) => {
          this.creandoRespaldo = false;
          this.cdr.detectChanges();

          Swal.fire({
            icon: 'success',
            title: 'Solicitud completada',
            text: respuesta.mensaje ??
              'El respaldo se creó correctamente.',
            confirmButtonColor: '#2563eb'
          }).then(() => this.cargarRespaldos());
        },
        error: (err) => {
          this.creandoRespaldo = false;
          this.cdr.detectChanges();

          Swal.fire({
            icon: 'error',
            title: 'Error al crear respaldo',
            text: err.error?.mensaje ??
              'No fue posible crear el respaldo.'
          });
        }
      });
    });
  }

  seleccionarRespaldo(nombre: string): void {
    this.respaldoSeleccionado = nombre;
  }

  restaurarRespaldo(): void {
    if (!this.respaldoSeleccionado) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un respaldo',
        text: 'Debes seleccionar una copia de seguridad antes de restaurar.'
      });
      return;
    }

    if (this.creandoRespaldo || this.restaurando) return;

    Swal.fire({
      icon: 'warning',
      title: '¿Restaurar la base de datos?',
      html: `
        <p>Se utilizará el siguiente respaldo:</p>
        <strong>${this.escapeHtml(this.respaldoSeleccionado)}</strong>
        <p style="color:#dc2626;margin-top:12px">
          Esta operación puede reemplazar los datos actuales.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b'
    }).then((resultado) => {
      if (!resultado.isConfirmed) return;

      Swal.fire({
        icon: 'warning',
        title: 'Confirmación final',
        text: '¿Estás seguro de que deseas continuar con la restauración?',
        showCancelButton: true,
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'No, cancelar',
        confirmButtonColor: '#dc2626'
      }).then((segundaConfirmacion) => {
        if (!segundaConfirmacion.isConfirmed) return;

        this.ejecutarRestauracion();
      });
    });
  }

  private ejecutarRestauracion(): void {
    if (!this.respaldoSeleccionado) return;

    this.restaurando = true;
    this.cdr.detectChanges();

    this.http.post<{ mensaje?: string }>(
      `${this.apiUrl}/respaldos/restaurar`,
      { nombre: this.respaldoSeleccionado }
    ).subscribe({
      next: (respuesta) => {
        this.restaurando = false;
        this.cdr.detectChanges();

        Swal.fire({
          icon: 'success',
          title: 'Restauración completada',
          text: respuesta.mensaje ??
            'La restauración se completó correctamente.',
          confirmButtonColor: '#2563eb'
        }).then(() => this.cargarRespaldos());
      },
      error: (err) => {
        this.restaurando = false;
        this.cdr.detectChanges();

        Swal.fire({
          icon: 'error',
          title: 'Error al restaurar',
          text: err.error?.mensaje ??
            'No fue posible restaurar la base de datos.'
        });
      }
    });
  }

  private escapeHtml(texto: string): string {
    return texto.replace(/[&<>"']/g, (caracter) => {
      const entidades: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };

      return entidades[caracter];
    });
  }
}
