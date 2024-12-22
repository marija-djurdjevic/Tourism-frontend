import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Encounter } from '../../encounters/model/encounter.model'
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import * as L from 'leaflet';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit, OnDestroy {
  encounters: Encounter[] = [];
  loggedInUser: any;
  shouldEdit: boolean = false;
  currentEncounter: any;
  private maps: { [key: number]: L.Map } = {}; 
  private mapInitialized: Set<number> = new Set(); 

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.user$.value;
    this.loadEncounters();
  }

  ngOnDestroy(): void {
    this.clearMaps(); 
  }

  loadEncounters(): void {
    this.service.getEncounters().subscribe((data: PagedResults<Encounter>) => {
      this.encounters = data.results;
      this.cdr.detectChanges(); 
      this.clearMaps(); 
      this.initializeMaps();
    });
  }

  /*initializeMaps(): void {
    this.encounters.forEach(encounter => {
      const mapId = encounter.id;
      if (mapId !== undefined && !this.mapInitialized.has(mapId)) {
        const mapElement = document.getElementById(`map${mapId}`);
        if (mapElement && encounter.coordinates?.latitude && encounter.coordinates?.longitude) {
          const map = L.map(mapElement).setView([encounter.coordinates.latitude, encounter.coordinates.longitude], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          L.marker([encounter.coordinates.latitude, encounter.coordinates.longitude]).addTo(map);

          this.maps[mapId] = map; 
          this.mapInitialized.add(mapId); 
        }
      }
    });
  }*/

    initializeMaps(): void {
      setTimeout(() => {
        this.encounters.forEach(encounter => {
          const mapId = encounter.id;
          if (mapId !== undefined && !this.mapInitialized.has(mapId)) {
            const mapElement = document.getElementById(`map${mapId}`);
            if (mapElement && encounter.coordinates?.latitude && encounter.coordinates?.longitude) {
              const map = L.map(mapElement).setView([encounter.coordinates.latitude, encounter.coordinates.longitude], 13);
  
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);
  
              const customIcon = L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', 
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', 
                shadowSize: [41, 41]
              });

              L.marker([encounter.coordinates.latitude, encounter.coordinates.longitude], { icon: customIcon }).addTo(map);
  
              this.maps[mapId] = map; 
              this.mapInitialized.add(mapId); 
            }
          }
        });
      }, 0);
  }
  

  clearMaps(): void {
    for (const mapId in this.maps) {
      if (this.maps[mapId]) {
        this.maps[mapId].remove();
      }
    }
    this.maps = {};
    this.mapInitialized.clear();
  }

  isAdmin(administratorId: number): boolean {
    return this.loggedInUser.id === administratorId;
  }

  editEncounter(encounter: Encounter): void {
    this.shouldEdit = true;
    this.currentEncounter = encounter;
    this.router.navigate(['/encounter-form'], {
      queryParams: {
        encounter: JSON.stringify({
          id: encounter.id,
          name: encounter.name,
          description: encounter.description,
          type: encounter.type,
          xp: encounter.xp,
          status: encounter.status,
          coordinates: encounter.coordinates,
          administratorId: encounter.userId
        }),
      },
    });
  }

  deleteEncounter(encounter: Encounter): void {
    if (confirm('Are you sure you want to delete this encounter?')) {
      this.service.deleteEncounter(encounter.id).subscribe(() => {
        this.loadEncounters(); 
        this.notificationService.notify({ message: 'Encounter deleted successfully', duration: 3000, notificationType: NotificationType.SUCCESS });
      });
    }
  }

  navigateToAddEncounter(): void {
    this.router.navigate(['/encounter-form']);
  }
}
