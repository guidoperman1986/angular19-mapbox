import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapsService } from './services/maps.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-maps-ip-weather';
  mapsService = inject(MapsService);
  
  query: string = '';
  
}
