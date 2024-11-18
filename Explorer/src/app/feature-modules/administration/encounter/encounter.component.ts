import { AfterViewInit, AfterViewChecked, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Encounter } from '../model/encounter.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import * as L from 'leaflet';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit, AfterViewChecked {
  encounters: Encounter[] = [];
  loggedInUser: any;
  shouldEdit: boolean = false; 
  currentEncounter: any;

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  initializeMaps(): void {
    this.encounters.forEach(encounter => {
      const mapElement = document.getElementById(`map${encounter.id}`);
      if (mapElement && encounter.coordinates && encounter.coordinates.latitude && encounter.coordinates.longitude) {
        const map = L.map(mapElement).setView([encounter.coordinates.latitude, encounter.coordinates.longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        L.marker([encounter.coordinates.latitude, encounter.coordinates.longitude]).addTo(map);
      }
    });
  }

  ngOnInit(): void {
    this.loggedInUser = this.authService.user$.value;
    this.loadEncounters();
  }

  ngAfterViewChecked(): void {
    if (this.encounters.length > 0) {
      this.initializeMaps();
    }
  }

  loadEncounters(): void {
    this.service.getEncounters().subscribe((data: PagedResults<Encounter>) => {
      this.encounters = data.results;
    });
  }

  isAdmin(administratorId: number): boolean {
    return this.loggedInUser.id === administratorId;
  }

  editEncounter(encounter: Encounter) {
    this.shouldEdit = true;
    this.currentEncounter = encounter;
    console.log(encounter);
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
          administratorId: encounter.administratorId
        }),
      },
    });
    
  }

  deleteEncounter(encounter: Encounter): void {
    if (confirm('Are you sure you want to delete this encounter?')) {
      this.service.deleteEncounter(encounter.id).subscribe(() => {
        this.loadEncounters();
      });
    }
  }

  navigateToAddEncounter() {
    this.router.navigate(['/encounter-form']);
  }
}
