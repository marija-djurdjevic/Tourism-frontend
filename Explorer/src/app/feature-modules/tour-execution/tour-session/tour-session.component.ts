import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  @ViewChild('imageContainer', { static: false }) imageContainer!: ElementRef;

  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;
  keyPoints: KeyPoint[] = [];
  encounters: Encounter[] = [];
  required: Encounter[] = [];
  completed: Encounter[] = [];
  showPopup: boolean = false;
  keyPointForEncounter: KeyPoint | null = null;
  private intervalId: any;
  showLocationPopup = false;
  private popupInterval: Subscription | undefined;
  completedKeyPoints: CompletedKeyPoint[] = [];
  sortedPoints: KeyPoint[] = [];
  selectedTab: string = 'all';
  currentActiveEncounter: Encounter | null = null;
  isWithinRange: boolean = false;
  timer: number = 30;
  interval: any;
  userLevel: number = 0;
  showAddEncounterForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tourExecutionService: TourExecutionService,
    private keyPointService: KeyPointService,
    private router: Router,
    private snackBar: MatSnackBar,
    private imageService: ImageService,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
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

  loadUserLevel(): void {
    this.tourExecutionService.getUserLevel().subscribe({
      next: (userLevel) => {
        console.log('User level:', userLevel);
        this.userLevel = userLevel;
      },
      error: (error) => {
        console.error('Error loading user level:', error);
      }
    });
  }

  loadEncounters(): void {
    this.loadUserLevel();
    this.tourExecutionService.getAllEncountersForTour(this.tourId).subscribe({
      next: (encounters) => {
        this.encounters = encounters.sort((a, b) => (a.creator != 0 ? 1 : 0) - (b.creator != 0 ? 1 : 0));
        this.required = this.encounters.filter(e => e.creator == 0 && e.isCompletedByMe == false);
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
    if (this.currentActiveEncounter) {
      this.startHiddenLocationChallenge(this.currentActiveEncounter);
    }

    const nextKeyPoint = this.findFirstIncompleteKeyPoint();

    if (nextKeyPoint) {
      const distance = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        nextKeyPoint.latitude,
        nextKeyPoint.longitude
      );

      const proximityThreshold = 50;
      this.required = this.encounters.filter(e => e.creator == 0 && e.isCompletedByMe == false);
      if (distance <= proximityThreshold && this.required.length < 1) {
        this.addKeyPointToCompleted(nextKeyPoint);
      }
      if(this.required.length == 0){
        this.snackBar.open('You have required encounters to complete.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
      }
    }

    const neareastKeyPointWithEncounter = this.findNearestSocialEncounter();

    if (neareastKeyPointWithEncounter) {
      const distance = this.calculateDistance(
        this.location.latitude,
        this.location.longitude,
        neareastKeyPointWithEncounter.coordinates.latitude,
        neareastKeyPointWithEncounter.coordinates.longitude
      );

      if (distance <= (neareastKeyPointWithEncounter.range || 50)) {
        //dodaj EncounterExecution ili ako vec postoji uradi nesto u zavisnosti od izazova
        console.log("Encounter found!");
        const encounterExecution: EncounterExecution = {
          id: 0,
          encounterId: neareastKeyPointWithEncounter.id,
          touristId: 0
        };

        this.createExecution(encounterExecution);
      }
      else {
        //obrisi EncounterExecution ako vec postoji

        console.log("Encounter not found!");
      }
    }

    this.updateLocation();
  }

  createExecution(encounterExecution: any): void {
    this.tourExecutionService.createEncounterExecution(encounterExecution).subscribe({
      next: (result) => {
        console.log(result);
        this.updateEncounterExecution(result);
        this.snackBar.open('Encounter execution created!', 'Close', {
          duration: 3000,
          panelClass: "succesful"
        });
      },
      error: (error) => {
        console.error('Error occurred:', error);
        this.snackBar.open('Failed to create encounter execution. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
      }
    });
  }

  updateEncounterExecution(encounterExecution: EncounterExecution): void {
    this.tourExecutionService.updateEncounterExecution(encounterExecution).subscribe({
      next: (result) => {
        console.log(result);
        this.loadEncounters();
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
         // window.location.href = 'http://localhost:4200/purchasedTours';
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
          this.snackBar.open('Tour session has ended. Thank you for participating!', 'Close', {
            duration: 3000,
            panelClass: "succesful"
          });
         
        }
      },
      error: () => {
        console.warn('Error updating location.');
        this.snackBar.open('Error updating location. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
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

  findNearestSocialEncounter(): Encounter | null {
    const sortedSocialEncounters = this.encounters
      .filter(a => a.type === 0) 
      .sort((a, b) => {
    const distanceA = this.calculateDistance(
      this.location.latitude,
      this.location.longitude,
      a.coordinates.latitude,
      a.coordinates.longitude
    );
    const distanceB = this.calculateDistance(
      this.location.latitude,
      this.location.longitude,
      b.coordinates.latitude,
      b.coordinates.longitude
    );

    return distanceA - distanceB;
  });

    if (sortedSocialEncounters[0])
      return sortedSocialEncounters[0];
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
    if (encounter.type === 1) {
      this.snackBar.open('This is a hidden location challenge. Please wait for the image to load.', 'Close', {
        duration: 3000,
        panelClass: "info"
      });

      // Postavite tab na 'active'
      this.currentActiveEncounter = encounter;
      this.selectedTab = 'active';

      // Osvežite prikaz pre nego što pristupite DOM-u
      setTimeout(() => {
        const imageContainer = this.imageContainer?.nativeElement;
        if (!imageContainer) {
          console.error('imageContainer is not available in DOM.');
          return;
        }

        // Kreirajte i prikažite sliku
        const imageElement = this.renderer.createElement('img');
        this.renderer.setAttribute(imageElement, 'src', encounter.image);
        this.renderer.setStyle(imageElement, 'maxWidth', '100%');
        this.renderer.setStyle(imageElement, 'height', 'auto');
        this.renderer.setStyle(imageElement, 'borderRadius', '5px');
        this.renderer.setStyle(imageElement, 'boxShadow', '0 2px 5px rgba(0,0,0,0.1)');
        this.renderer.setProperty(imageContainer, 'innerHTML', '');
        this.renderer.appendChild(imageContainer, imageElement);

        // Počnite izazov
        this.startHiddenLocationChallenge(encounter);
      }, 0); // Dodajte kratko kašnjenje da Angular osveži DOM
    }
  }


  startHiddenLocationChallenge(encounter: Encounter): void {
    // Logic to start the hidden location challenge
    // For example, you can use geolocation to check if the user is within 5 meters of the target location
    // and start a 30-second timer to complete the challenge

    const distance = this.calculateDistance(this.location.latitude, this.location.longitude, encounter.coordinates.latitude, encounter.coordinates.longitude);
    if (distance <= 5) {
      this.snackBar.open('You are within 5 meters of the target location. Hold your position for 30 seconds.', 'Close', {
        duration: 3000,
        panelClass: "info"
      });
      this.isWithinRange = true;
      this.startTimer();
    } else {
      this.isWithinRange = false;
      this.stopTimer();
      this.snackBar.open('You are not within 5 meters of the target location. Try again.', 'Close', {
        duration: 3000,
        panelClass: "error"
      });
    }
  }

  startTimer() {
    this.timer = 30;
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else if (this.timer == 0) {
        if (this.currentActiveEncounter) {
          this.completeHiddenLocationChallenge(this.currentActiveEncounter);
        }
        this.stopTimer();
      }
      else {
        this.stopTimer();
        // Logic to handle completion of encounter
      }
      if (this.selectedTab != 'active') {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  completeHiddenLocationChallenge(encounter: Encounter): void {
    // Logic to mark the challenge as completed
    encounter.isCompletedByMe = true;
    this.snackBar.open('Challenge completed successfully!', 'Close', {
      duration: 3000,
      panelClass: "success"
    });
    const encounterExecution: EncounterExecution = {
      id: 0,
      encounterId: encounter.id,
      touristId: 0,
      CompletedTime: new Date()
    };
    this.required = this.encounters.filter(e => e.creator == 0 && e.isCompletedByMe == false);
    encounter.isCompletedByMe = true;
    this.completed = this.encounters.filter(e => e.isCompletedByMe == true);
    this.loadEncounters();
    this.createExecution(encounterExecution);
    this.selectedTab = 'completed';
  }

  markAsCompleated(encounter: Encounter): void {
    if (!encounter.isCompletedByMe && encounter.type == 3) {
      this.createExecution({ id: 0, encounterId: encounter.id, touristId: 0, CompletedTime: new Date() });
      encounter.isCompletedByMe = true;
      this.required = this.encounters.filter(e => e.creator == 0 && e.isCompletedByMe == false);
      this.completed = this.encounters.filter(e => e.isCompletedByMe == true);
      this.selectedTab = 'completed';
      this.loadUserLevel();
    } else {
      this.snackBar.open('You can\'t mark as completed this encounter.', 'Close', {
        duration: 3000,
        panelClass: "error"
      });
    }
  }

}
