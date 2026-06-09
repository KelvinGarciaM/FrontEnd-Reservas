import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacion } from '../../../models/tipo-habitacion';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-habitacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-habitacion-form.html',
  styleUrl: './tipo-habitacion-form.css'
})
export class TipoHabitacionFormComponent implements OnChanges {

  @Input() editingTipo: TipoHabitacion | null = null;
  @Output() formClosed = new EventEmitter<void>();
  @Output() tipoSaved = new EventEmitter<void>();

  tipoHabitacion: TipoHabitacion = new TipoHabitacion();
  editMode = false;
  loading = false;

  constructor(
    private tipoHabitacionService: TipoHabitacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.editingTipo) {
      this.tipoHabitacion = { ...this.editingTipo };
      this.editMode = true;
    } else {
      this.resetForm();
    }
    this.cdr.detectChanges();
  }

  onSubmit(form: any): void {
    if (form.invalid) return;

    this.loading = true;
    const request$ = this.editMode
      ? this.tipoHabitacionService.updateTipoHabitacion(this.tipoHabitacion)
      : this.tipoHabitacionService.register(this.tipoHabitacion);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.tipoSaved.emit();
        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: this.editMode ? 'Tipo de habitación actualizado correctamente.' : 'Tipo de habitación creado correctamente.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.formClosed.emit());
      },
      error: (err) => {
        this.loading = false;
        const message = err.error?.message || err.error || 'No se pudo guardar el tipo de habitación.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: typeof message === 'string' ? message : 'No se pudo guardar el tipo de habitación.'
        });
        console.error('TipoHabitacion save error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.tipoHabitacion = new TipoHabitacion();
    this.editMode = false;
    this.loading = false;
  }

  cancel(): void {
    this.formClosed.emit();
  }
}

