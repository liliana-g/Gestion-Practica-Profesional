import { Routes } from '@angular/router';

import { LoginComponent } from './auth/pages/login/login.component';

import { CrearSolicitudComponent } from './alumno/pages/crear-solicitud/crear-solicitud.component';



import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { SecretariaDashboardComponent } from './secretaria/pages/dashboard/dashboard';
import { DashboardAlumnoComponent } from './alumno/pages/dashboard/dashboard';
import { MisSolicitudesComponent } from './alumno/pages/mis-solicitudes/mis-solicitudes.component';
import { SolicitudesComponent } from './secretaria/pages/solicitudes/solicitudes.component';
import { PracticasComponent } from './secretaria/pages/practicas/practicas.component';
import { RevisarInformesComponent } from './secretaria/pages/revisar-informes/revisar-informes.component';
import { MiPracticaComponent } from './alumno/pages/mi-practica/mi-practica.component';


export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'alumno',
        component: DashboardAlumnoComponent,
        canActivate: [authGuard, roleGuard(['ALUMNO'])],

        children: [

            {
                path: 'crear-solicitud',
                component: CrearSolicitudComponent
            },
            {
                path: 'mis-solicitudes',
                component: MisSolicitudesComponent
            },
            {
                path: 'mi-practica',
                component: MiPracticaComponent
            },

        ]

    },

    {
        path: 'secretaria',
        component: SecretariaDashboardComponent,
        canActivate: [authGuard, roleGuard(['SECRETARIA'])],

        children: [

            {
                path: 'solicitudes',
                component: SolicitudesComponent
            },
            {
                path: 'practicas',
                component: PracticasComponent
            },
            {
                path: 'revisar-informes',
                component: RevisarInformesComponent
            }

        ]
    },

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }

];