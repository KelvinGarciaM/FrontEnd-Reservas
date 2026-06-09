import { Component } from '@angular/core';
import { Tarifa } from '../../../models/tarifa';
import { TarifaService } from '../../../services/tarifa.service';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { TipoHabitacionService } from '../../../services/tipoHabitacion.service';
import { UtilsService } from '../../../services/utils.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-tarifa-add',
  imports: [FormsModule,RouterLink],
  templateUrl: './tarifa-add.html',
  styleUrl: './tarifa-add.css',
})
export class TarifaAdd {
  public tarifa: Tarifa;
  fechaActual: string = '';
  estadoTexto: string = '';
  tiposHabitacion = signal<any[]>([]);
  constructor(
    private tarifaService: TarifaService,
    private thService: TipoHabitacionService,
    private _utilsService: UtilsService
  ) {
    this.tarifa = new Tarifa();
    this.fechaActual = this._utilsService.obtenerFechaActual();
  }

  ngOnInit(): void {
    this.loadTiposHabitacion();
  }

  loadTiposHabitacion() {
    this.thService.getTiposHabitacion().subscribe({
      next: (response: any) => {
        console.log('TiposHabitacion: ', response);
        this.tiposHabitacion.set(response.tipoHabitacion);
      },
      error: (err) => {
        console.log('Error---------> ', err);
      },
    });
  }


  errorFechas: boolean = false;

  calcularEstado() {
    if (!this.tarifa.fechaInicio || !this.tarifa.fechaFin) {
      console.log('Return');
      return;
    }

    const hoy = this.fechaActual;
    const inicio = this.tarifa.fechaInicio;
    const fin = this.tarifa.fechaFin;

    console.log('Hoy:', hoy);
    console.log('Inicio:', inicio);
    console.log('Fin:', fin);

    if (inicio > fin) {
      this.errorFechas = true;
      this.tarifa.fechaFin='';
      this.tarifa.estado = 0;
          this.estadoTexto = 'Inactiva';
      return;
    }
    this.errorFechas=false

    if (hoy < inicio) {
      this.tarifa.estado = 0;
      this.estadoTexto = 'Próxima'
    } else if (hoy >= inicio && hoy <= fin) {
      this.tarifa.estado = 1;
      this.estadoTexto = 'Activa'
    } else {
      this.tarifa.estado = 0;
      this.estadoTexto = 'Inactiva'
    }

    console.log('Estado calculado:', this.tarifa.estado);
  }

  onSubmit(form: any) {
    this.tarifaService.createTarifa(this.tarifa).subscribe({
      next(response) {
        console.log(response);
         Swal.fire({
        icon:'success',
        title:'Tarifa guardada',
        text:'La tarifa se registró correctamente',
        confirmButtonColor:'#0d6efd',
        confirmButtonText:'Aceptar'
      });
      form.reset();
      },
      error: (err: Error) => {
        console.log('Error--------->', err);
         Swal.fire({
        icon:'error',
        title:'Error',
        text:'No se pudo guardar la tarifa',
        confirmButtonColor:'#dc3545'
      });

      },
    });
  }
}
