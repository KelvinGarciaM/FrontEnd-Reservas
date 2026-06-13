import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass } from '@angular/common';
import { Reserva } from '../../../models/reserva';

@Component({
  selector: 'app-reserva-table',
  standalone: true,
  imports: [FormsModule, NgClass, DecimalPipe],
  templateUrl: './reservas-table.html',
  styleUrl: './reservas-table.css'
})
export class ReservaTable {

  // ── OUTPUTS: eventos que emite hacia el padre ──
  @Output() editReserva = new EventEmitter<Reserva>();   // al dar click en editar
  @Output() deleteReserva = new EventEmitter<number>();    // al dar click en eliminar
  @Output() searchChanged = new EventEmitter<string>();    // al escribir en el buscador
  @Output() cambiarEstado = new EventEmitter<{ id: number, estado: string }>(); // al cambiar estado de la reserva
  // ── PROPIEDADES ──
  _reservas: Reserva[] = [];   // lista original que llega del padre
  searchTerm = '';             // texto del buscador
  filtroEstado = 'Todos';        // filtro de estado seleccionado
  currentPage = 1;             // página actual
  itemsPerPage = 4;             // reservas por página
  Math = Math;         

  constructor(private cdr: ChangeDetectorRef) { }

  // ── INPUT: recibe la lista del padre ──
  @Input() set reservas(list: Reserva[]) {
    this._reservas = list;
    this.currentPage = 1; // resetea página al recibir nueva lista
    this.cdr.detectChanges();
  }

  // ── FILTRO POR ESTADO ──
  // filtra _reservas según el estado seleccionado
  get reservasFiltradas(): Reserva[] {
    let lista = this._reservas;

    // filtro por estado
    if (this.filtroEstado !== 'Todos') {
      lista = lista.filter(r => r.estadoReserva === this.filtroEstado);
    }

    // filtro por búsqueda
    if (this.searchTerm) {
      const t = this.searchTerm.toLowerCase();
      lista = lista.filter(r =>
        r.idCliente.toLowerCase().includes(t) ||
        r.idRecepcionista.toLowerCase().includes(t) ||
        r.estadoReserva.toLowerCase().includes(t)
      );
    }

    return lista;
  }

  // ── PAGINACIÓN ──
  // total de páginas según reservasFiltradas
  get totalPages(): number {
    return Math.ceil(this.reservasFiltradas.length / this.itemsPerPage);
  }

  // slice de reservasFiltradas para la página actual
  get paginatedReservas(): Reserva[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.reservasFiltradas.slice(start, start + this.itemsPerPage);
  }

  // array de números de página [1, 2, 3...]
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // navegar a una página
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ── BÚSQUEDA ──
  // al escribir en el input resetea la página y emite al padre
  onSearch(): void {
    this.currentPage = 1;
    this.searchChanged.emit(this.searchTerm);
  }


  // ── HELPERS ──
  // devuelve la clase CSS según el estado de la reserva
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Confirmada': return 'app-badge-confirmada';
      case 'Pendiente': return 'app-badge-pendiente';
      case 'Cancelada': return 'app-badge-cancelada';
      case 'Finalizada': return 'app-badge-finalizada';
      default: return '';
    }
  }

  // formatea la fecha a dd/mm/yyyy
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
}