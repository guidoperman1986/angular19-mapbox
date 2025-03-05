import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/full-screen-map/full-screen-map.component').then(c => c.FullScreenMapComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
