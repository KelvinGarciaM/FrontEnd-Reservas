import { Injectable } from "@angular/core";
import { enviroment } from "../enviroments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Recepcionista } from "../models/recepcionista";

@Injectable({
  providedIn: 'root'
})
export class RecepcionistaService {

  private readonly url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'recepcionistas';
  }

  getRecepcionistas(): Observable<any> {
    return this._http.get(this.url);
  }

  getRecepcionistaByCedula(cedula: string): Observable<any> {
    return this._http.get(`${this.url}/${cedula}`);
  }

  searchRecepcionistas(term: string): Observable<any> {
    return this._http.get(`${this.url}/buscar?q=${term}`);
  }

  register(recepcionista: Recepcionista): Observable<any> {
    const body = {
      cedula: Number(recepcionista.cedula),
      nombre: recepcionista.nombre,
      apellidos: recepcionista.apellidos,
      telefono: recepcionista.telefono,
      correo: recepcionista.correo
    };
    console.log('================================');
  console.log('BODY ENVIADO AL BACKEND');
  console.log(body);
  console.log(JSON.stringify(body));
  console.log('================================');

    return this._http.post(this.url, body);
  }

  updateRecepcionista(recepcionista: Recepcionista): Observable<any> {
    const body = {
      cedula: Number(recepcionista.cedula),
      nombre: recepcionista.nombre,
      apellidos: recepcionista.apellidos,
      telefono: recepcionista.telefono,
      correo: recepcionista.correo,
      estado: Number(recepcionista.estado)
    };

    return this._http.put(this.url, body);
  }

  deleteRecepcionista(cedula: string): Observable<any> {
    return this._http.request('delete', this.url, {
      body: { cedula: Number(cedula) }
    });
  }

  toggleEstado(cedula: string) {
  return this._http.put(
    `${this.url}/toggle`,
    { cedula: Number(cedula) }
  );
}
}