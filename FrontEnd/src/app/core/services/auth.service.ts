import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

  usuario: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  login(username: string, password: string): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login/`,
      { username, password },
      { withCredentials: true }
    );

  }


  logout() {

    this.http.post(`${this.apiUrl}/logout/`, {}, { withCredentials: true })
      .subscribe(() => {
        this.usuario = null;
        this.router.navigate(['/login']);
      });

  }


  setUser(user: any) {
    this.usuario = user;
  }


  getUser() {
    return this.usuario;
  }


  getRol() {
    return this.usuario?.rol;
  }

}