import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Cambiado aquí

@Component({
    selector: 'app-login',
    standalone: true, // Asegúrate de que sea standalone si es un proyecto nuevo
    imports: [CommonModule, FormsModule], // Usamos FormsModule
    templateUrl: './login.component.html'
})
export class LoginComponent {
    username = '';
    password = '';
    error = '';

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    login() {
        this.error = '';
        this.auth.login(this.username, this.password).subscribe({
            next: (res: any) => {
                this.auth.setUser(res.usuario);

                if (res.usuario.rol === "ALUMNO") {
                    this.router.navigate(['/alumno/mis-solicitudes']);
                }

                if (res.usuario.rol === "SECRETARIA") {
                    this.router.navigate(['/secretaria/solicitudes']);
                }
            },
            error: () => {
                this.error = "Usuario o contraseña incorrecta";
            }
        });
    }
}