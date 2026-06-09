import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recepcionista } from '../../models/recepcionista';
import { RecepcionistaService } from '../../services/recepcionistas.service';
import { RecepcionistaFormComponent } from './recepcionista-form/recepcionista-form';
import { RecepcionistaTableComponent } from './recepcionista-table/recepcionista-table';

@Component({
  selector: 'app-recepcionista',
  standalone: true,
  templateUrl: './recepcionista.html',
  styleUrl: './recepcionista.css',
  imports: [CommonModule, RecepcionistaFormComponent, RecepcionistaTableComponent]
})
export class RecepcionistaComponent implements OnInit {

  recepcionistas: Recepcionista[] = [];
  filteredRecepcionistas: Recepcionista[] = [];

  mostrarFormulario = false;
  editingRecepcionista: Recepcionista | null = null;

  constructor(
    private recepcionistaService: RecepcionistaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRecepcionistas();
  }

  cargarRecepcionistas(): void {
    this.recepcionistaService.getRecepcionistas().subscribe({
      next: (res) => {
        const datos = Array.isArray(res) ? res : [];

        this.recepcionistas = datos.map((r: any) => ({
          cedula: r.cedula,
          nombre: r.nombre,
          apellidos: r.apellidos,
          telefono: r.telefono,
          correo: r.correo,
          estado: r.estado
        }));

        this.filteredRecepcionistas = [...this.recepcionistas];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error cargando recepcionistas', err);
      }
    });
  }

  openCreate(): void {
    this.editingRecepcionista = null;
    this.mostrarFormulario = true;
    this.cdr.detectChanges();
  }

  openEdit(item: Recepcionista): void {
    this.editingRecepcionista = { ...item };
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.detectChanges();
  }

  closeForm(): void {
    this.mostrarFormulario = false;
    this.editingRecepcionista = null;
    this.cdr.detectChanges();
  }

  onRecepcionistaSaved(): void {
    this.cargarRecepcionistas();
    setTimeout(() => this.closeForm(), 1500);
  }

  onDelete(cedula: string): void {
    this.recepcionistaService.deleteRecepcionista(cedula).subscribe({
      next: () => this.cargarRecepcionistas(),
      error: (err) => console.log('Error eliminando recepcionista', err)
    });
  }

  contarActivos(): number {
    return this.recepcionistas.filter(r => r.estado === 1).length;
  }

  onSearch(term: string): void {
    const texto = term.toLowerCase();

    this.filteredRecepcionistas = this.recepcionistas.filter(r =>
      r.cedula.toLowerCase().includes(texto) ||
      r.nombre.toLowerCase().includes(texto) ||
      r.apellidos.toLowerCase().includes(texto) ||
      r.correo.toLowerCase().includes(texto)
    );

    this.cdr.detectChanges();
  }
  onToggleEstado(cedula: string): void {
  this.recepcionistaService.toggleEstado(cedula).subscribe({
    next: () => {
      this.cargarRecepcionistas();
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}