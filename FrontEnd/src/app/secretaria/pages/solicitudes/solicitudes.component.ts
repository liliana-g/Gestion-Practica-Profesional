import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretariaService } from '../../services/secretaria.service';

@Component({
  selector: 'app-secretaria-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes.component.html'
})
export class SolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  loading = true;

  constructor(private secretariaService: SecretariaService) { }

  ngOnInit() {

    this.secretariaService.getSolicitudes()
      .subscribe({
        next: (res: any) => {

          console.log("Solicitudes:", res);

          this.solicitudes = res;
          this.loading = false;

        },
        error: (err) => {

          console.error(err);
          this.loading = false;

        }
      });

  }

  aprobar(s: any) {

    const fecha_inicio = prompt("Fecha inicio (YYYY-MM-DD)");
    const fecha_fin = prompt("Fecha fin (YYYY-MM-DD)");

    if (!fecha_inicio || !fecha_fin) return;

    this.secretariaService.aprobarSolicitud(s.id, {
      fecha_inicio,
      fecha_fin
    }).subscribe(() => {

      alert("Solicitud aprobada");
      s.estado = "APROBADA";

    });

  }

  rechazar(s: any) {

    const comentario = prompt("Motivo del rechazo");

    if (!comentario) return;

    this.secretariaService.rechazarSolicitud(s.id, comentario)
      .subscribe(() => {

        alert("Solicitud rechazada");
        s.estado = "RECHAZADA";

      });

  }

}