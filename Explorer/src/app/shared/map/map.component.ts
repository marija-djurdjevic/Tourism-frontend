import { Component, Input, Output, EventEmitter, AfterViewInit, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PagedResults } from '../model/paged-results.model';
import { ImageService } from '../image.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Coordinates } from 'src/app/feature-modules/administration/model/coordinates.model';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/key-point.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  private objects: any[] = [];
  private points:any[] = [];
  private newKeyPoint:KeyPoint;
  @Input() isAddingKeyPoints: boolean = false; 
  @Input() keyPoints: any[] = [];
  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Input() markers: any[] = [];
  @Input() onlyOneMarker = false;
  @Input() tourView = false;
  @Input() initialCoordinates: Coordinates = { latitude: 0, longitude: 0 };
  @Output() keyPointSelected = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() coordinatesSelected = new EventEmitter<{ latitude: number; longitude: number }>();
  @Output() locationSelected = new EventEmitter<{ latitude: number, longitude: number }>();
  @Output() markerAdded = new EventEmitter<{ latitude: number, longitude: number }>();

  customIcon = new L.Icon({
    iconUrl: 'assets/current-location.png', // URL do prilagođene slike
    iconSize: [52, 52], // Širina i visina ikone
    iconAnchor: [16, 32], // Tačka gde je ikona vezana za koordinate
    popupAnchor: [0, -32] // Pozicija popup-a u odnosu na ikonu
  });


  ngOnInit(): void {
    if (this.initialCoordinates) {
      this.setMapMarker(this.initialCoordinates);
    }
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadObjects();
      this.loadKeyPoints();
      console.log('Logged in user:', this.user);
    });
  }

  setMapMarker(coordinates: Coordinates): void {
    console.log('Postavljene početne koordinate na mapi:', coordinates);
  }

  private loadObjects(): void {
    this.http.get<PagedResults<Object>>('https://localhost:44333/api/'+this.user?.role+'/object').subscribe(data => {
      this.objects = data.results;
      this.imageService.setControllerPath(this.user?.role+"/image");
      this.objects.forEach(element => {
        this.imageService.getImage(element.imageId.valueOf()).subscribe((blob: Blob) => {
          console.log(blob);  // Proveri sadržaj Blob-a
          if (blob.type.startsWith('image')) {
            element.image = URL.createObjectURL(blob);
            this.cd.detectChanges();
            this.addMarker(element);
          } else {
            console.error("Blob nije slika:", blob);
          }
        });

      });
    });
  }

  private loadKeyPoints(): void {
   
   
    this.http.get<PagedResults<KeyPoint>>('https://localhost:44333/api/'+this.user?.role+'/keyPoint/public').subscribe(data => {
      console.log('API Response:', data);
      console.log('data.results:', data.results);
      console.log('Type of data.results:', typeof data.results);
      this.points = Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
      console.log('this.points:', this.points);
      this.points.forEach(element => {      
            this.cd.detectChanges();
            this.addMarker2(element);
        });

      });
  }
  private addMarker2(point: any): void {
    if (!point.imagePath) {
      console.error('Image  is not set for keypoint:', point);
      return;
    }
    var imageURL='assets/publicPoint.png'
    point.category ='Public Point';

    const marker = L.marker([point.latitude, point.longitude], {
      icon: L.icon({
        iconUrl: imageURL, // URL slike objekta
        iconSize: [52, 52], // Prilagodite veličinu ikone po potrebi
        iconAnchor: [26, 52],
        popupAnchor: [0, -52],
        shadowSize: [52, 52]
      }),
      draggable: false
    }).addTo(this.map);

    marker.bindPopup(`
      <div style="text-align: center;">
        <img src="${point.imagePath}" alt="${point.name}" style="width: 100px; height: auto;"/><br>
        <strong>${point.name}</strong><br>
        ${point.description}<br>
        Category: ${point.category}
      </div>
    `);

    marker.on('mouseover', (e) => {
      marker.openPopup();
    });

    marker.on('mouseout', (e) => {
      marker.closePopup();
    });

    marker.on('click', () => {
      if (this.isAddingKeyPoints) {
        console.log('Marker clicked:', point);
        this.keyPointSelected.emit(point); // Emit the full point object
      }
    });
  }
  
  private addMarker(object: any): void {
    if (!object.image) {
      console.error('Image URL is not set for object:', object);
      return;
    }
    var imageUrl = '';
    switch (object.category) {
      case 0: imageUrl = 'assets/wc.png'
        object.category = 'WC'
        break;
      case 1: imageUrl = 'assets/restaurant.png'
        object.category = 'Restaurant'
        break;
      case 2: imageUrl = 'assets/parking.png'
        object.category = 'Parking'
        break;
      default:
        imageUrl = imageUrl = 'assets/other.png';
        object.category = 'Other'
    }

    const marker = L.marker([object.latitude, object.longitude], {
      icon: L.icon({
        iconUrl: imageUrl, // URL slike objekta
        iconSize: [52, 52], // Prilagodite veličinu ikone po potrebi
        iconAnchor: [26, 52],
        popupAnchor: [0, -52],
        shadowSize: [52, 52]
      }),
      draggable: false
    }).addTo(this.map);

    marker.bindPopup(`
      <div style="text-align: center;">
        <img src="${object.image}" alt="${object.name}" style="width: 100px; height: auto;"/><br>
        <strong>${object.name}</strong><br>
        ${object.description}<br>
        Category: ${object.category}
      </div>
    `);

    marker.on('mouseover', (e) => {
      marker.openPopup();
    });

    marker.on('mouseout', (e) => {
      marker.closePopup();
    });

   
  }

  private map: any;
  message: string = "";
  option: 'walking' | 'driving' | 'cycling' = 'driving';
  searchQuery: string = '';
  address: string = '';
  routeControl: any = null;
  user: User | undefined;

  get Option(): 'walking' | 'driving' | 'cycling' {
    return this.option;
  }

  set Option(value: 'walking' | 'driving' | 'cycling') {
    this.option = value;
    this.setRouteFromKeyPoints()
  }

  constructor(
    private service: MapService,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private imageService: ImageService,
    private authService: AuthService
  ) { }

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
        this.coordinatesSelected.emit({ latitude, longitude });
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
          this.coordinatesSelected.emit({ latitude: lat, longitude: lon });
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
        this.coordinatesSelected.emit({ latitude: lat, longitude: lng });
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
