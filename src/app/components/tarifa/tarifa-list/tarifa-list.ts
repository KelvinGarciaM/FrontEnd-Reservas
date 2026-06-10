import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { TarifaAdd } from '../tarifa-add/tarifa-add';
import { TarifaService } from '../../../services/tarifa.service';
import { computed } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
declare var $: any;
@Component({
  selector: 'app-tarifa-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './tarifa-list.html',
  styleUrl: './tarifa-list.css',
})
export class TarifaList implements OnInit {
  tarifas = signal<any[]>([]);
  tiposHabitacion = signal<any[]>([]);
  fechaActual: string = '';
  paginaActual = 0;
  constructor(
    private tarifaService: TarifaService,
    private _utilsService: UtilsService,
    private _thService: TipoHabitacionService,
  ) {
    this.fechaActual = _utilsService.obtenerFechaActual();
  }

  guardarPaginaActual() {
    if ($.fn.DataTable.isDataTable('#tablaTarifas')) {
      this.paginaActual = $('#tablaTarifas').DataTable().page();
    }
  }

  totalActivas = computed(
    () =>
      this.tarifas().filter(
        (t) =>
          (t.estado === 'Activo' &&
            this.fechaActual >= t.fechainicio &&
            this.fechaActual <= t.fechafin) ||
          (t.estado === 'Activo' && t.fechainicio === null && t.fechafin === null),
      ).length,
  );

  totalProximas = computed(
    () => this.tarifas().filter((t) => this.fechaActual < t.fechainicio).length,
  );

  totalInactivas = computed(
    () =>
      this.tarifas().filter((t) => t.fechafin < this.fechaActual || t.estado === 'Inactivo').length,
  );

  contarTarifasPorTipo(tipo: string): number {
    return this.tarifas().filter((t) => t.tipohabitacion === tipo).length;
  }

  loadTiposHabitacion() {
    this._thService.getTiposHabitacion().subscribe({
      next: (response: any) => {
        console.log('TiposHabitacion: ', response);
        this.tiposHabitacion.set(response.tipoHabitacion);
      },
      error: (err) => {
        console.log('Error---------> ', err);
      },
    });
  }

  ngOnInit(): void {
    this.loadTarifas();
    this.loadTiposHabitacion();
    console.log('Fecha Actual: ', this.fechaActual);
  }
  loadTarifas() {
    this.tarifaService.getTarifas().subscribe({
      next: (response: any) => {
        this.tarifas.set(response);
        console.log('Tarifas: ', response);

        setTimeout(() => {
          if ($.fn.DataTable.isDataTable('#tablaTarifas')) {
            $('#tablaTarifas').DataTable().destroy();
          }

          const tabla = $('#tablaTarifas').DataTable({
            pageLength: 5,
            lengthChange: false,
            ordering: true,
            searching: true,
            paging: true,
            dom: 'rtip',
            language: {
              zeroRecords: 'No se encontraron resultados',
              info: 'Mostrando _START_ a _END_ de _TOTAL_ resultados',
              infoEmpty: 'No hay registros disponibles',
              paginate: {
                next: 'Siguiente',
                previous: 'Anterior',
              },
            },
          });
          tabla.page(this.paginaActual).draw('page');

          $('#filtroBusqueda').on('keyup', function (event: any) {
            const valor = $(event.target).val();
            tabla.search(valor).draw();
          });

          $('#filtroTipoHabitacion').on('change', function (event: any) {
            const valor = $(event.target).val();

            if (valor === 'Todos') {
              tabla.column(2).search('').draw();
            } else {
              tabla.column(2).search(valor).draw();
            }
          });

          $('#filtroFechaInicio').on('change', function (event: any) {
            const valor = $(event.target).val();
            tabla.column(4).search(valor).draw();
          });

          $('#filtroFechaFin').on('change', function (event: any) {
            const valor = $(event.target).val();
            tabla.column(5).search(valor).draw();
          });

          $('#btnLimpiarFiltros').on('click', function () {
            $('#filtroBusqueda').val('');
            $('#filtroTipoHabitacion').val('Todos');
            $('#filtroFechaInicio').val('');
            $('#filtroFechaFin').val('');

            tabla.search('');
            tabla.columns().search('');
            tabla.draw();
          });
        }, 0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  puedeActivarse(tarifa: any): boolean {
    return tarifa.fechainicio <= this.fechaActual && tarifa.fechafin >= this.fechaActual;
  }

  activarTarifa(tarifa: any) {
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
        this.guardarPaginaActual();

        this.tarifaService.activarTarifa(tarifa.idtarifa).subscribe({
          next: (response) => {
            this.loadTarifas();

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

  desactivarTarifa(tarifa: any) {
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
        this.guardarPaginaActual();

        this.tarifaService.desactivarTarifa(tarifa.idtarifa).subscribe({
          next: (response) => {
            this.loadTarifas();

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
