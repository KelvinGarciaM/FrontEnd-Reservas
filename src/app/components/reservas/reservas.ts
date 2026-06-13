import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Reserva } from '../../models/reserva';
import { ReservasService } from '../../services/reservas.service';
import { ReservaForm } from './reservas-form/reservas-form';
import { ReservaTable } from './reservas-table/reservas-table';
import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [ReservaForm, ReservaTable, DecimalPipe],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class Reservas implements OnInit {

  reservas: Reserva[] = [];
  filteredReservas: Reserva[] = [];
  searchTerm = '';
  showForm = false;
  editingReserva: Reserva | null = null;

  constructor(
    private reservaService: ReservasService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: (data: any[]) => {
        this.reservas = data.map((r: any) => ({
          idReserva: r.idreserva,
          idRecepcionista: r.idrecepcionista,
          idCliente: r.idcliente,
          nombreCliente: r.nombrecliente || r.idcliente,
          nombreRecepcionista: r.nombrerecepcionista || r.idrecepcionista,
          fechaReserva: r.fechareserva,
          estadoReserva: r.estadoreserva,
          estado: r.estado,
          iva: parseFloat(r.iva) || 0,
          subTotal: parseFloat(r.subtotal) || 0,
          total: parseFloat(r.total) || 0
        }));
        this.filteredReservas = [...this.reservas];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
  openCreate(): void {
    this.editingReserva = null;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  openEdit(reserva: Reserva): void {
    this.editingReserva = { ...reserva };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingReserva = null;
    this.cdr.detectChanges();
  }

  onReservaSaved(): void {
    this.loadReservas();
    // setTimeout(() => this.closeForm(), 1500);
  }

  async onDelete(id: number): Promise<void> {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b'
    });

    if (!result.isConfirmed) return;

    this.reservaService.deleteReserva(id).subscribe({
      next: () => {
        this.loadReservas();
        Swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'Reserva eliminada correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la reserva.'
        });
      }
    });
  }

  onSearch(term: string): void {
    const t = term.toLowerCase();
    this.filteredReservas = this.reservas.filter(r =>
      r.idCliente.toLowerCase().includes(t) ||
      r.idRecepcionista.toLowerCase().includes(t) ||
      r.estadoReserva.toLowerCase().includes(t)
    );
    this.cdr.detectChanges();
  }

  onCambiarEstado(event: { id: number, estado: string }): void {
    this.reservaService.updateEstadoReserva(event.id, event.estado).subscribe({
      next: () => {
        this.loadReservas();
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: `Reserva ${event.estado.toLowerCase()} correctamente.`,
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cambiar el estado.'
        });
      }
    });
  }
  //Esto para las card con los contadores 
  get totalReservas(): number {
    return this.reservas.length;
  }

  get pendientes(): number {
    return this.reservas.filter(r => r.estadoReserva === 'Pendiente').length;
  }

  get confirmadas(): number {
    return this.reservas.filter(r => r.estadoReserva === 'Confirmada').length;
  }

  get canceladas(): number {
    return this.reservas.filter(r => r.estadoReserva === 'Cancelada').length;
  }

  get ingresosMes(): number {
    const mes = new Date().getMonth();
    const anio = new Date().getFullYear();
    return this.reservas
      .filter(r => {
        const f = new Date(r.fechaReserva);
        return f.getMonth() === mes && f.getFullYear() === anio && r.estadoReserva === 'Confirmada';
      })
      .reduce((acc, r) => acc + r.total, 0);
  }
}