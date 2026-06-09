import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habitacion } from '../../../models/habitacion';
import { HabitacionService } from '../../../services/habitacion.service';
import { TipoHabitacion } from '../../../models/tipo-habitacion';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitacion-form.html',
  styleUrl: './habitacion-form.css'
})
export class HabitacionFormComponent implements OnChanges {

  @Input() editingHabitacion: Habitacion | null = null;

  @Output() formClosed = new EventEmitter<void>();
  @Output() habitacionSaved = new EventEmitter<void>();

  habitacion: Habitacion = new Habitacion();
  tiposHabitacion: TipoHabitacion[] = [];

  editMode = false;
  loading = false;

  constructor(
    private habitacionService: HabitacionService,
    private tipoHabitacionService: TipoHabitacionService,
    private cdr: ChangeDetectorRef
  ) {
    this.cargarTiposHabitacion();
  }

  ngOnChanges(): void {
    if (this.editingHabitacion) {
      this.habitacion = { ...this.editingHabitacion };
      this.editMode = true;
    } else {
      this.resetForm();
    }

    this.cdr.detectChanges();
  }

  cargarTiposHabitacion(): void {
  this.tipoHabitacionService.getTiposHabitacion().subscribe({
    next: (res) => {
      const datos = res.tipoHabitacion ?? [];

      this.tiposHabitacion = datos
        .map((t: any) => ({
          idTipoHabitacion: t.idtipohabitacion,
          nombreTipoHab: t.nombretipohab,
          descripcion: t.descripcion,
          capacidadMaxima: t.capacidadmaxima,
          estado: t.estado
        }))
        .filter((t: TipoHabitacion) => t.estado === 1);

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.log('Error cargando tipos habitación', err);
    }
  });
}

  onSubmit(form: any): void {
    if (form.invalid) return;

    this.loading = true;

    const request$ = this.editMode
      ? this.habitacionService.updateHabitacion(this.habitacion)
      : this.habitacionService.register(this.habitacion);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.habitacionSaved.emit();

        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: this.editMode ? 'Habitación actualizada correctamente.' : 'Habitación creada correctamente.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.formClosed.emit());
      },
      error: (err) => {
        this.loading = false;

        const message = err.error?.message || err.error?.error || 'No se pudo guardar la habitación.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: typeof message === 'string' ? message : 'No se pudo guardar la habitación.'
        });

        console.error('Habitacion save error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.habitacion = new Habitacion();
    this.editMode = false;
    this.loading = false;
  }

  cancel(): void {
    this.formClosed.emit();
  }
}