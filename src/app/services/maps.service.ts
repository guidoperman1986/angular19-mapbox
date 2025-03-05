import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Feature } from '../interfaces/suggestions.interface';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  http = inject(HttpClient);
  mapboxAccessToken = 'pk.eyJ1IjoiZ3VpZG9wZXJtYW4iLCJhIjoiY2s0YW13dHRoMDNycjNlcGFuMmhubGJjNSJ9.Z92hBclh4KkowqgEPBmXZg';  

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
        console.log(response);
        if (response.features && response.features.length > 0) {
          return response.features;
        } else {
          return [];
        }
      })
    );
  }
}
