import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TipoCliente } from '../models/tipo-cliente';

@Injectable({
  providedIn: 'root',
})
export class TipoClienteService {

  private readonly url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'tipos-cliente';
  }


  getTipoClientes(): Observable<TipoCliente[]> {
    return this._http.get<TipoCliente[]>(this.url);
  }

  createTipoCliente(tipoCliente: any): Observable<any> {
    return this._http.post(this.url, tipoCliente);
  }

  updateTipoCliente(tipoCliente: TipoCliente): Observable<any> {
    return this._http.put(this.url, tipoCliente);
  }

  deleteTipoCliente(idTipoCliente: number): Observable<any> {
    return this._http.delete(this.url, {
      body: { idTipoCliente}
    })
  }

  toggleTipoClienteEstado(idTipoCliente: number): Observable<any>{
    return this._http.put(`${this.url}/toggle`,{idTipoCliente});
  }

}
