import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-alumno',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink], // Necesario para routerLink y router-outlet
  templateUrl: './dashboard.html'
})
export class DashboardAlumnoComponent {

  constructor(private auth: AuthService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}