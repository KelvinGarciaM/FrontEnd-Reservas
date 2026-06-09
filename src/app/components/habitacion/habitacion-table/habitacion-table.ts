import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habitacion } from '../../../models/habitacion';

@Component({
  selector: 'app-habitacion-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitacion-table.html',
  styleUrl: './habitacion-table.css'
})
export class HabitacionTableComponent {

  @Input() habitaciones: Habitacion[] = [];

  @Output() editHabitacion = new EventEmitter<Habitacion>();
  @Output() toggleEstado = new EventEmitter<Habitacion>();
  
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm = '';

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm);
  }
}