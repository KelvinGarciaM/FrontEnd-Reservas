import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoCliente } from '../../../models/tipo-cliente';
import { TipoClienteService } from '../../../services/tipo-cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-cliente-form',
  imports: [FormsModule],
  templateUrl: './tipo-cliente-form.html',
  styleUrl: './tipo-cliente-form.css',
})
export class TipoClienteFormComponent implements OnChanges {
  @Input() editingTipoCliente: TipoCliente | null = null;
  @Output() formClosed = new EventEmitter<void>()
  @Output() tipoClienteSaved = new EventEmitter<void>();

  tipoCliente: TipoCliente = new TipoCliente();

  constructor(private tipoClienteService: TipoClienteService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingTipoCliente']) {
      this.tipoCliente = this.editingTipoCliente
        ? { ...this.editingTipoCliente }
        : new TipoCliente();
    }
  }

  saveTipoCliente(): void {
    if (!this.tipoCliente.nombreTipoC.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar el nombre del tipo de cliente.', 'warning');
      return;
    }

    if (!this.tipoCliente.descripcion.trim()) {
      Swal.fire('Campo requerido', 'Debe ingresar una descripción.', 'warning');
      return;
    }

    if (this.tipoCliente.descuentoBase < 0) {
      Swal.fire('Dato inválido', 'El descuento no puede ser negativo.', 'warning');
      return;
    }

    if (this.tipoCliente.idTipoCliente) {
      this.updateTipoCliente();
    } else {
      this.createTipoCliente();
    }
  }

  createTipoCliente(): void {
    const tipoClienteBody = {
      nombreTipoC: this.tipoCliente.nombreTipoC,
      descripcion: this.tipoCliente.descripcion,
      descuentoBase: this.tipoCliente.descuentoBase.toString()
    };

    this.tipoClienteService.createTipoCliente(tipoClienteBody as any).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Tipo de cliente creado',
          text: 'El tipo de cliente fue registrado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });

        this.tipoClienteSaved.emit();
      },
      error: (err) => {
        console.error('Error creando tipo cliente:', err);
        Swal.fire('Error', 'No se pudo registrar el tipo de cliente.', 'error');
      }
    });
  }

  updateTipoCliente(): void {
    const tipoClienteBody = {
      idTipoCliente: this.tipoCliente.idTipoCliente,
      nombreTipoC: this.tipoCliente.nombreTipoC,
      descripcion: this.tipoCliente.descripcion,
      descuentoBase: this.tipoCliente.descuentoBase.toString(),
      estado: this.tipoCliente.estado
    };
    this.tipoClienteService.updateTipoCliente(tipoClienteBody as any).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Tipo de cliente actualizado',
          text: 'El tipo de cliente fue actualizado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });

        this.tipoClienteSaved.emit();
      },
      error: (err) => {
        console.error('Error actualizando tipo cliente:', err);
        Swal.fire('Error', 'No se pudo actualizar el tipo de cliente.', 'error');
      }
    });
  }

  nuevoTipoCliente(): TipoCliente {
    return new TipoCliente();
  }

  closeForm(): void {
    this.formClosed.emit();
  }

}
