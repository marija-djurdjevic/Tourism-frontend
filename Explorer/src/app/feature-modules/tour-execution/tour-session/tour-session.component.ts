import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';
import { KeyPoint } from '../../tour-authoring/model/key-point.model';
import { KeyPointService } from '../../tour-authoring/key-point.service';
import { interval, Subscription } from 'rxjs';
import { CompletedKeyPoint } from '../model/tour-session.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Encounter } from '../../encounters/model/encounter.model';
import { switchMap } from 'rxjs';
import { EncounterExecution } from '../../encounters/model/encounter-execution.model';
import { TouristLocationComponent } from '../tourist-location/tourist-location.component';
import { ImageService } from 'src/app/shared/image.service';
@Component({
  selector: 'xp-tour-session',
  templateUrl: './tour-session.component.html',
  styleUrls: ['./tour-session.component.css']
})
export class TourSessionComponent implements OnInit {
  @ViewChild(TouristLocationComponent) mapComponent: TouristLocationComponent;

  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;
  keyPoints: KeyPoint[] = [];
  encounters: Encounter[] = [];
  required: Encounter[] = [];
  completed: Encounter[] = [];
  showPopup: boolean = false;
  private intervalId: any;
  showLocationPopup = false;
  private popupInterval: Subscription | undefined;
  completedKeyPoints: CompletedKeyPoint[] = [];
  sortedPoints: KeyPoint[] = [];
  selectedTab: string = 'all';

  constructor(
    private route: ActivatedRoute,
    private tourExecutionService: TourExecutionService,
    private keyPointService: KeyPointService,
    private router: Router,
    private snackBar: MatSnackBar,
    private imageService: ImageService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
    this.loadKeyPointsAndEncounters();
    this.loadCompletedKeyPoints();
    this.popupInterval = interval(10000).subscribe(() => {
      this.showLocationPopup = true;
    });
  }

  loadKeyPointsAndEncounters(): void {
    this.tourExecutionService.getKeyPoints(this.tourId).subscribe({
      next: (keyPoints) => {
        this.keyPoints = keyPoints;
        this.sortedPoints = [...this.keyPoints].sort((a, b) => (a.id ?? Infinity) - (b.id ?? Infinity));
        this.loadEncounters();
      }
    });
  }

  loadEncounters(): void {
    this.tourExecutionService.getAllEncountersForTour(this.tourId).subscribe({
      next: (encounters) => {
        this.encounters = encounters.sort((a, b) => (a.creator!=0 ? 1 : 0) - (b.creator!=0 ? 1 : 0));
        this.required = this.encounters.filter(e => e.creator == 0);
        this.completed = this.encounters.filter(e => e.isCompletedByMe == true);
        if (this.encounters) {
          this.snackBar.open('There are encounters for you, please check.', 'Close', {
            duration: 3000,
            panelClass: "error"
          });
        }
        // kod za ucitavanje slike po id
        if (this.encounters) {

          this.imageService.setControllerPath("tourist/image");
          this.encounters.forEach(element => {
            if (element.imagePath) {
              this.imageService.getImage(element.imagePath?.valueOf()).subscribe((blob: Blob) => {
                console.log(blob);  // Proveri sadržaj Blob-a
                if (blob.type.startsWith('image')) {
                  element.image = URL.createObjectURL(blob);
                  this.cd.detectChanges();
                } else {
                  console.error("Blob nije slika:", blob);
                }
              });
            }

          });
        }
        //kraj
      },
      error: (error) => {
        console.error('Error loading encounters:', error);
      }
    });
  }

  onLocationReceived(location: Location): void {
    this.location = location;

    const nextKeyPoint = this.findFirstIncompleteKeyPoint();

    if (nextKeyPoint) {
      const distance = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        nextKeyPoint.latitude,
        nextKeyPoint.longitude
      );

      const proximityThreshold = 50;
      if (distance <= proximityThreshold) {
        this.addKeyPointToCompleted(nextKeyPoint);
      }
    }

    const neareastKeyPointWithEncounter = this.findNearestKeyPointWithEncounter();

    if (neareastKeyPointWithEncounter && neareastKeyPointWithEncounter.encounter?.status === 1) {
      const neareastEncounterDistance = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        neareastKeyPointWithEncounter.latitude,
        neareastKeyPointWithEncounter.longitude
      );

      const proximityThreshold = 50;
      if (neareastEncounterDistance <= proximityThreshold) {
        //dodaj EncounterExecution ili ako vec postoji uradi nesto u zavisnosti od izazova
        console.log("Encounter found!");
        const encounterExecution: EncounterExecution = {
          id: 0,
          encounterId: neareastKeyPointWithEncounter.encounter.id,
          touristId: 0
        };

        this.tourExecutionService.createEncounterExecution(encounterExecution).subscribe({
          next: (result) => {
            console.log(result);
            this.updateEncounterExecution(result);
          },
          error: (error) => {
            console.error('Error occurred:', error);
          }
        });
      }
      else {
        //obrisi EncounterExecution ako vec postoji

        console.log("Encounter not found!");
      }
    }

    this.updateLocation();
  }

  updateEncounterExecution(encounterExecution: EncounterExecution): void {
    this.tourExecutionService.updateEncounterExecution(encounterExecution).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (error) => {
        console.error('Error occurred:', error);
      }
    });
  }

  abandonTour(): void {
    this.tourExecutionService.abandonTour(this.tourId).subscribe({
      next: (result) => {
        if (result) {
          this.tourStarted = false;
          this.snackBar.open('Tour abandoned successfully!', 'Close', {
            duration: 3000,
            panelClass: "succesful"
          });
          window.location.href = 'http://localhost:4200/purchasedTours';
        } else {
          this.snackBar.open('Failed to abandon tour. Please try again.', 'Close', {
            duration: 3000,
            panelClass: "succesful"
          });
        }
      },
      error: () => {
        this.snackBar.open('Failed to abandon tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "succesful"
        });
      }
    });
  }

  reportProblem(): void {
    this.router.navigate(['/report', this.tourId]);
  }

  updateLocation(): void {
    this.tourExecutionService.updateLocation(this.tourId, this.location.latitude, this.location.longitude).subscribe({
      next: (isNear) => {
        if (isNear) {
          window.location.href = 'http://localhost:4200/purchasedTours';
        }
      },
      error: () => {
        console.warn('Error updating location.');
      }
    });
  }

  loadCompletedKeyPoints(): void {
    this.tourExecutionService.getCompletedKeyPoints(this.tourId).subscribe({
      next: (completedKeyPoints) => {
        this.completedKeyPoints = completedKeyPoints;
      },
      error: (error) => {
        console.error('Error loading completed key points:', error);
      }
    });
  }

  findNearestKeyPointWithEncounter(): KeyPoint | null {
    const sortedKeyPoints = [...this.keyPoints].sort((a, b) => {
      const distanceA = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        a.latitude,
        a.longitude
      );
      const distanceB = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        b.latitude,
        b.longitude
      );

      return distanceA - distanceB;
    });

    if (sortedKeyPoints[0].encounter)
      return sortedKeyPoints[0];
    else
      return null;
  }

  findFirstIncompleteKeyPoint(): KeyPoint | null {
    const completedIds = new Set(this.completedKeyPoints.map((completedKP) => completedKP.keyPointId));

    const sortedKeyPoints = [...this.keyPoints].sort((a, b) => (a.id ?? Infinity) - (b.id ?? Infinity));

    for (const keyPoint of sortedKeyPoints) {
      if (keyPoint.id != null && !completedIds.has(keyPoint.id)) {
        return keyPoint;
      }
    }
    return null;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  addKeyPointToCompleted(keyPoint: KeyPoint): void {
    this.tourExecutionService.addCompletedKeyPoint(this.tourId, keyPoint.id).subscribe({
      next: () => {
        this.loadCompletedKeyPoints();
        this.loadEncounters();
        console.log('Successfully completed key point');
        this.snackBar.open('Successfully completed key point', 'Close', {
          duration: 3000,
          panelClass: "succesful"
        });
      },
      error: (error) => {
        console.error('Error adding key point to completed:', error);
        this.snackBar.open('Failed to complete key point. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
      }
    });
  }

  isKeyPointCompleted(keyPointId: number): boolean {
    return this.completedKeyPoints.some((completedKP) => completedKP.keyPointId === keyPointId);
  }

  ngOnDestroy(): void {
    this.popupInterval?.unsubscribe();
  }

  onKeyPointSelected(clickedKeyPoint: KeyPoint) {
    this.mapComponent.setCenter(clickedKeyPoint.latitude, clickedKeyPoint.longitude);
  }

  activateEncounter(encounter: any) {
    // Logic to activate the encounter
    console.log('Activating encounter:', encounter);
  }
}
