import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroments';

@Injectable({
  providedIn: 'root'
})
export class DetalleReservaService {

  private url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'detalles-reserva';
  }

  getDetallesByReserva(idReserva: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.url}/reserva/${idReserva}`);
  }

  createDetalle(detalle: any): Observable<any> {
    return this._http.post(this.url, detalle);
  }

  deleteDetalle(id: number): Observable<any> {
    return this._http.delete(`${this.url}/${id}`);
  }
  getFechasOcupadas(idHabitacion: number): Observable<any[]> {
  return this._http.get<any[]>(`${this.url}/habitacion/${idHabitacion}/fechas-ocupadas`);
}

getTarifaByHabitacion(idHabitacion: number, fecha: string): Observable<any> {
  return this._http.get<any>(`${this.url}/habitacion/${idHabitacion}/tarifa?fecha=${fecha}`);
}
}