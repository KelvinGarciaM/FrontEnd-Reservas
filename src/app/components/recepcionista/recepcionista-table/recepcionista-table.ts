import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recepcionista } from '../../../models/recepcionista';

@Component({
  selector: 'app-recepcionista-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recepcionista-table.html',
  styleUrl: './recepcionista-table.css'
})
export class RecepcionistaTableComponent {

  @Input() recepcionistas: Recepcionista[] = [];

  @Output() editRecepcionista = new EventEmitter<Recepcionista>();
  @Output() toggleEstado = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();

  searchTerm = '';

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm);
  }
}