import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente';
import { TipoCliente } from '../../../models/tipo-cliente';
import { ClienteService } from '../../../services/cliente.service';
import { TipoClienteService } from '../../../services/tipo-cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteFormComponent implements OnInit, OnChanges {

  @Input() editingCliente: Cliente | null = null;

  @Output() formClosed = new EventEmitter<void>();
  @Output() clienteSaved = new EventEmitter<void>();

  cliente: Cliente = new Cliente();
  tiposCliente: TipoCliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private tipoClienteService: TipoClienteService
  ) { }

  ngOnInit(): void {
    this.loadTiposCliente();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingCliente']) {
      this.cliente = this.editingCliente
        ? { ...this.editingCliente }
        : new Cliente();
    }
  }

  loadTiposCliente(): void {
    this.tipoClienteService.getTipoClientes().subscribe({
      next: (data) => {
        this.tiposCliente = data.filter((tc: TipoCliente) => Number(tc.estado) === 1);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron cargar los tipos de cliente.', 'error');
      }
    });
  }

  saveCliente(): void {
    if (!this.cliente.cedula.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar la cédula.', 'warning');
      return;
    }

    if (!this.cliente.idTipoCliente) {
      Swal.fire('Campo requerido', 'Debe seleccionar un tipo de cliente.', 'warning');
      return;
    }

    if (!this.cliente.nombre.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar el nombre.', 'warning');
      return;
    }

    if (!this.cliente.apellidos.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar los apellidos.', 'warning');
      return;
    }

    if (!this.cliente.telefono.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar el teléfono.', 'warning');
      return;
    }

    if (!this.cliente.direccion.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar la dirección.', 'warning');
      return;
    }

    if (this.editingCliente) {
      this.updateCliente();
    } else {
      this.createCliente();
    }
  }

  createCliente(): void {
    const body = {
      cedula: this.cliente.cedula,
      idTipoCliente: Number(this.cliente.idTipoCliente),
      nombre: this.cliente.nombre,
      apellidos: this.cliente.apellidos,
      telefono: this.cliente.telefono,
      direccion: this.cliente.direccion
    };

    this.clienteService.createCliente(body as Cliente).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cliente creado',
          text: 'El cliente fue registrado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });

        this.clienteSaved.emit();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', err.error?.Error || 'No se pudo registrar el cliente.', 'error');
      }
    });
  }

  updateCliente(): void {
    const body = {
      cedula: this.cliente.cedula,
      idTipoCliente: Number(this.cliente.idTipoCliente),
      nombre: this.cliente.nombre,
      apellidos: this.cliente.apellidos,
      telefono: this.cliente.telefono,
      direccion: this.cliente.direccion,
      estado: Number(this.cliente.estado)
    };

    this.clienteService.updateCliente(body as Cliente).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          text: 'El cliente fue actualizado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });

        this.clienteSaved.emit();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', err.error?.error || 'No se pudo actualizar el cliente.', 'error');
      }
    });
  }

  closeForm(): void {
    this.formClosed.emit();
  }

  nuevoCliente(): Cliente {
    return new Cliente();
  }
}