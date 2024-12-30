import { Component, EventEmitter, Input, OnChanges, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Encounter } from '../../encounters/model/encounter.model'; 
import { AdministrationService } from '../administration.service';
import { Coordinates } from '../../encounters/model/coordinates.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-encounter-form',
  templateUrl: './encounter-form.component.html',
  styleUrls: ['./encounter-form.component.css']
})

export class EncounterFormComponent implements OnInit, OnChanges {

  @Output() encounterUpdated = new EventEmitter<null>();
  @Input() encounter: Encounter;
  @Input() shouldEdit: boolean = false;
  newCoordinates: Coordinates = { latitude: 0, longitude: 0 };

  constructor(
    private service: AdministrationService, 
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  encounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    xp: new FormControl(0, [Validators.required]),
    coordinates: new FormGroup({
      latitude: new FormControl(0, [Validators.required]),
      longitude: new FormControl(0, [Validators.required])
    })
  });

  ngOnChanges(): void {
    if (this.shouldEdit && this.encounter) {
      this.encounterForm.patchValue({
        name: this.encounter.name,
        description: this.encounter.description,
        type: this.encounter.type,
        xp: this.encounter.xp,
        coordinates: this.encounter.coordinates
      });
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['encounter']) {
        try {
          this.encounter = JSON.parse(params['encounter']); 
          console.log('Preuzeti ENCOUNTER:', JSON.stringify(this.encounter, null, 2));
          this.shouldEdit = true;
          if (this.shouldEdit && this.encounter) {
            this.encounterForm.patchValue({
              name: this.encounter.name,
              description: this.encounter.description,
              type: this.encounter.type,
              xp: this.encounter.xp,
              coordinates: this.encounter.coordinates
            });
            this.newCoordinates = this.encounter.coordinates
            console.log(this.encounterForm);
          }
        } catch (error) {
          console.error('Invalid encounter data:', error);
        }
      } else {
        console.error('Encounter not found in query params');
      }
    });
  }

  get initialCoordinates(): Coordinates {
    if (this.shouldEdit && this.encounter && this.encounter.coordinates) {
      console.log('usao ovdjejejejejejeje');
      console.log(this.newCoordinates)
      return this.newCoordinates;
    }
    return { latitude: 0, longitude: 0 }; 
  }
  
  updateEncounter(): void {
    const loggedInUser = this.authService.user$.value; 
    const updatedEncounter: Encounter = {
      ...this.encounter,
      name: this.encounterForm.value.name || "",
      description: this.encounterForm.value.description || "",
      type: Number(this.encounterForm.value.type) || 0,
      xp: Number(this.encounterForm.value.xp) || 0,
      status: this.encounter.status || 0,
      userId: loggedInUser.id || 0,
      coordinates: {
        longitude: this.newCoordinates.longitude,
        latitude: this.newCoordinates.latitude
      }
    };

    console.log("encounter za update ", JSON.stringify(updatedEncounter, null, 2));
    this.service.updateEncounter(updatedEncounter.id, updatedEncounter).subscribe({
      next: () => {
        this.encounterUpdated.emit();
        this.router.navigate(['/encounters']);
        this.notificationService.notify({ message: 'Encounter updated successfully', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err) => {
        console.error('Error updating encounter:', err);
      }
    });
  }

  addEncounter(): void {
    const loggedInUser = this.authService.user$.value; 
    const encounter: Encounter = {
    id: 0,
    keyPointId: 0,
    creator: 0,
    name: this.encounterForm.value.name || "",
    description: this.encounterForm.value.description || "",
    type: Number(this.encounterForm.value.type) || 0,
    xp: Number(this.encounterForm.value.xp) || 0,
    status: 0,
    userId: loggedInUser.id || 0,
    coordinates: {
    longitude: this.newCoordinates.longitude,
    latitude: this.newCoordinates.latitude
    }
    };

    console.log('Encounter to be added:', encounter); 
  
    this.service.addEncounter(encounter).subscribe({
      next: () => { this.encounterUpdated.emit();
        this.router.navigate(['/encounters']);
        this.notificationService.notify({ message: 'Encounter added successfully', duration: 3000, notificationType: NotificationType.SUCCESS });
       },
       error: (err) => {
        console.error('Error adding encounter:', err);
        if (err.status === 400) {
          console.error('Bad request:', err.error); 
        }
      } 
    });
  }

  onCoordinatesSelected(event: { latitude: number, longitude: number }): void {
    this.newCoordinates.latitude = event.latitude;
    this.newCoordinates.longitude = event.longitude;
  }
}
