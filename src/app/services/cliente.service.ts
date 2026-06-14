import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente } from '../models/cliente';
import { enviroment } from '../enviroments';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'clientes';
  }

  getClientes(): Observable<Cliente[]> {
    return this._http.get<Cliente[]>(this.url);
  }

  getClienteByCedula(cedula: string): Observable<Cliente> {
    return this._http.get<Cliente>(`${this.url}/${cedula}`).pipe(
      catchError((err) => throwError(() => err)) 
    );
  }

  createCliente(cliente: Cliente): Observable<any> {
    return this._http.post(this.url, cliente);
  }

  updateCliente(cliente: Cliente): Observable<any> {
    return this._http.put(this.url, cliente);
  }

  deleteCliente(cedula: string): Observable<any> {
    return this._http.delete(this.url, { body: { cedula } });
  }

  toggleClienteEstado(cedula: string): Observable<any> {
    return this._http.put(`${this.url}/toggle`, { cedula });
  }
}