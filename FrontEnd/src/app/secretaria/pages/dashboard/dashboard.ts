import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class SecretariaDashboardComponent {
  constructor(private auth: AuthService, private router: Router) { }

  logout() {
    // Aquí podrías llamar a tu authService.logout() si lo tienes
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
