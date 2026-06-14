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
  @Output() formClosed = new EventEmitter<void>();
  @Output() reservaSaved = new EventEmitter<void>();

  minDate: string = '';

  reserva: Reserva = new Reserva();
  originalReserva: Reserva | null = null;
  editMode = false;
  loading = false;
  reservaGuardada = false;
  idReservaCreada: number | null = null;

  mostrarDatosReserva = true;
  mostrarHabitaciones = true;

  cedulaCliente = '';
  clienteEncontrado: Cliente | null = null;
  buscandoCliente = false;
  clienteError = '';

  esAdmin = false;
  recepcionistas: Recepcionista[] = [];

  estadosReserva = ['Pendiente', 'Confirmada', 'Cancelada', 'Finalizada'];

  constructor(
    private reservaService: ReservasService,
    private clienteService: ClienteService,
    private recepService: RecepcionistaService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  private getFechaLocalISO(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  }

  get hasChanges(): boolean {
    if (!this.editMode || !this.originalReserva) return true;
    return JSON.stringify(this.reserva) !== JSON.stringify(this.originalReserva);
  }

  get recepcionistaValido(): boolean {
    if (!this.esAdmin) return true;
    return this.reserva.idRecepcionista !== '0' && !!this.reserva.idRecepcionista;
  }

  ngOnInit(): void {
    const localISO = this.getFechaLocalISO();
    this.minDate = localISO;
    // Solo setear la fecha si NO estamos en edición (ngOnChanges ya la habrá seteado)
    if (!this.editMode) {
      this.reserva.fechaReserva = localISO;
    }

    const user = this.authService.currentUser();
    this.esAdmin = user?.role === 'Administrador';

    if (this.esAdmin) {
      this.recepService.getRecepcionistas().subscribe({
        next: (data) => {
          this.recepcionistas = data;

          if (this.editMode && this.reserva.idRecepcionista && this.reserva.idRecepcionista !== '0') {
            // EDICIÓN: el idRecepcionista ya viene casteado a string desde ngOnChanges,
            // solo sincronizar originalReserva por si acaso
            const idStr = String(this.reserva.idRecepcionista);
            this.reserva.idRecepcionista = idStr;
            if (this.originalReserva) {
              this.originalReserva = { ...this.originalReserva, idRecepcionista: idStr };
            }
          } else if (!this.editMode) {
            // NUEVA RESERVA: mostrar "Seleccionar recepcionista"
            this.reserva.idRecepcionista = '0';
          }

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
      this.reserva = { ...this.editingReserva };
      this.editMode = true;
      this.cedulaCliente = this.reserva.idCliente;

      // Castear idRecepcionista a string antes de guardar el original
      // para que ambos tengan el mismo tipo y hasChanges funcione bien
      if (this.reserva.idRecepcionista) {
        this.reserva.idRecepcionista = String(this.reserva.idRecepcionista);
      }

      if (this.reserva.fechaReserva) {
        const fecha = new Date(this.reserva.fechaReserva);
        const offset = fecha.getTimezoneOffset() * 60000;
        this.reserva.fechaReserva = new Date(fecha.getTime() - offset)
          .toISOString().slice(0, 16);
      }

      // Guardar snapshot DESPUÉS de todos los casteos/normalizaciones
      this.originalReserva = { ...this.reserva };
      this.buscarCliente();
    } else {
      this.resetForm();
    }
    this.cdr.detectChanges();
  }

  buscarCliente(): void {
    if (!this.cedulaCliente || this.cedulaCliente.length < 3) {
      this.clienteEncontrado = null;
      this.clienteError = '';
      return;
    }

    this.buscandoCliente = true;
    this.clienteError = '';

    this.clienteService.getClienteByCedula(this.cedulaCliente).subscribe({
      next: (cliente) => {
        this.clienteEncontrado = cliente;
        this.reserva.idCliente = this.cedulaCliente;
        this.buscandoCliente = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.clienteEncontrado = null;
        this.clienteError = err.status === 404
          ? 'Cliente no encontrado'
          : 'Error al buscar cliente. Intenta de nuevo.';
        this.reserva.idCliente = '';
        this.buscandoCliente = false;
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

    if (!this.recepcionistaValido) {
      Swal.fire({ icon: 'warning', title: 'Recepcionista requerido', text: 'Debes seleccionar un recepcionista.' });
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    const wasEditing = this.editMode;

    const body = {
      ...this.reserva,
      fechaReserva: new Date(this.reserva.fechaReserva).toISOString(),
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
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Cambios guardados correctamente'
    });

    this.reservaSaved.emit();
    this.resetForm();
    this.formClosed.emit();
  }

  resetForm(): void {
    this.reserva = new Reserva();
    this.originalReserva = null;
    this.editMode = false;
    this.loading = false;
    this.reservaGuardada = false;
    this.idReservaCreada = null;
    this.cedulaCliente = '';
    this.clienteEncontrado = null;
    this.clienteError = '';
    this.mostrarDatosReserva = true;
    this.mostrarHabitaciones = true;

    const localISO = this.getFechaLocalISO();
    this.minDate = localISO;
    this.reserva.fechaReserva = localISO;

    if (this.esAdmin) {
      this.reserva.idRecepcionista = '0';
    } else {
      this.reserva.idRecepcionista = this.authService.currentUser()?.cedula ?? '';
    }
  }

  close(): void {
    this.formClosed.emit();
  }

  onTotalesChanged(totales: { iva: number, subTotal: number, total: number }): void {
    const id = this.reserva.idReserva || this.idReservaCreada;
    if (!id) return;

    // Si los totales no cambiaron, no hacer la llamada al backend
    // (evita el request innecesario al cargar el formulario de edición)
    if (
      this.reserva.iva === totales.iva &&
      this.reserva.subTotal === totales.subTotal &&
      this.reserva.total === totales.total
    ) return;

    this.reserva.iva = totales.iva;
    this.reserva.subTotal = totales.subTotal;
    this.reserva.total = totales.total;

    const body = {
      ...this.reserva,
      idReserva: id,
      fechaReserva: new Date(this.reserva.fechaReserva).toISOString(),
      iva: totales.iva,
      subTotal: totales.subTotal,
      total: totales.total
    };

    this.reservaService.updateReserva(id, body).subscribe({
      next: () => this.cdr.detectChanges(),
      error: () => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron actualizar los totales.' });
      }
    });
  }
}