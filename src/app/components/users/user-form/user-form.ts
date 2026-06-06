import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users.service';
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
  @Output() userSaved = new EventEmitter<void>();

  user: User = new User(null, '', '', '', 1, '', '');
  editMode = false;
  loading = false;
  status = -1;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(): void {
    if (this.editingUser) {
      this.user = { ...this.editingUser };
      this.editMode = true;


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
    this.loading = true;
    this.status = -1;

    const request$ = this.selectedFile
      ? this.userService.uploadImage(this.selectedFile).pipe(
        switchMap((res: any) => {
          this.user.image = res.filename;
          return this.editMode
            ? this.userService.updateUser(this.user)
            : this.userService.register(this.user);
        })
      )
      : this.editMode
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
          text: this.editMode ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.',
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
    this.user = new User(null, '', '', '', 1, '', '');
    this.editMode = false;
    this.status = -1;
    this.imagePreview = null;
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  close(): void {
    this.formClosed.emit();
  }
}