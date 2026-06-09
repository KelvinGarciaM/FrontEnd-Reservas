import { Component, Output, Input, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente';

@Component({
  selector: 'app-cliente-table',
  imports: [FormsModule],
  templateUrl: './cliente-table.html',
  styleUrl: './cliente-table.css',
})
export class ClienteTableComponent {
  @Output() editCliente = new EventEmitter<Cliente>();
  @Output() toggleEstado =  new EventEmitter<Cliente>();
  @Output() searchChanged = new EventEmitter<string>();

  _clientes: Cliente[] = [];
  searchTerm = '';

  @Input() set clientes(list: Cliente[]){
    this._clientes = list;
  }

  onSearch(): void{
    this.searchChanged.emit(this.searchTerm);
  }


}
