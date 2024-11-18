import { Component } from '@angular/core';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private service: TourShoppingService,private snackBar:MatSnackBar, private router: Router, private authService: AuthService) { }

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
