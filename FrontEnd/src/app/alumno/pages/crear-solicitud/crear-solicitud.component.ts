import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoService } from '../../services/alumno.service';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-solicitud.component.html'
})
export class CrearSolicitudComponent {

  empresa = {
    nombre: '',
    rut: '',
    direccion: '',
    telefono: '',
    email: '',
    contacto: ''
  };

  carta: any = null;

  constructor(private alumnoService: AlumnoService) { }

  onFileSelected(event: any) {
    this.carta = event.target.files[0];
  }

  crearSolicitud() {

    if (!this.empresa.nombre || !this.carta) {
      alert("Completa los datos de la empresa y sube la carta");
      return;
    }

    const formData = new FormData();

    formData.append('empresa', JSON.stringify(this.empresa));
    formData.append('carta_presentacion', this.carta);

    console.log(formData.values);

    this.alumnoService.crearSolicitud(formData)
      .subscribe({

        next: () => {

          alert("Solicitud creada");

          this.empresa = {
            nombre: '',
            rut: '',
            direccion: '',
            telefono: '',
            email: '',
            contacto: ''
          };

          this.carta = null;

        },

        error: (err) => {

          console.error(err);

          alert("Error al crear solicitud");

        }

      });

  }

}