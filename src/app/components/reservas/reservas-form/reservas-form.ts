import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../../models/reserva';
import { Cliente } from '../../../models/cliente';
import { Recepcionista } from '../../../models/recepcionista';
import { ReservasService } from '../../../services/reservas.service';
import { ClienteService } from '../../../services/cliente.service';
import { RecepcionistaService } from '../../../services/recepcionistas.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { ReservasDetalle } from '../reservas-detalle/reservas-detalle';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [FormsModule, ReservasDetalle],
  templateUrl: './reservas-form.html',
  styleUrl: './reservas-form.css'
})
export class ReservaForm implements OnInit, OnChanges {

  @Input() editingReserva: Reserva | null = null;
  @Output() formClosed   = new EventEmitter<void>();
  @Output() reservaSaved = new EventEmitter<void>();

  minDate: string = new Date().toISOString().slice(0, 16);

  reserva: Reserva = new Reserva();
  editMode         = false;
  loading          = false;
  reservaGuardada  = false;
  idReservaCreada: number | null = null;

  mostrarDatosReserva = true;
  mostrarHabitaciones = true;

  // cliente
  cedulaCliente     = '';
  clienteEncontrado: Cliente | null = null;
  buscandoCliente   = false;
  clienteError      = '';

  // recepcionista
  esAdmin           = false;
  recepcionistas: Recepcionista[] = [];

  estadosReserva = ['Pendiente', 'Confirmada', 'Cancelada', 'Finalizada'];

  constructor(
    private reservaService: ReservasService,
    private clienteService: ClienteService,
    private recepService:   RecepcionistaService,
    public  authService:    AuthService,
    private cdr:            ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.esAdmin = user?.role === 'Administrador';

    if (this.esAdmin) {
      this.recepService.getRecepcionistas().subscribe({
        next: (data) => {
          this.recepcionistas = data;
          this.cdr.detectChanges();
        },
        error: () => this.recepcionistas = []
      });
    } else {
      this.reserva.idRecepcionista = user?.cedula ?? '';
    }
  }

  ngOnChanges(): void {
    if (this.editingReserva) {
      this.reserva       = { ...this.editingReserva };
      this.editMode      = true;
      this.cedulaCliente = this.reserva.idCliente;

      if (this.reserva.fechaReserva) {
        this.reserva.fechaReserva = new Date(this.reserva.fechaReserva)
          .toISOString().slice(0, 16);
      }

      this.buscarCliente();
    } else {
      this.resetForm();
    }
    this.cdr.detectChanges();
  }

  buscarCliente(): void {
    if (!this.cedulaCliente || this.cedulaCliente.length < 3) {
      this.clienteEncontrado = null;
      this.clienteError      = '';
      return;
    }

    this.buscandoCliente = true;
    this.clienteError    = '';

    this.clienteService.getClienteByCedula(this.cedulaCliente).subscribe({
      next: (cliente) => {
        this.clienteEncontrado = cliente;
        this.reserva.idCliente = this.cedulaCliente;
        this.buscandoCliente   = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.clienteEncontrado = null;
        this.clienteError      = 'Cliente no encontrado';
        this.reserva.idCliente = '';
        this.buscandoCliente   = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(form: any): void {
    if (form.invalid) return;

    if (!this.clienteEncontrado) {
      Swal.fire({ icon: 'warning', title: 'Cliente requerido', text: 'Debes buscar y seleccionar un cliente válido.' });
      return;
    }

    if (!this.reserva.idRecepcionista) {
      Swal.fire({ icon: 'warning', title: 'Recepcionista requerido', text: 'Debes seleccionar un recepcionista.' });
      return;
    }

    this.loading = true;
    const wasEditing = this.editMode;

    const body = {
      ...this.reserva,
      fechaReserva:  new Date(this.reserva.fechaReserva).toISOString(),
      estadoReserva: wasEditing ? this.reserva.estadoReserva : 'Pendiente'
    };

    const request$ = wasEditing
      ? this.reservaService.updateReserva(this.reserva.idReserva!, body)
      : this.reservaService.createReserva(body);

    request$.subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!wasEditing) {
          this.idReservaCreada = res.id;
          this.reservaGuardada = true;
          Swal.fire({
            icon: 'success',
            title: '¡Reserva creada!',
            text: 'Ahora agrega las habitaciones.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            setTimeout(() => {
              this.mostrarHabitaciones = true;
              this.cdr.detectChanges();
            }, 100);
          });
        } else {
          this.reservaSaved.emit();
          this.resetForm();
          Swal.fire({
            icon: 'success',
            title: '¡Listo!',
            text: 'Reserva actualizada correctamente.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => this.formClosed.emit());
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar la reserva.' });
      }
    });
  }

  finalizar(): void {
    this.reservaSaved.emit();
    this.resetForm();
    this.formClosed.emit();
  }

  resetForm(): void {
    this.reserva           = new Reserva();
    this.editMode          = false;
    this.loading           = false;
    this.reservaGuardada   = false;
    this.idReservaCreada   = null;
    this.cedulaCliente     = '';
    this.clienteEncontrado = null;
    this.clienteError      = '';
    this.mostrarDatosReserva = true;
    this.mostrarHabitaciones = true;

    if (!this.esAdmin) {
      this.reserva.idRecepcionista = this.authService.currentUser()?.cedula ?? '';
    }
  }

  close(): void {
    this.formClosed.emit();
  }

  onTotalesChanged(totales: {iva: number, subTotal: number, total: number}): void {
    this.reserva.iva      = totales.iva;
    this.reserva.subTotal = totales.subTotal;
    this.reserva.total    = totales.total;

    const id = this.reserva.idReserva || this.idReservaCreada;
    if (!id) return;

    const body = {
      ...this.reserva,
      idReserva:    id,
      fechaReserva: new Date(this.reserva.fechaReserva).toISOString(),
      iva:          totales.iva,
      subTotal:     totales.subTotal,
      total:        totales.total
    };

    this.reservaService.updateReserva(id, body).subscribe();
    this.cdr.detectChanges();
  }
}