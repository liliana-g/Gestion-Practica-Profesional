import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlumnoService } from '../../services/alumno.service';

@Component({
    selector: 'app-mi-practica',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mi-practica.component.html'
})
export class MiPracticaComponent implements OnInit {

    practica: any = null;
    archivo: any = null;
    loading = true;
    showfrom = false;

    constructor(private alumnoService: AlumnoService) { }

    ngOnInit() {
        this.cargarPractica();
    }

    cargarPractica() {
        this.loading = true;
        this.alumnoService.getMiPractica()
            .subscribe((res: any) => {
                this.practica = res[0] || null;
                console.log('Datos de la práctica:', this.practica);
                this.loading = false;
            });
    
    }
    debeMostrarFormulario(): boolean {
    if (!this.practica) return false;

    // 1. Si no hay informes, es la primera vez: Mostrar
    if (!this.practica.informes || this.practica.informes.length === 0) return true;

    // 2. Si ya hay uno APROBADO, nunca más se muestra el formulario
    const tieneAprobado = this.practica.informes.some((i: any) => i.estado === 'APROBADO');
    if (tieneAprobado) return false;

    // 3. Si hay uno PENDIENTE, esperamos la revisión (bloqueado)
    const tienePendiente = this.practica.informes.some((i: any) => i.estado === 'PENDIENTE' || i.estado === 'INFORME_SUBIDO');
    if (tienePendiente) return false;

    // 4. Si llegamos aquí, es porque no hay aprobados ni pendientes.
    // Verificamos si todos los informes existentes están RECHAZADOS.
    const todosRechazados = this.practica.informes.every((i: any) => i.estado === 'RECHAZADO');
    
    return todosRechazados;
}
    onFileSelected(event: any) {
        this.archivo = event.target.files[0];
    }

    subirInforme() {
        if (!this.archivo) {
            alert("Selecciona un archivo antes de subir");
            return;
        }

        const formData = new FormData();
        formData.append("archivo", this.archivo);
        formData.append("practica", this.practica.id);

        this.alumnoService.subirInforme(formData)
            .subscribe({
                next: () => {
                    alert("Informe enviado correctamente a revisión");
                    this.archivo = null;
                    this.cargarPractica(); 
                },
                error: (err) => {
                    console.error(err);
                    alert("Error al subir informe");
                }
            });
    }

    
}