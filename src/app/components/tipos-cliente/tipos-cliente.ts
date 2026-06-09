import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TipoCliente } from '../../models/tipo-cliente';
import { TipoClienteService } from '../../services/tipo-cliente.service';
import { TipoClienteFormComponent } from './tipo-cliente-form/tipo-cliente-form';
import { TipoClienteTableComponent } from './tipo-cliente-table/tipo-cliente-table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-cliente',
  standalone: true,
  imports: [TipoClienteFormComponent, TipoClienteTableComponent],
  templateUrl: './tipos-cliente.html',
  styleUrl: './tipos-cliente.css',
})
export class TiposClienteComponent implements OnInit {
  tiposCliente: TipoCliente[] = [];
  filteredTiposCliente: TipoCliente[] = [];
  searchTerm = '';
  showForm = false;
  editingTipoCliente: TipoCliente | null = null;

  constructor(
    private tipoClienteService: TipoClienteService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTiposCliente();
  }

  loadTiposCliente(): void {
    this.tipoClienteService.getTipoClientes().subscribe({
      next: (data) => {
        console.log('Tipos Cliente obtenidos en backend:', data);

        this.tiposCliente = data;
        this.filteredTiposCliente = [...this.tiposCliente];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    })
  }

  openCreate(): void {
    this.editingTipoCliente = null;
    this.showForm = true;
    this.cdr.detectChanges();
  }

  openEdit(tipoCliente: TipoCliente): void {
    this.editingTipoCliente = { ...tipoCliente };
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTipoCliente = null;
    this.cdr.detectChanges();
  }

  nuevoTipoCliente(): TipoCliente {
    return new TipoCliente();
  }

  onTipoClienteSaved(): void {
    this.loadTiposCliente();
    setTimeout(() => this.closeForm(), 1500);
  }

  async onToggleEstado(tipoCliente: TipoCliente): Promise<void> {

    const estaActivo = tipoCliente.estado === 1;

    const result = await Swal.fire({
      icon: estaActivo ? 'warning' : 'question',
      title: estaActivo
        ? '¿Deseas desactivar este tipo de cliente?'
        : '¿Deseas activar este tipo de cliente?',
      text: estaActivo
        ? 'El tipo de cliente quedará inactivo.'
        : 'El tipo de cliente volverá a estar activo.',
      showCancelButton: true,
      confirmButtonText: estaActivo ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: estaActivo ? '#dc2626' : '#16a34a',
      cancelButtonColor: '#64748b'
    });

    if (!result.isConfirmed) return;

    this.tipoClienteService.toggleTipoClienteEstado(tipoCliente.idTipoCliente!).subscribe({
      next: () => {
        this.loadTiposCliente();

        Swal.fire({
          icon: 'success',
          title: estaActivo ? 'Tipo Cliente desactivado' : 'Tipo Cliente activado',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cambiar el estado',
          text: 'No se pudo cambiar el estado del tipo de cliente por que tiene clientes asociados.'
        });
      }
    });
  }

  onSearch(term: string): void {
    const t = term.trim().toLowerCase();

    if (!t) {
      this.filteredTiposCliente = [...this.tiposCliente];
      this.cdr.detectChanges();
      return;
    }

    this.filteredTiposCliente = this.tiposCliente.filter(tc => {
      const id = String(tc.idTipoCliente ?? '');
      const nombre = String(tc.nombreTipoC ?? '').toLowerCase();
      const descripcion = String(tc.descripcion ?? '').toLowerCase();
      const descuento = String(tc.descuentoBase ?? '').toLowerCase();

      const esatdoNumero = Number(tc.estado);
      const estadoTexto = tc.estado === 1 ? 'activo' : 'inactivo';

      return (
        id.includes(t) ||
        nombre.includes(t) ||
        descripcion.includes(t) ||
        descuento.includes(t) ||
        estadoTexto.includes(t)
      );
    });

    this.cdr.detectChanges();
  }

}


