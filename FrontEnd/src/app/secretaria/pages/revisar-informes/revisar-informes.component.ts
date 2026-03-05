import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretariaService } from '../../services/secretaria.service';

@Component({
    selector: 'app-revisar-informes',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './revisar-informes.component.html'
})
export class RevisarInformesComponent implements OnInit {

    informes: any[] = [];
    loading = true;

    constructor(private secretariaService: SecretariaService) { }

    ngOnInit() {

        this.secretariaService.getInformes()
            .subscribe((res: any) => {

                console.log("Informes:", res);

                this.informes = res;

                this.loading = false;

            });

    }

    aprobar(informe: any) {

        if (!confirm("¿Aprobar este informe?")) return;

        console.log(informe);

        this.secretariaService.aprobarInforme(informe.id)
            .subscribe(() => {

                alert("Informe aprobado");

                informe.estado = "APROBADO";

            });

    }

    rechazar(informe: any) {

        const comentarios = prompt("Motivo del rechazo");

        if (!comentarios) return;

        this.secretariaService.rechazarInforme(informe.id, comentarios)
            .subscribe(() => {

                alert("Informe rechazado");

                informe.estado = "RECHAZADO";

            });

    }

}