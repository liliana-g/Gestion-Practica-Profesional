import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importación vital
import { AlumnoService } from '../../services/alumno.service';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true, // Asegúrate de que diga true
  imports: [CommonModule, RouterModule], // Añadido RouterModule
  templateUrl: './mis-solicitudes.component.html'
})
export class MisSolicitudesComponent implements OnInit {

  solicitudes: any[] = [];
  loading = true;

  constructor(private alumnoService: AlumnoService) { }

  ngOnInit() {
    this.alumnoService.getMisSolicitudes()
      .subscribe({
        next: (res: any) => {
          console.log("Datos recibidos:", res);
          this.solicitudes = res || []; // Evita que sea null
          this.loading = false; // Se apaga el cargando
        },
        error: (err) => {
          console.error("Error en la petición:", err);
          this.loading = false; // Se apaga incluso si hay error
        }
      });
  }
}