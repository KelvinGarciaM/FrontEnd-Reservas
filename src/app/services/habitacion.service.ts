import { Injectable } from "@angular/core";
import { enviroment } from "../enviroments";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Habitacion } from "../models/habitacion";

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {

  private readonly url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'habitacion';
  }

  getHabitaciones(): Observable<any> {
    return this._http.get(this.url);
  }

  getHabitacionById(id: number): Observable<any> {
    return this._http.get(`${this.url}/${id}`);
  }

  getHabitacionesByTipo(idTipoHab: number): Observable<any> {
    return this._http.get(`${this.url}/tipo/${idTipoHab}`);
  }

  register(habitacion: Habitacion): Observable<any> {
    const body = {
      idTipoHab: Number(habitacion.idTipoHab),
      numeroHabitacion: habitacion.numeroHabitacion
    };

    return this._http.post(this.url, body);
  }

  updateHabitacion(habitacion: Habitacion): Observable<any> {
    const body = {
      idTipoHab: Number(habitacion.idTipoHab),
      numeroHabitacion: habitacion.numeroHabitacion,
      estado: Number(habitacion.estado)
    };

    return this._http.put(`${this.url}/${habitacion.idHabitacion}`, body);
  }

  deleteHabitacion(id: number): Observable<any> {
    return this._http.delete(`${this.url}/${id}`);
  }
  
  onToggleEstado(id: number): Observable<any> {
    return this._http.put(`${this.url}/${id}/toggle`, {});
  }
}