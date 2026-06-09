import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TipoCliente } from '../../../models/tipo-cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-cliente-table',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tipo-cliente-table.html',
  styleUrl: './tipo-cliente-table.css'
})
export class TipoClienteTableComponent {

  @Output() editTipoCliente = new EventEmitter<TipoCliente>();
  @Output() toggleEstado = new EventEmitter<TipoCliente>();
  @Output() searchChanged = new EventEmitter<string>();

  _tiposCliente: TipoCliente[] = [];
  searchTerm = '';

  @Input() set tiposCliente(list: TipoCliente[]) {
    this._tiposCliente = list;
  }

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm);
  }

  onEdit(tipoCliente: TipoCliente): void {

    if (tipoCliente.estado === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Tipo Cliente inactivo',
        text: 'Primero debes activarlo para poder editarlo.'
      });
      return;
    }

    this.editTipoCliente.emit(tipoCliente);
  } 
}