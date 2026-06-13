import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTableComponent {

  @Output() editUser      = new EventEmitter<User>();
  @Output() deleteUser    = new EventEmitter<number>();
  @Output() searchChanged = new EventEmitter<string>();

  _users: User[] = [];
  imageMap: Record<number, string> = {};
  searchTerm = '';
  currentUser: User | null = null; 

  constructor(private userService: UserService,
    private cdr: ChangeDetectorRef,
     private authService:AuthService
  ) {}

  @Input() set users(list: User[]) {
    this._users = list;
    this.loadImages();
  }
  ngOnInit():void{
    this.currentUser = this.authService.currentUser()
  }

  loadImages(): void {
    this._users.forEach(u => {
      if (u.image && !this.imageMap[u.id!]) {
        this.userService.getImageBlob(u.image).subscribe({
          next: (base64) => {
            this.imageMap[u.id!] = base64, this.cdr.detectChanges();
          },
          error: () => {}
        });
      }
    });
    
  }

  onSearch(): void {
    this.searchChanged.emit(this.searchTerm);
    
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
}