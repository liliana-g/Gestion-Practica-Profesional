import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SecretariaService {

    private api = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

    getSolicitudes() {
        return this.http.get(`${this.api}/solicitudes/`, { withCredentials: true });
    }

    aprobarSolicitud(id: number, data: any) {
        return this.http.post(`${this.api}/solicitudes/${id}/aprobar/`, data, { withCredentials: true });
    }

    rechazarSolicitud(id: number, comentario: string) {
        return this.http.post(`${this.api}/solicitudes/${id}/rechazar/`, { comentario }, { withCredentials: true });
    }

    getPracticas() {
        return this.http.get(`${this.api}/practicas/`, { withCredentials: true });
    }

    finalizarPractica(id: number) {
        return this.http.post(`${this.api}/practicas/${id}/finalizar/`, {}, { withCredentials: true });
    }

    getInformes() {
        return this.http.get(`${this.api}/informes/`, { withCredentials: true });
    }

    aprobarInforme(id: number) {
        return this.http.post(`${this.api}/informes/${id}/aprobar/`, {}, { withCredentials: true });
    }

    rechazarInforme(id: number, comentarios: string) {
        return this.http.post(`${this.api}/informes/${id}/rechazar/`,
            { comentarios },
            { withCredentials: true });
    }
}