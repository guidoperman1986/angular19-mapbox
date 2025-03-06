import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap, of } from 'rxjs';
import { MapsService } from '../../services/maps.service';
import { FullscreenControl, LngLat, Map, Marker, NavigationControl } from 'mapbox-gl';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";
import { Feature, SelectedSugestion } from '../../interfaces/suggestions.interface';
import { environment } from '../../../environments/environment';
import mapboxgl from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

mapboxgl.accessToken = environment.mapbox_key;
@Component({
  selector: 'app-full-screen-map',
  imports: [AutocompleteComponent],
  templateUrl: './full-screen-map.component.html',
  styleUrl: './full-screen-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullScreenMapComponent implements OnInit {
  mapsService = inject(MapsService);
  suggestions = signal<Feature[]>([]);
  inputQuery = viewChild.required<ElementRef>('query');
  inputQuerySignal = signal<string>('');

  divmMap = viewChild('map', { read: ElementRef });
  public map?: Map;
  public markers: MarkerAndColor[] = [];
  lat = signal<number>(0);
  lng = signal<number>(0);

  suggestionsData = rxResource({
    request: () => this.inputQuerySignal(),
    loader: ({ request }) =>
      this.mapsService.getSuggestions(request).pipe(
        tap((suggestions) => {
          this.suggestions.set(suggestions);
        })
      )

  })

  onSearchValue(query: string) {
    this.inputQuerySignal.set(query);
  }

  // Initialize the map
  initializeMap(lng: number, lat: number) {
    this.map = new Map({
      container: this.divmMap()?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      zoom: 9, // starting zoom
      center: [lng, lat] // starting position [lng, lat]
    });

    this.map.addControl(new FullscreenControl());
    this.map.addControl(new NavigationControl());

  }

  mapData = rxResource({
    loader: () => {
      return this.mapsService.getIpAddress().pipe(
        filter(() => this.divmMap()?.nativeElement),
        switchMap((ip) => this.mapsService.getIpAddressInfo(ip)),
        switchMap((ipInfo: any) => {
          const loc = ipInfo.loc.split(',');
          const [lat, lng] = loc;

          this.initializeMap(lng, lat);
          this.createMarker();

          return of();
        }));
    }
  })

  onSelectedSuggestion(selectedSuggestion: SelectedSugestion | null) {
    const lat = selectedSuggestion?.center[0]!;
    const lng = selectedSuggestion?.center[1]!;

    if (this.map) {

      this.map.flyTo({
        center: [lat, lng],
        zoom: 14,
      })

      this.createMarker();
    }

  }

  ngOnInit(): void {
  }

  createMarker() {
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map!.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({ color, marker, });
  }
}
