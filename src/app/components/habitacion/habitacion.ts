import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Habitacion } from '../../models/habitacion';
import { HabitacionService } from '../../services/habitacion.service';

import { HabitacionFormComponent } from './habitacion-form/habitacion-form';
import { HabitacionTableComponent } from './habitacion-table/habitacion-table';

@Component({
  selector: 'app-habitacion',
  standalone: true,
  templateUrl: './habitacion.html',
  styleUrl: './habitacion.css',
  imports: [
    CommonModule,
    HabitacionFormComponent,
    HabitacionTableComponent
  ]
})
export class HabitacionComponent implements OnInit {

  habitaciones: Habitacion[] = [];
  filteredHabitaciones: Habitacion[] = [];

  mostrarFormulario = false;
  editingHabitacion: Habitacion | null = null;

  constructor(
    private habitacionService: HabitacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: (res) => {

        const datos = res.habitaciones ?? [];

        this.habitaciones = datos.map((h: any) => ({
          idHabitacion: h.idhabitacion,
          idTipoHab: h.idtipohab,
          numeroHabitacion: h.numerohabitacion,
          estado: h.estado
        }));

        this.filteredHabitaciones = [...this.habitaciones];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error cargando habitaciones', err);
      }
    });
  }

  openCreate(): void {
    this.editingHabitacion = null;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  openEdit(item: Habitacion): void {
    this.editingHabitacion = { ...item };
    this.mostrarFormulario = true;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.mostrarFormulario = false;
    this.editingHabitacion = null;
    this.cdr.detectChanges();
  }

  onHabitacionSaved(): void {
    this.cargarHabitaciones();

    setTimeout(() => {
      this.closeForm();
    }, 1500);
  }



  contarActivas(): number {
    return this.habitaciones.filter(h => h.estado === 1).length;
  }

  onSearch(term: string): void {
    const texto = term.toLowerCase();

    this.filteredHabitaciones = this.habitaciones.filter(h =>
      h.numeroHabitacion.toLowerCase().includes(texto)
    );

    this.cdr.detectChanges();
  }

  onToggleEstado(item: Habitacion): void {
  const habitacionActualizada: Habitacion = {
    ...item,
    estado: item.estado === 1 ? 0 : 1
  };

  this.habitacionService.updateHabitacion(habitacionActualizada).subscribe({
    next: () => {
      this.cargarHabitaciones();
    },
    error: (err) => {
      console.error('Error cambiando estado', err);
    }
  });
}
}