import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Feature } from '../interfaces/suggestions.interface';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  http = inject(HttpClient);
  mapboxAccessToken = environment.mapbox_key;  

  getIpAddress() {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json').pipe(map(({ ip }) => ip));
  }

  getIpAddressInfo(ip: string) {
    return this.http.get(`https://ipinfo.io/${ip}?token=39a99bf369e420`);
  }

  getSuggestions(query: string): Observable<Feature[]> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${this.mapboxAccessToken}&autocomplete=true`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.features && response.features.length > 0) {
          return response.features;
        } else {
          return [];
        }
      })
    );
  }
}
