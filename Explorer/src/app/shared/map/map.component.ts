import { Component, Input, Output, EventEmitter, AfterViewInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @Input() keyPoints: any[] = [];
  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Input() markers: any[] = [];
  @Input() onlyOneMarker = false;
  @Input() tourView = false;
  @Output() keyPointSelected = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() locationSelected = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() markerAdded = new EventEmitter<{ latitude: number, longitude: number }>();

  customIcon = new L.Icon({
    iconUrl: 'assets/current-location.png', // URL do prilagođene slike
    iconSize: [52, 52], // Širina i visina ikone
    iconAnchor: [16, 32], // Tačka gde je ikona vezana za koordinate
    popupAnchor: [0, -32] // Pozicija popup-a u odnosu na ikonu
  });


  private map: any;
  message: string = "";
  option: 'walking' | 'driving' | 'cycling' = 'driving';
  searchQuery: string = '';
  address: string = '';
  routeControl: any = null;

  get Option(): 'walking' | 'driving' | 'cycling' {
    return this.option;
  }

  set Option(value: 'walking' | 'driving' | 'cycling') {
    this.option = value;
    this.setRouteFromKeyPoints()
  }

  constructor(private service: MapService) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCenter,
      zoom: this.initialZoom,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    if (this.markers.length > 0) {
      this.markers.forEach(marker => {
        L.marker([marker.latitude, marker.longitude]).addTo(this.map);
      });
    }
    this.registerOnClick();
    if (this.tourView) {
      this.setRouteFromKeyPoints();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Provera da li se promenio keyPoints
    if (changes['keyPoints'] && !changes['keyPoints'].firstChange) {
      console.log('keyPoints changed:', this.keyPoints);
      // Ovde možeš da pozoveš funkciju ili uradiš nešto drugo
      this.handleKeyPointsChange();
    }

    if (changes['initialCenter']) {
      if (this.initialCenter[0] != 0 && this.initialCenter[1] != 0) {
        this.map.setView(this.initialCenter);
        if (this.onlyOneMarker) {
          this.clearMarkers();
        }
        const mp = new L.Marker([this.initialCenter[0], this.initialCenter[1]], { icon: this.customIcon }).addTo(this.map).bindPopup(`<b>You are here</b><br>`)
          .openPopup();
        this.markers.push(mp);
        this.service.reverseSearch(this.initialCenter[0], this.initialCenter[1]).subscribe((response) => {
          this.address = response.display_name; // Dobijena adresa
          console.log('Dobijena adresa:', this.address);
        });
        this.markerAdded.emit({ latitude: this.initialCenter[0], longitude: this.initialCenter[1] }); // Emit the added marker
      }
    }
  }

  handleKeyPointsChange(): void {
    // Funkcija koja se poziva kada se promeni keyPoints
    console.log('KeyPoints updated:', this.keyPoints);
    // Npr. osveži rutu na mapi ili bilo šta drugo
    this.setRouteFromKeyPoints();
  }

  setRouteFromKeyPoints(): void {
    const waypoints = this.keyPoints.map(point => ({
      lat: point.latitude,
      lng: point.longitude
    }));

    // Pozovi setRoute sa prikupljenim waypoints i izabranim profilom (npr. 'walking')
    this.setRoute(waypoints, this.option); // ili 'driving', 'cycling'
  }


  setRoute(waypoints: Array<{ lat: number, lng: number }>, profile: 'walking' | 'driving' | 'cycling'): void {
    // Uklanjanje prethodne rute ako postoji
    if (this.routeControl) {
      this.map.removeControl(this.routeControl);
    }
    const lineStyle = profile === 'walking'
      ? [{ color: 'blue', weight: 4, dashArray: '10, 10' }] // Isprekidana linija za walking
      : [{ color: 'blue', weight: 4 }]; // Puna linija za ostale profile

    this.routeControl = L.Routing.control({
      waypoints: waypoints.map(point => L.latLng(point.lat, point.lng)),
      router: L.routing.mapbox('pk.eyJ1IjoiZGp1cmRqZXZpY20iLCJhIjoiY20yaHVzOTgyMGJwbzJqczNteW1xMm0yayJ9.woKtBh92sOV__L25KcUu_Q', {
        profile: `mapbox/${profile}`
      }),
      lineOptions: {
        styles: lineStyle, // Plava linija
        extendToWaypoints: true, // Proširi liniju do tačaka
        missingRouteTolerance: 1 // Tolerancija za nedostatak rute
      },
      waypointMode: 'snap', // Markeri će se "zalepiti" za put
      addWaypoints: false, // Zabranjeno dodavanje novih tačaka od strane korisnika
    }).addTo(this.map);

    this.routeControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      this.message = 'Total distance is ' + (summary.totalDistance / 1000).toFixed(2) + ' km and total time is ' + Math.floor(summary.totalTime / 3600) + ' hours ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes';

      const bounds = L.latLngBounds([]);
      routes[0].coordinates.forEach((coord: { lat: number, lng: number }) => {
        bounds.extend(L.latLng(coord.lat, coord.lng));
      });

      this.map.fitBounds(bounds);
    });

    this.routeControl.on('routingerror', (error: any) => {
      console.error('Routing error:', error);
      alert('There was a routing error. Please try again.');
    });
  }




  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'assets/pin.png',
      iconSize: [42, 42], // Širina i visina ikone
      iconAnchor: [16, 32], // Tačka gde je ikona vezana za koordinate
      popupAnchor: [0, -32] // Pozicija popup-a u odnosu na ikonu
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
    if (this.onlyOneMarker) {
      this.setCurrentLocation();
    }
  }

  private setCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Postavljanje trenutne lokacije kao centar mape
        this.map.setView([latitude, longitude], this.initialZoom);

        // Dodavanje markera na trenutnu lokaciju
        const mp = new L.Marker([latitude, longitude]).addTo(this.map)
          .bindPopup('You are here!')
          .openPopup();
        this.markers.push(mp)
        this.keyPointSelected.emit({ latitude: latitude, longitude: longitude });
        this.service.reverseSearch(latitude, longitude).subscribe((response) => {
          this.address = response.display_name; // Dobijena adresa
          console.log('Dobijena adresa:', this.address);
        });
        // Emitovanje trenutnih koordinata
        this.markerAdded.emit({ latitude, longitude });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  search(): void {
    this.service.search(this.searchQuery).subscribe({
      next: (result) => {
        if (result.length > 0) {
          const lat = result[0].lat;
          const lon = result[0].lon;

          if (this.onlyOneMarker) {
            this.clearMarkers();
          }
          this.keyPointSelected.emit({ latitude: lat, longitude: lon });
          this.locationSelected.emit({ latitude: lat, longitude: lon });
          this.map.setView([lat, lon], 15);
          const mp = new L.Marker([lat, lon])
            .addTo(this.map)
            .bindPopup(`<b>${this.searchQuery}</b><br>Pretrazena lokacija`)
            .openPopup();
          this.markers.push(mp)
          this.service.reverseSearch(lat, lon).subscribe((response) => {
            this.address = response.display_name; // Dobijena adresa
            console.log('Dobijena adresa:', this.address);
          });
        } else {
          alert('Location not found.');
        }
      },
      error: (err) => {
        console.error('Search error: ', err);
      },
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      if (!this.tourView) {
        const coord = e.latlng;
        const lat = coord.lat;
        const lng = coord.lng;
        if (this.onlyOneMarker) {
          this.clearMarkers();
        }
        this.keyPointSelected.emit({ latitude: lat, longitude: lng });
        this.locationSelected.emit({ latitude: lat, longitude: lng });
        this.service.reverseSearch(lat, lng).subscribe((res) => {
          console.log(res.display_name);
        });
        const mp = new L.Marker([lat, lng]).addTo(this.map);
        this.markers.push(mp);
        this.service.reverseSearch(lat, lng).subscribe((response) => {
          this.address = response.display_name; // Dobijena adresa
          console.log('Dobijena adresa:', this.address);
        });
        this.markerAdded.emit({ latitude: lat, longitude: lng }); // Emit the added marker
      }
    });
  }

  clearMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

}
