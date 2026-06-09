import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Tarifa } from '../../../models/tarifa';
import { TarifaService } from '../../../services/tarifa.service';
import { TipoHabitacionService } from '../../../services/tipoHabitacion.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-tarifa-edit',
  imports: [FormsModule,RouterLink],
  templateUrl: './tarifa-edit.html',
  styleUrl: './tarifa-edit.css',
})
export class TarifaEdit implements OnInit {
  public tarifa: Tarifa = new Tarifa();
  tiposHabitacion = signal<any[]>([]);
  idTarifa: number = 0;
  tarifaCargada = signal(false);
  fechaActual: string = '';
  errorFechas: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tarifaService: TarifaService,
    private thService: TipoHabitacionService,
    private utilsService: UtilsService,
  ) {
    this.fechaActual = this.utilsService.obtenerFechaActual();
  }

  ngOnInit(): void {
    this.idTarifa = Number(this.route.snapshot.paramMap.get('id'));

    this.loadTiposHabitacion();
  }

  loadTiposHabitacion() {
    this.thService.getTiposHabitacion().subscribe({
      next: (response: any) => {
        console.log('tiposHab: ', response);
        this.tiposHabitacion.set(response.tipoHabitacion);
        this.loadTarifa();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadTarifa() {
    this.tarifaService.getTarifas().subscribe({
      next: (response: any) => {
        const tarifaEncontrada = response.find((t: any) => t.idtarifa === this.idTarifa);

        if (tarifaEncontrada) {
          const tipo = this.tiposHabitacion().find(
            (th) => th.nombretipohab === tarifaEncontrada.tipohabitacion,
          );

          this.tarifa = new Tarifa(
            tarifaEncontrada.idtarifa,
            tipo ? tipo.idtipohabitacion : null,
            tarifaEncontrada.nombretarifa,
            Number(tarifaEncontrada.preciobase),
            tarifaEncontrada.fechainicio,
            tarifaEncontrada.fechafin,
            tarifaEncontrada.descripcion ?? '',
            tarifaEncontrada.estado === 'Activo' ? 1 : 0,
          );

          this.calcularEstado();
         this.tarifaCargada.set(true);
          console.log('Tarifa final:', this.tarifa);
        }
       
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  calcularEstado() {
    if (!this.tarifa.fechaInicio || !this.tarifa.fechaFin) {
      return;
    }

    if (this.tarifa.fechaInicio > this.tarifa.fechaFin) {
      this.errorFechas = true;
      this.tarifa.estado = 0;
      return;
    }

    this.errorFechas = false;

    if (this.fechaActual < this.tarifa.fechaInicio) {
      this.tarifa.estado = 2;
    } else if (
      this.fechaActual >= this.tarifa.fechaInicio &&
      this.fechaActual <= this.tarifa.fechaFin
    ) {
      this.tarifa.estado = 1;
    } else {
      this.tarifa.estado = 0;
    }
  }

  getEstadoTexto(): string {
    switch (this.tarifa.estado) {
      case 1:
        return 'Activa';
      case 2:
        return 'Próxima';
      case 0:
        return 'Inactiva';
      default:
        return '';
    }
  }

  onSubmit(form: any) {
    if (form.invalid || this.errorFechas) {
      return;
    }

    this.tarifaService.updateTarifa(this.idTarifa, this.tarifa).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/tarifas']);
      },
      error: (err) => {
        console.log('Error al actualizar tarifa:', err);
      },
    });
  }
}
