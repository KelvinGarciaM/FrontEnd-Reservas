import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';
import { enviroment } from '../enviroments';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private url: string;

  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl + 'reservas';
  }

  getReservas(): Observable<Reserva[]> {
    return this._http.get<Reserva[]>(this.url);
  }

  getReservaById(id: number): Observable<Reserva> {
    return this._http.get<Reserva>(`${this.url}${id}`);
  }

  getReservasByCliente(idCliente: string): Observable<Reserva[]> {
    return this._http.get<Reserva[]>(`${this.url}cliente/${idCliente}`);
  }

  getReservasByRecepcionista(idRecepcionista: string): Observable<Reserva[]> {
    return this._http.get<Reserva[]>(`${this.url}recepcionista/${idRecepcionista}`);
  }

  createReserva(reserva: Reserva): Observable<any> {
    return this._http.post(this.url, reserva);
  }

  updateReserva(id: number, reserva: Reserva): Observable<any> {
    return this._http.put(`${this.url}/${id}`, reserva);
  }

  deleteReserva(id: number): Observable<any> {
    return this._http.delete(`${this.url}/${id}`);
  }
  updateEstadoReserva(id: number, estadoReserva: string): Observable<any> {
  return this._http.patch(`${this.url}/${id}/estado`, { estadoReserva });
}
}