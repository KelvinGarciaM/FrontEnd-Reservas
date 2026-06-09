import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { TipoHabitacion } from '../../models/tipo-habitacion';
import { CommonModule } from '@angular/common';
import { TipoHabitacionFormComponent } from './tipo-habitacion-form/tipo-habitacion-form';
import { TipoHabitacionTableComponent } from './tipo-habitacion-table/tipo-habitacion-table';

@Component({
  selector: 'app-tipo-habitacion',
  standalone: true,
  templateUrl: './tipo-habitacion.html',
  styleUrl: './tipo-habitacion.css',
  imports: [CommonModule, TipoHabitacionFormComponent, TipoHabitacionTableComponent]
})
export class TipoHabitacionComponent implements OnInit {

  tiposHabitacion: TipoHabitacion[] = [];
  filteredTipos: TipoHabitacion[] = [];
  mostrarFormulario = false;
  editingTipo: TipoHabitacion | null = null;

  constructor(
    private tipoHabitacionService: TipoHabitacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  cargarTiposHabitacion(): void {
    this.tipoHabitacionService.getTiposHabitacion().subscribe({
      next: (res) => {
        const datos = res.tipoHabitacion ?? [];

        this.tiposHabitacion = datos.map((t: any) => ({
          idTipoHabitacion: t.idtipohabitacion,
          nombreTipoHab: t.nombretipohab,
          descripcion: t.descripcion,
          capacidadMaxima: t.capacidadmaxima,
          estado: t.estado
        }));

        this.filteredTipos = [...this.tiposHabitacion];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error cargando tipos de habitación', err);
      }
    });
  }

  openCreate(): void {
    this.editingTipo = null;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  openEdit(item: TipoHabitacion): void {
    this.editingTipo = { ...item };
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.mostrarFormulario = false;
    this.editingTipo = null;
    this.cdr.detectChanges();
  }

  onTipoSaved(): void {
    this.cargarTiposHabitacion();
    setTimeout(() => this.closeForm(), 1500);
  }

  onDelete(id: number): void {
    this.tipoHabitacionService.deleteTipoHabitacion(id).subscribe({
      next: () => {
        this.cargarTiposHabitacion();
      },
      error: (err) => {
        console.log('Error eliminando tipo habitación', err);
      }
    });
  }

  contarActivos(): number {
    return this.tiposHabitacion.filter(t => t.estado === 1).length;
  }

  onSearch(term: string): void {
    const texto = term.toLowerCase();
    this.filteredTipos = this.tiposHabitacion.filter(t =>
      t.nombreTipoHab.toLowerCase().includes(texto) ||
      t.descripcion.toLowerCase().includes(texto)
    );
    this.cdr.detectChanges();
  }
  onToggleEstado(item: TipoHabitacion): void {
  const tipoActualizado: TipoHabitacion = {
    ...item,
    estado: item.estado === 1 ? 0 : 1
  };

  this.tipoHabitacionService.updateTipoHabitacion(tipoActualizado).subscribe({
    next: () => {
      this.cargarTiposHabitacion();
    },
    error: (err) => {
      console.error(err);
    }
  });
}
  }