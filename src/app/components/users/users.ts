import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/users.service';
import { UserFormComponent } from './user-form/user-form';
import { UserTableComponent } from './user-table/user-table';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserFormComponent, UserTableComponent],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class UsersComponent implements OnInit {

  users: User[]         = [];
  filteredUsers: User[] = [];
  searchTerm            = '';
  showForm              = false;
  editingUser: User | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data.map((u: any) => ({
          ...u,
          image: u.image?.String || null,
          role:  u.role?.String  || u.role,
           cedula: u.cedula?.String || u.cedula || ''
        }));
        this.filteredUsers = [...this.users];
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error(err)
    });
  }

  openCreate(): void {
    this.editingUser = null;
    this.showForm    = true;
    this.cdr.detectChanges(); 
  }

  // openEdit(user: User): void {
  //   this.editingUser = { ...user, password: '' };
  //   this.showForm    = true;
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  //   this.cdr.detectChanges(); 
  // }

  openEdit(user: User): void {
  console.log('user completo:', user);
  console.log('estado:', user.estado, typeof user.estado);
  this.editingUser = { ...user, password: '' };
  this.showForm    = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.cdr.detectChanges();
}
  closeForm(): void {
    this.showForm    = false;
    this.editingUser = null;
    this.cdr.detectChanges(); 
  }

  onUserSaved(): void {
    this.loadUsers();
    setTimeout(() => this.closeForm(), 1500);
  }

  onDelete(id: number): void {
  this.userService.deleteUser(id).subscribe({
    next: () => {
      this.loadUsers();
    }
  });
}

  onSearch(term: string): void {
    const t = term.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(t)  ||
      u.email.toLowerCase().includes(t) ||
      u.role.toLowerCase().includes(t)
    );
    this.cdr.detectChanges(); 
  }
}