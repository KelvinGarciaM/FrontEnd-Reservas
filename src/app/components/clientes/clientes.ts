import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente.service';
import { ClienteFormComponent } from './cliente-form/cliente-form';
import { ClienteTableComponent } from './cliente-table/cliente-table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [ClienteFormComponent, ClienteTableComponent],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  showForm = false;
  editingCliente: Cliente | null = null;

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes obtenidos:', data);
        this.clientes = data;
        this.filteredClientes = [...this.clientes];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openCreate(): void {
    this.editingCliente = null;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  openEdit(cliente: Cliente): void {
    this.editingCliente = { ...cliente };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCliente = null;
    this.cdr.detectChanges();
  }

  onClienteSaved(): void {
    this.loadClientes();
    setTimeout(() => this.closeForm(), 1500);
  }

  async onToggleEstado(cliente: Cliente): Promise<void> {
    const estaActivo = Number(cliente.estado) === 1;

    const result = await Swal.fire({
      icon: estaActivo ? 'warning' : 'question',
      title: estaActivo
        ? '¿Deseas desactivar este cliente?'
        : '¿Deseas activar este cliente?',
      text: estaActivo
        ? 'El cliente quedará inactivo.'
        : 'El cliente volverá a estar activo.',
      showCancelButton: true,
      confirmButtonText: estaActivo ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: estaActivo ? '#dc2626' : '#16a34a',
      cancelButtonColor: '#64748b'
    });

    if (!result.isConfirmed) return;

    this.clienteService.toggleClienteEstado(cliente.cedula).subscribe({
      next: () => {
        this.loadClientes();

        Swal.fire({
          icon: 'success',
          title: estaActivo ? 'Cliente desactivado' : 'Cliente activado',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cambiar el estado del cliente.'
        });
      }
    });
  }

  onSearch(term: string): void {
    const t = term.trim().toLowerCase();

    if (!t) {
      this.filteredClientes = [...this.clientes];
      this.cdr.detectChanges();
      return;
    }

    this.filteredClientes = this.clientes.filter(c => {
      const estadoTexto = Number(c.estado) === 1 ? 'activo' : 'inactivo';

      return (
        String(c.cedula ?? '').toLowerCase().includes(t) ||
        String(c.nombre ?? '').toLowerCase().includes(t) ||
        String(c.apellidos ?? '').toLowerCase().includes(t) ||
        String(c.telefono ?? '').toLowerCase().includes(t) ||
        String(c.direccion ?? '').toLowerCase().includes(t) ||
        String(c.nombreTipoC ?? '').toLowerCase().includes(t) ||
        estadoTexto.includes(t)
      );
    });

    this.cdr.detectChanges();
  }
}