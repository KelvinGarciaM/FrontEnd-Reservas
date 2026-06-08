import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { Recepcionista } from '../../../models/recepcionista';
import { UserService } from '../../../services/users.service';
import { RecepcionistasService } from '../../../services/recepcionistas.service';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent implements OnChanges {

  @Input() editingUser: User | null = null;
  @Output() formClosed = new EventEmitter<void>();
  @Output() userSaved  = new EventEmitter<void>();

  user: User = new User(null, '', '', '', 1, '', '', '');
  editMode     = false;
  loading      = false;
  status       = -1;
  imagePreview: string | null  = null;
  selectedFile: File | null    = null;
  recepcionistas: Recepcionista[] = [];

  constructor(
    private userService:  UserService,
    private recepService: RecepcionistasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.recepService.getRecepcionistas().subscribe({
      next: (data) => {
        this.recepcionistas = data;

        if (this.editingUser) {
          this.user        = { ...this.editingUser };
          this.user.cedula = (this.editingUser.cedula as any)?.String !== undefined
            ? (this.editingUser.cedula as any).String
            : (this.editingUser.cedula ?? '');
          this.editMode    = true;

          if (this.editingUser.image) {
            this.userService.getImageBlob(this.editingUser.image).subscribe({
              next: (base64) => {
                this.imagePreview = base64;
                this.cdr.detectChanges();
              },
              error: () => this.imagePreview = null
            });
          } else {
            this.imagePreview = null;
          }

        } else {
          this.resetForm();
        }

        this.cdr.detectChanges();
      },
      error: () => this.recepcionistas = []
    });
  }

  onRoleChange(): void {
    if (this.user.role !== 'Recepcionista') {
      this.user.cedula = '';
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }
onSubmit(form: any): void {
  if (form.invalid) return;

  if (this.user.role === 'Recepcionista' && !this.user.cedula) {
    Swal.fire({
      icon: 'warning',
      title: 'Recepcionista requerido',
      text: 'Debes seleccionar un recepcionista para este usuario.'
    });
    return;
  }

  this.loading = true;
  this.status  = -1;
  const wasEditing = this.editMode; // ← guarda antes de resetear

  const request$ = this.selectedFile
    ? this.userService.uploadImage(this.selectedFile).pipe(
        switchMap((res: any) => {
          this.user.image = res.filename;
          return wasEditing
            ? this.userService.updateUser(this.user)
            : this.userService.register(this.user);
        })
      )
    : wasEditing
      ? this.userService.updateUser(this.user)
      : this.userService.register(this.user);

  request$.subscribe({
    next: () => {
      this.loading = false;
      this.userSaved.emit();
      this.resetForm();
      Swal.fire({
        icon: 'success',
        title: '¡Listo!',
        text: wasEditing ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => this.formClosed.emit());
    },
    error: (err) => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.status === 400 ? 'El correo ya está registrado.' : 'Error al guardar el usuario.'
      });
      this.cdr.detectChanges();
    }
  });
}

  resetForm(): void {
    this.user         = new User(null, '', '', '', 1, '', '', '');
    this.editMode     = false;
    this.status       = -1;
    this.imagePreview = null;
    this.selectedFile = null;
  }

  close(): void {
    this.formClosed.emit();
  }
}