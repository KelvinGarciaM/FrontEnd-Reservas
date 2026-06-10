import { Injectable } from "@angular/core";
import { enviroment } from "../enviroments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoHabitacion } from "../models/tipo-habitacion";

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {

  private readonly url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'tipo-habitacion';
  }

  getTiposHabitacion(): Observable<any> {
    return this._http.get(this.url);
  }

  getTipoHabitacionById(id: number): Observable<any> {
    return this._http.get(`${this.url}/${id}`);
  }

  register(tipo: TipoHabitacion): Observable<any> {
    const body = {
      nombreTipoHab: tipo.nombreTipoHab,
      descripcion: tipo.descripcion,
      capacidadMax: Number(tipo.capacidadMaxima)
    };

    return this._http.post(this.url, body);
  }

  updateTipoHabitacion(tipo: TipoHabitacion): Observable<any> {
    const body = {
      nombreTipoHab: tipo.nombreTipoHab,
      descripcion: tipo.descripcion,
      capacidadMax: Number(tipo.capacidadMaxima),
      estado: Number(tipo.estado)
    };

    return this._http.put(`${this.url}/${tipo.idTipoHabitacion}`, body);
  }

  deleteTipoHabitacion(id: number): Observable<any> {
    return this._http.delete(`${this.url}/${id}`);
  }
}