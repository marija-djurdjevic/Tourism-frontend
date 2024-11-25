import { Component } from '@angular/core';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css']
})
export class PurchasedToursComponent {

  user: User;
  tours: Tour[] = [];
  selectedTourKeyPoints: any[] = []; // Holds key points for the selected tour
  isKeyPointsModalOpen = false; // Tracks whether the modal is open
  isLoading=false;
  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;

  constructor(private service: TourShoppingService,private snackBar:MatSnackBar, private router: Router, private authService: AuthService,private tourExecutionService:TourExecutionService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadPurchasedTours();
    });
  }

  private loadPurchasedTours(): void {
    this.isLoading=true;
    this.service.getPurchasedTours().subscribe({
      next: (tours: Tour[]) => {
        this.tours = tours;
        console.log(this.tours)
        this.isLoading=false;
      },
      error: (err) => {
        this.isLoading=false;
        console.error('Failed to load purchased tours:', err);
        this.snackBar.open('Failed to load purchased tours', 'Close', {
          duration: 3000
        });
      }
    });
  }

  executeTour(tour: Tour) {
    console.log(`Executing tour: ${tour.name}`);
  }

  canReview(tourId: number): boolean {
    return true;
  }

  reviewTour(tourId: number, tourName: string) {
    this.router.navigate(['/review', tourId, tourName]);
  }


  showKeyPoints(tour: Tour): void {
    if (tour.id !== undefined) { // Check if tour.id is defined
      this.service.getKeyPoints().subscribe(keyPoints => {
        this.selectedTourKeyPoints = keyPoints.filter(kp => kp.tourIds.includes(tour.id!)); // Use tour.id safely
        this.isKeyPointsModalOpen = true; // Open the modal
      });
    } else {
      console.error('Tour ID is undefined');
    }
  }
  closeKeyPointsModal(): void {
    this.isKeyPointsModalOpen = false; // Close the modal
    this.selectedTourKeyPoints = []; // Clear key points data
  }


  
onStartTourSession(tourId: number): void {
  if (tourId) {
    this.tourExecutionService.getTouristLocation().subscribe({
      next: (data) => {
        this.location.latitude = data.latitude
        this.location.longitude = data.longitude
        console.log("Turista se nalazi na lokaciji: long"+this.location.longitude+" lat: "+this.location.latitude)
        this.tourExecutionService.startTour(tourId, this.location.latitude, this.location.longitude, this.user?.id as number).subscribe({
          next: (result) => {
            if (result) {
              this.tourStarted = true;
              console.log('Tura je uspešno započeta!');
              this.router.navigate(['/tourSession', tourId]);
            } else {
              alert('Tura nije mogla biti započeta.');
            }
          },
          error: () => {
            alert('The selected tour can not be started!');
          }
        });
      },
      error: () => {
        alert('Došlo je do greške prilikom ucitavanja lokacije.');
      }
    });

  } else {
    console.warn('Lokacija ili tourId nisu dostupni za startovanje ture.');
  }
}



}
