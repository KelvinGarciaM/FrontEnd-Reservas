import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../enviroments';
import { Tarifa } from '../models/tarifa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TarifaService {
  private readonly url: string;
  private headers: any;
  constructor(private _http: HttpClient) {
    this.url = enviroment.apiUrl;
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
  }

  createTarifa(tarifa: Tarifa): Observable<any> {
    let data = JSON.stringify(tarifa);
    return this._http.post(this.url + 'tarifas', data, this.headers);
  }

  getTarifas(): Observable<any> {
    return this._http.get(this.url + 'tarifas', this.headers);
  }

  updateTarifa(idTarifa: number, tarifa: Tarifa) {
    return this._http.patch(this.url + 'tarifas/' + idTarifa, tarifa, { headers: this.headers });
  }

  activarTarifa(idTarifa: number) {
    return this._http.patch(
      this.url + 'tarifas/' + idTarifa + '/activar',
      {},
      { headers: this.headers },
    );
  }

  desactivarTarifa(idTarifa: number) {
    return this._http.patch(
      this.url + 'tarifas/' + idTarifa + '/desactivar',
      {},
      { headers: this.headers },
    );
  }

  getEstadisticasTarifa(idTarifa:number){
  return this._http.get(
    this.url + 'tarifas/' + idTarifa + '/estadisticas',
    { headers: this.headers }
  );
}
}
