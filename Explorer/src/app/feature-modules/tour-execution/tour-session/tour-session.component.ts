import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';
import { KeyPoint } from '../../tour-authoring/model/key-point.model';
import { KeyPointService } from '../../tour-authoring/key-point.service';
import { interval, Subscription } from 'rxjs';
import { CompletedKeyPoint } from '../model/tour-session.model';
@Component({
  selector: 'xp-tour-session',
  templateUrl: './tour-session.component.html',
  styleUrls: ['./tour-session.component.css']
})
export class TourSessionComponent implements OnInit {
  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;
  keyPoints: KeyPoint[] = [];
  //newKeyPoint: KeyPoint;
  showPopup: boolean = false;
  private intervalId: any; 
  showLocationPopup = false;
  private popupInterval: Subscription | undefined;
  completedKeyPoints: CompletedKeyPoint[] = [];

  constructor(
    private route: ActivatedRoute,
    private tourExecutionService: TourExecutionService,
    private keyPointService: KeyPointService
  ) {}

  ngOnInit(): void {
    
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
    this.updateSession()

    this.loadKeyPoints(); // Poziv funkcije za učitavanje ključnih tačaka

    // Show pop-up every 10 seconds
    //this.intervalId = setInterval(() => {
   //   this.showPopup = true;
    //}, 10000); // 10000 ms = 10 seconds
    // Set up a 10-second interval to show the location popup
    //this.tourExecutionService.startTour(this.tourId, this.location.latitude, this.location.longitude).subscribe(response => {
      //console.log('Tour started. Completed KeyPoints:', response.completedKeyPoints);
      // Handle the completed key points as needed
  //});

    this.loadCompletedKeyPoints();
    this.popupInterval = interval(10000).subscribe(() => {
      this.showLocationPopup = true;
    });
   
  }


  onLocationReceived(location: Location): void {
   
    this.location = location;
    console.log('Koordinate primljene u TourSessionComponent:', this.location);
    
    this.updateLocation();
    this.updateSession();
 
  }


  abandonTour(): void {
    this.tourExecutionService.abandonTour(this.tourId).subscribe({
      next: (result) => {
        if (result) {
          this.tourStarted = false;
          console.log('Tura je napuštena!');
          window.location.href = 'http://localhost:4200/tourList';
        } else {
          alert('Tura nije mogla biti napuštena.');
        }
      },
      error: () => {
        alert('Došlo je do greške prilikom napuštanja ture.');
      }
    });
  }


  updateLocation(): void {
    this.tourExecutionService.updateLocation(this.tourId, this.location.latitude, this.location.longitude).subscribe({
      next: (isNear) => {
        if (isNear) {
          console.log('Nalazite se u blizini ključne tačke ture.');
          window.location.href = 'http://localhost:4200/tourList';
        } else {
          console.log('Niste u blizini ključne tačke.');
        }
      },
      error: () => {
        console.warn('Došlo je do greške prilikom ažuriranja lokacije.');
      }
    });
  }
  

  updateSession(): void {
    // this.tourExecutionService.updateSession(this.tourId, this.location.latitude, this.location.longitude).subscribe({
    //   next: () => {
    //     console.log('Sesija uspešno ažurirana.');
    //   },
    //   error: () => {
    //     console.warn('Došlo je do greške prilikom ažuriranja sesije.');
    //   }
    // });
  }

  closePopup(): void {
    this.showLocationPopup = false;
  
    // First, update the tourist's location
    this.tourExecutionService.getTouristLocation().subscribe(
      (location) => {
        // Update latitude and longitude with the new values
        this.location.latitude = location.latitude;
        this.location.longitude = location.longitude;
  
        // After updating the location, proceed to find the next incomplete key point
        const nextKeyPoint = this.findFirstIncompleteKeyPoint();
        console.log('Next incomplete key point:', nextKeyPoint);
  
        if (nextKeyPoint) {
          const distance = this.calculateDistance(
            this.location.latitude,
            this.location.longitude,
            nextKeyPoint.latitude,
            nextKeyPoint.longitude
          );
  
          const proximityThreshold = 35000; // Proximity threshold in meters (35 km)
          if (distance <= proximityThreshold) {
            this.addKeyPointToCompleted(nextKeyPoint);
          }
        }
      },
      (error) => {
        console.error('Error retrieving tourist location:', error);
      }
    );
  
    // Update the last activity independently of the location
    this.tourExecutionService.updateLastActivity(this.tourId).subscribe({
      next: (response) => console.log('Last activity updated:', response),
      error: (err) => console.error('Error updating last activity:', err),
    });
  }

  loadKeyPoints() {
    this.tourExecutionService.getKeyPoints(this.tourId).subscribe(keyPoints => {
      console.log('Vraćeni keyPoints:', keyPoints); 
      this.keyPoints = keyPoints // Filtriranje po tourId
      console.log('Filtrirane ključne tačke: ', this.keyPoints); 
    });
  }

  loadCompletedKeyPoints(): void {
    this.tourExecutionService.getCompletedKeyPoints(this.tourId).subscribe(
      (completedKeyPoints) => {
        this.completedKeyPoints = completedKeyPoints;
        console.log('Loaded completed key points:', this.completedKeyPoints);
        console.log('Loaded completed key points:');
      this.completedKeyPoints.forEach((keyPoint) => {
        console.log('Completed key point ID:', keyPoint.keyPointId);
      });
      },
      (error) => {
        console.error('Error loading completed key points:', error);
      }
    );
  }

  findFirstIncompleteKeyPoint(): KeyPoint | null {
    // Convert completedKeyPoints to a Set for efficient lookups
    const completedIds = new Set(this.completedKeyPoints.map((completedKP) => completedKP.keyPointId));
  
    // Sort keyPoints by id in ascending order and find the first incomplete one
    const sortedKeyPoints = [...this.keyPoints].sort((a, b) => (a.id ?? Infinity) - (b.id ?? Infinity));
  
    for (const keyPoint of sortedKeyPoints) {
      // Check if the current keyPoint's id is not in completedIds
      if (keyPoint.id != null && !completedIds.has(keyPoint.id)) {
        return keyPoint; // Return the first incomplete key point with the smallest id
      }
    }
    return null; // All key points are completed
  }
  
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Distance in meters
  }
  
  addKeyPointToCompleted(keyPoint: KeyPoint): void {
    this.tourExecutionService.addCompletedKeyPoint(this.tourId, keyPoint.id).subscribe(
      () => {
        this.loadCompletedKeyPoints()
        console.log('dodao sam kljucnu tacku ')
        alert('Uspesno kompletirana kljucna tacka')
      },
      (error) => {
        console.error('Error adding key point to completed:', error);
      }
    );
  }

  isKeyPointCompleted(keyPointId: number): boolean {
    return this.completedKeyPoints.some((completedKP) => completedKP.keyPointId === keyPointId);
  }

  ngOnDestroy(): void {
    this.popupInterval?.unsubscribe();
  }







}
