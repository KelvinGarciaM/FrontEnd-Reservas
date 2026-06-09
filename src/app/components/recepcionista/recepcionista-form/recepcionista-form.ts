import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recepcionista } from '../../../models/recepcionista';
import { RecepcionistaService } from '../../../services/recepcionistas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recepcionista-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recepcionista-form.html',
  styleUrl: './recepcionista-form.css'
})
export class RecepcionistaFormComponent implements OnChanges {

  @Input() editingRecepcionista: Recepcionista | null = null;

  @Output() formClosed = new EventEmitter<void>();
  @Output() recepcionistaSaved = new EventEmitter<void>();

  recepcionista: Recepcionista = new Recepcionista();

  editMode = false;
  loading = false;

  constructor(
    private recepcionistaService: RecepcionistaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.editingRecepcionista) {
      this.recepcionista = { ...this.editingRecepcionista };
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
      ? this.recepcionistaService.updateRecepcionista(this.recepcionista)
      : this.recepcionistaService.register(this.recepcionista);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.recepcionistaSaved.emit();

        Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: this.editMode ? 'Recepcionista actualizado correctamente.' : 'Recepcionista creado correctamente.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => this.formClosed.emit());
      },
      error: (err) => {
        this.loading = false;

        const message = err.error?.message || err.error?.error || 'No se pudo guardar el recepcionista.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: typeof message === 'string' ? message : 'No se pudo guardar el recepcionista.'
        });

        console.error('Recepcionista save error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.recepcionista = new Recepcionista();
    this.editMode = false;
    this.loading = false;
  }

  cancel(): void {
    this.formClosed.emit();
  }
}