import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretariaService } from '../../services/secretaria.service';

@Component({
    selector: 'app-secretaria-practicas',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './practicas.component.html'
})
export class PracticasComponent implements OnInit {

    practicas: any[] = [];
    loading = true;

    constructor(private secretariaService: SecretariaService) { }

    ngOnInit() {

        this.secretariaService.getPracticas()
            .subscribe({

                next: (res: any) => {

                    console.log("Practicas:", res);

                    this.practicas = res;

                    this.loading = false;

                },

                error: (err) => {

                    console.error(err);

                    this.loading = false;

                }

            });

    }

    finalizar(p: any) {

        if (!confirm("¿Finalizar esta práctica?")) return;

        this.secretariaService.finalizarPractica(p.id)
            .subscribe(() => {

                alert("Práctica finalizada");

                p.estado = "FINALIZADA";

            });

    }

}