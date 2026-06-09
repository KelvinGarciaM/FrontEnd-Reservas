import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion } from '../../../models/tipo-habitacion';

@Component({
  selector: 'app-tipo-habitacion-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-habitacion-table.html',
  styleUrl: './tipo-habitacion-table.css'
})
export class TipoHabitacionTableComponent {

  @Input() tipos: TipoHabitacion[] = [];
  @Output() editTipo = new EventEmitter<TipoHabitacion>();
  @Output() toggleEstado = new EventEmitter<TipoHabitacion>();
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm = '';

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm);
  }
}

