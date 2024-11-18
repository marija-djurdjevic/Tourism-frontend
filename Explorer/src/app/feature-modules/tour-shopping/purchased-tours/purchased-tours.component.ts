import { Component } from '@angular/core';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
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

  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;

  constructor(private service: TourShoppingService, private router: Router, private authService: AuthService,private tourExecutionService:TourExecutionService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadPurchasedTours();
    });
  }

  private loadPurchasedTours(): void {
    this.service.getPurchasedTours().subscribe({
      next: (tours: Tour[]) => {
        this.tours = tours;
        console.log(this.tours)
      },
      error: (err) => {
        console.error('Failed to load purchased tours:', err);
      }
    });
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

  canReview(tourId: number): boolean {
    return true;
  }

  reviewTour(tourId: number, tourName: string) {
    this.router.navigate(['/review', tourId, tourName]);
  }


  showKeyPoints(tour: Tour): void {
    this.service.getKeyPoints().subscribe(keyPoints => {
      this.selectedTourKeyPoints = keyPoints.filter(kp => kp.tourId === tour.id);
      this.isKeyPointsModalOpen = true; // Open the modal
    });
  }

  closeKeyPointsModal(): void {
    this.isKeyPointsModalOpen = false; // Close the modal
    this.selectedTourKeyPoints = []; // Clear key points data
  }
}
