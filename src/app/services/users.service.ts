import { Injectable } from "@angular/core";
import { enviroment } from "../enviroments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { User } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'users';
  }


  private getAuthHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getUsers(): Observable<any> {
    return this._http.get(this.url, this.getAuthHeaders());
  }

  register(user: User): Observable<any> {
    return this._http.post(this.url, user, this.getAuthHeaders());
  }

  updateUser(user: User): Observable<any> {
    return this._http.put(this.url, user, this.getAuthHeaders());
  }

  deleteUser(id: number): Observable<any> {
  return this._http.delete(`${this.url}/${id}`, this.getAuthHeaders());
}

  uploadImage(file: File): Observable<any> {

    const formData = new FormData();
    formData.append('file0', file);

    const token = localStorage.getItem('token');

    return this._http.post(
      this.url + '/upload',
      formData,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }
    );
  }
  getImageUrl(img: string | null | undefined): string {
    if (!img) return '';
    return `${enviroment.apiUrl}users/download/${img}`; 
  }
  getImageBlob(filename: string): Observable<string> {
    return this._http.get(
      `${enviroment.apiUrl}users/download/${filename}`,
      { responseType: 'blob' }
      // el interceptor agrega el token automáticamente 
    ).pipe(
      switchMap(blob => new Observable<string>(observer => {
        const reader = new FileReader();
        reader.onload = () => {
          observer.next(reader.result as string);
          observer.complete();
        };
        reader.readAsDataURL(blob);
      }))
    );
  }
}