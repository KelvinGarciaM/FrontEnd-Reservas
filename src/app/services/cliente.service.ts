import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'clientes';
  }


  getClientes(): Observable<Cliente[]> {
    return this._http.get<Cliente[]>(this.url)
  }

  createCliente(cliente: Cliente): Observable<any>{
    return this._http.post(this.url, cliente)
  }

  updateCliente(cliente: Cliente): Observable<any>{
    return this._http.put(this.url, cliente);
  }

  toggleClienteEstado(cedula: string): Observable<any>{
    return this._http.put(`${this.url}/toggle`,{cedula});
  }

  deleteCliente(cedula: string): Observable<any>{
    return this._http.delete(this.url,{
      body:{cedula}
    });
  }
}
