import { Component, Input, Output, EventEmitter, OnChanges, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DetalleReserva } from '../../../models/detalle-reserva';
import { DetalleReservaService } from '../../../services/detalle-reserva.service';
import { HabitacionService } from '../../../services/habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reserva-detalle',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './reservas-detalle.html',
  styleUrl: './reservas-detalle.css'
})
export class ReservasDetalle implements OnInit, OnChanges, AfterViewInit {

  @Input()  idReserva: number | null = null;
  @Output() totalesChanged = new EventEmitter<{iva: number, subTotal: number, total: number}>();
  @ViewChild('inputEntrada') inputEntrada!: ElementRef;

  detalles:       DetalleReserva[] = [];
  habitaciones:   any[]            = [];
  fechasOcupadas: { fechaEntrada: string, fechaSalida: string }[] = [];
  tarifaActiva:   any              = null;
  loading         = false;
  fechaConflicto  = false;

  nuevoDetalle = {
    idHabitacion:     null as number | null,
    cantidadPersonas: 1,
    fechaEntrada:     '',
    fechaSalida:      ''
  };

  minDate: string = new Date().toISOString().split('T')[0];
  private fpEntrada: any = null;

  constructor(
    private detalleService:    DetalleReservaService,
    private habitacionService: HabitacionService,
    private cdr:               ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHabitaciones();
  }

  ngAfterViewInit(): void {
    this.initFlatpickr();
  }

  ngOnChanges(): void {
    if (this.idReserva) {
      this.loadDetalles();
    }
  }

  initFlatpickr(): void {
    if (this.fpEntrada) this.fpEntrada.destroy();

    this.fpEntrada = flatpickr(this.inputEntrada.nativeElement, {
      locale:     Spanish,
      dateFormat: 'Y-m-d',
      minDate:    'today',
      mode:       'range',
      disable:    [],
      onChange:   (selectedDates: any[], dateStr: string) => {
        if (selectedDates.length === 2) {
          const fmt = (d: Date) => d.toISOString().split('T')[0];
          this.nuevoDetalle.fechaEntrada = fmt(selectedDates[0]);
          this.nuevoDetalle.fechaSalida  = fmt(selectedDates[1]);
          this.validarFechas();
          this.cargarTarifa();
        } else {
          this.nuevoDetalle.fechaEntrada = '';
          this.nuevoDetalle.fechaSalida  = '';
          this.tarifaActiva              = null;
        }
        this.cdr.detectChanges();
      }
    });
  }

  onHabitacionChange(): void {
    if (!this.nuevoDetalle.idHabitacion) return;
    this.nuevoDetalle.fechaEntrada = '';
    this.nuevoDetalle.fechaSalida  = '';
    this.fechaConflicto            = false;
    this.tarifaActiva              = null;

    if (this.fpEntrada) this.fpEntrada.clear();

    this.detalleService.getFechasOcupadas(Number(this.nuevoDetalle.idHabitacion)).subscribe({
      next: (data) => {
        this.fechasOcupadas = data;
        const diasBloqueados = data.map((fo: any) => ({
          from: fo.fechaEntrada,
          to:   fo.fechaSalida
        }));
        if (this.fpEntrada) this.fpEntrada.set('disable', diasBloqueados);
        this.cdr.detectChanges();
      },
      error: () => this.fechasOcupadas = []
    });
  }

  cargarTarifa(): void {
    if (!this.nuevoDetalle.idHabitacion || !this.nuevoDetalle.fechaEntrada) return;
    this.detalleService.getTarifaByHabitacion(
      Number(this.nuevoDetalle.idHabitacion),
      this.nuevoDetalle.fechaEntrada
    ).subscribe({
      next: (data) => {
        this.tarifaActiva = data;
        this.cdr.detectChanges();
      },
      error: () => this.tarifaActiva = null
    });
  }

  validarFechas(): void {
    if (!this.nuevoDetalle.fechaEntrada || !this.nuevoDetalle.fechaSalida) return;

    const entrada = new Date(this.nuevoDetalle.fechaEntrada);
    const salida  = new Date(this.nuevoDetalle.fechaSalida);

    this.fechaConflicto = this.fechasOcupadas.some((fo: any) => {
      const foEntrada = new Date(fo.fechaEntrada);
      const foSalida  = new Date(fo.fechaSalida);
      return entrada < foSalida && salida > foEntrada;
    });

    this.cdr.detectChanges();
  }

  loadHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (data: any) => {
        this.habitaciones = data.habitaciones || data;
        this.cdr.detectChanges();
      },
      error: () => this.habitaciones = []
    });
  }

  loadDetalles(): void {
    if (!this.idReserva) return;
    this.detalleService.getDetallesByReserva(this.idReserva).subscribe({
      next: (data: any[]) => {
        this.detalles = data.map((d: any) => ({
          idDetalleReserva:     d.idDetalleReserva,
          idHabitacion:         null,
          idReserva:            this.idReserva,
          idTarifa:             null,
          cantidadPersonas:     d.cantidadPersonas,
          precioAplicado:       parseFloat(d.precioAplicado) || 0,
          fechaEntrada:         d.fechaEntrada,
          fechaSalida:          d.fechaSalida,
          iva:                  parseFloat(d.iva)           || 0,
          subTotal:             parseFloat(d.subTotal)      || 0,
          total:                parseFloat(d.total)         || 0,
          estado:               1,
          nombreTipoHabitacion: d.nombreTipoHabitacion,
          numeroHabitacion:     d.numeroHabitacion,
          nombreTarifa:         d.nombreTarifa   || '',
          descuentoBase:        parseFloat(d.descuentoBase) || 0
        }));

        // emite totales al padre
        this.totalesChanged.emit({
          iva:      this.ivaTotal,
          subTotal: this.subTotalReserva,
          total:    this.totalReserva
        });

        this.cdr.detectChanges();
      },
      error: () => this.detalles = []
    });
  }

  get totalReserva(): number {
    return this.detalles.reduce((acc, d) => acc + d.total, 0);
  }

  get ivaTotal(): number {
    return this.detalles.reduce((acc, d) => acc + d.iva, 0);
  }

  get subTotalReserva(): number {
    return this.detalles.reduce((acc, d) => acc + d.subTotal, 0);
  }

  agregarDetalle(): void {
    if (!this.nuevoDetalle.idHabitacion || !this.nuevoDetalle.fechaEntrada || !this.nuevoDetalle.fechaSalida) {
      Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Selecciona habitación, fecha de entrada y salida.' });
      return;
    }

    if (this.fechaConflicto) {
      Swal.fire({ icon: 'warning', title: 'Fechas ocupadas', text: 'Las fechas seleccionadas están ocupadas para esta habitación.' });
      return;
    }

    this.loading = true;

    const body = {
      idHabitacion:     Number(this.nuevoDetalle.idHabitacion),
      idReserva:        Number(this.idReserva),
      cantidadPersonas: Number(this.nuevoDetalle.cantidadPersonas),
      fechaEntrada:     this.nuevoDetalle.fechaEntrada,
      fechaSalida:      this.nuevoDetalle.fechaSalida
    };

    this.detalleService.createDetalle(body).subscribe({
      next: () => {
        this.loading = false;
        this.resetNuevoDetalle();
        this.loadDetalles();
        Swal.fire({ icon: 'success', title: '¡Habitación agregada!', timer: 1500, showConfirmButton: false });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.error || 'No se pudo agregar la habitación.' });
      }
    });
  }

  eliminarDetalle(id: number): void {
    Swal.fire({
      icon: 'warning',
      title: '¿Eliminar habitación?',
      text: 'Se quitará esta habitación de la reserva.',
      showCancelButton:   true,
      confirmButtonText:  'Sí, eliminar',
      cancelButtonText:   'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor:  '#64748b'
    }).then(result => {
      if (!result.isConfirmed) return;
      this.detalleService.deleteDetalle(id).subscribe({
        next: () => {
          this.loadDetalles();
          Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'Habitación eliminada de la reserva.', timer: 1500, showConfirmButton: false });
        },
        error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar.' })
      });
    });
  }

  resetNuevoDetalle(): void {
    this.nuevoDetalle   = { idHabitacion: null, cantidadPersonas: 1, fechaEntrada: '', fechaSalida: '' };
    this.fechaConflicto = false;
    this.tarifaActiva   = null;
    if (this.fpEntrada) this.fpEntrada.clear();
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}