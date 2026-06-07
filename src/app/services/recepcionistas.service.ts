import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recepcionista } from '../models/recepcionista';
import { enviroment } from '../enviroments';

@Injectable({
  providedIn: 'root'
})
export class RecepcionistasService {

  private url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'recepcionistas';
  }

  getRecepcionistas(): Observable<Recepcionista[]> {
    return this._http.get<Recepcionista[]>(this.url);
  }

  getRecepcionistaByCedula(cedula: string): Observable<Recepcionista> {
    return this._http.get<Recepcionista>(`${this.url}${cedula}`);
  }

  createRecepcionista(r: Recepcionista): Observable<any> {
    return this._http.post(this.url, r);
  }

  updateRecepcionista(r: Recepcionista): Observable<any> {
    return this._http.put(this.url, r);
  }

  deleteRecepcionista(cedula: string): Observable<any> {
    return this._http.delete(`${this.url}${cedula}`);
  }
}