import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AlumnoService {

    api = "http://localhost:8000/api";

    constructor(private http: HttpClient) { }

    crearSolicitud(data: FormData) {
        return this.http.post(
            `${this.api}/solicitudes/`,
            data,
            { withCredentials: true }
        );
    }

    getMisSolicitudes() {
        return this.http.get(
            `${this.api}/solicitudes/mis_solicitudes/`,
            { withCredentials: true }
        );
    }

    getMiPractica() {
        return this.http.get(`${this.api}/practicas/mi_practica/`, {
            withCredentials: true
        });
    }

    subirInforme(formData: FormData) {
        return this.http.post(`${this.api}/informes/`, formData, {
            withCredentials: true
        });
    }

}