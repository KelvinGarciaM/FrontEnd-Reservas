import { Injectable } from "@angular/core";
import { enviroment } from "../enviroments";
import { HttpClient, HttpHandler, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { TipoHabitacion } from "../models/tipo-habitacion";

@Injectable({providedIn:"root"})
export class TipoHabitacionService{
    private readonly url:string
    private headers:any
    constructor(
        private _http:HttpClient
    ){
        this.url=enviroment.apiUrl
        this.headers=new HttpHeaders().set('Content-Type','application/json')
    }
    
    getTiposHabitacion():Observable<any>{
        return this._http.get(this.url+'tipos-habitacion',this.headers)
    }
   
}