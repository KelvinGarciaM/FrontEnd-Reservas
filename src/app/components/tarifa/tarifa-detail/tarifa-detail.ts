import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TarifaService } from '../../../services/tarifa.service';
import { UtilsService } from '../../../services/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarifa-detail',
  imports: [RouterLink],
  templateUrl: './tarifa-detail.html',
  styleUrl: './tarifa-detail.css',
})
export class TarifaDetail implements OnInit {
  tarifa = signal<any>(null);
  idTarifa: number = 0;
  fechaActual: string = '';
  duracionDias: number = 0;
  estadisticas = signal<any>({
    totalReservas: 0,
    ultimaVezUtilizada: null,
  });

  constructor(
    private route: ActivatedRoute,
    private tarifaService: TarifaService,
    private utilsService: UtilsService,
  ) {
    this.fechaActual = this.utilsService.obtenerFechaActual();
  }

  ngOnInit(): void {
    this.idTarifa = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTarifa();
    this.loadEstadisticas();
  }

  loadTarifa() {
    this.tarifaService.getTarifas().subscribe({
      next: (response: any) => {
        const encontrada = response.find((t: any) => t.idtarifa === this.idTarifa);

        if (encontrada) {
          this.tarifa.set(encontrada);
          this.calcularDuracion();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  calcularDuracion() {
    const t = this.tarifa();

    if (!t.fechainicio || !t.fechafin) {
      this.duracionDias = 0;
      return;
    }

    const inicio = new Date(t.fechainicio);
    const fin = new Date(t.fechafin);

    const diferencia = fin.getTime() - inicio.getTime();

    this.duracionDias = Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;
  }

  getEstadoTexto(): string {
    const t = this.tarifa();

    if (!t) {
      return '';
    }

    if (
      t.estado === 'Activo' &&
      this.fechaActual >= t.fechainicio &&
      this.fechaActual <= t.fechafin
    ) {
      return 'Activa';
    }

    if (this.fechaActual < t.fechainicio) {
      return 'Próxima';
    }

    return 'Inactiva';
  }

  getMotivoInactiva(): string {
    const t = this.tarifa();

    if (!t) return '';

    if (t.desactivadaManual === 1) {
      return 'La tarifa fue desactivada manualmente por un administrador.';
    }

    if (t.fechafin < this.fechaActual) {
      return `La tarifa venció el ${t.fechafin}.`;
    }

    return 'La tarifa se encuentra inactiva.';
  }

  loadEstadisticas() {
    this.tarifaService.getEstadisticasTarifa(this.idTarifa).subscribe({
      next: (response: any) => {
        this.estadisticas.set(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  puedeActivarse(): boolean {
    const t = this.tarifa();

    if (!t) return false;
    return t.fechainicio <= this.fechaActual && t.fechafin >= this.fechaActual;
  }

  activarTarifa() {
    const tarifa = this.tarifa();
    if (!tarifa) return;
    Swal.fire({
      title: '¿Activar tarifa?',
      text: `La tarifa "${tarifa.nombretarifa}" volverá a estar disponible.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tarifaService.activarTarifa(tarifa.idtarifa).subscribe({
          next: (response) => {
            this.loadTarifa();

            Swal.fire({
              icon: 'success',
              title: 'Tarifa activada',
              text: 'La tarifa se activó correctamente.',
              confirmButtonColor: '#198754',
            });
          },

          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error.error,
              confirmButtonColor: '#dc3545',
            });
          },
        });
      }
    });
  }

  desactivarTarifa() {
    const tarifa = this.tarifa();
    if (!tarifa) return;
    Swal.fire({
      title: '¿Desactivar tarifa?',
      text: `La tarifa "${tarifa.nombretarifa}" dejará de estar disponible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tarifaService.desactivarTarifa(tarifa.idtarifa).subscribe({
          next: (response) => {
            this.loadTarifa();

            Swal.fire({
              icon: 'success',
              title: 'Tarifa desactivada',
              text: 'La tarifa se desactivó correctamente.',
              confirmButtonColor: '#0d6efd',
            });
          },

          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo desactivar la tarifa.',
              confirmButtonColor: '#dc3545',
            });
          },
        });
      }
    });
  }
}
