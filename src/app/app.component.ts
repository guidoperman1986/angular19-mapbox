import { JsonPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Map } from 'mapbox-gl';
import { delay, filter, fromEvent, map, of, switchMap, tap } from 'rxjs';
import { MapsService } from './services/maps.service';
import { AutocompleteComponent } from "./components/autocomplete/autocomplete.component";
import { Feature, SelectedSugestion } from './interfaces/suggestions.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AutocompleteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-maps-ip-weather';
  mapsService = inject(MapsService);
  
  query: string = '';
  
}
