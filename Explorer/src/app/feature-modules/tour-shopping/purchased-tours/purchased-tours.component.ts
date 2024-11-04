import { Component } from '@angular/core';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';

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

  constructor(private service: TourShoppingService, private authService: AuthService) {}

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

  executeTour(tour: Tour) {
    console.log(`Executing tour: ${tour.name}`);
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
