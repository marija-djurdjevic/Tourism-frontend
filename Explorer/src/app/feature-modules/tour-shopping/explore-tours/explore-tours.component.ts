import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourShoppingService } from '../tour-shopping.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { OrderItem } from '../model/order-item.model';
import { KeyPoint } from '../../tour-authoring/model/key-point.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from '../../tour-authoring/model/tour-review.model';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-explore-tours',
  templateUrl: './explore-tours.component.html',
  styleUrls: ['./explore-tours.component.css']
})
export class ExploreToursComponent implements OnInit {

  tours: Tour[] = [];
  isReviewsModalOpen = false;
  user: User;
  purchasedTours: Tour[] = [];
  selectedTourReviews: TourReview[] = [];
  isLoading=false;


  constructor(private service: TourShoppingService,private snackBar:MatSnackBar, private cd: ChangeDetectorRef, private imageService: ImageService, private authService: AuthService, private tourService: TourExecutionService, private router: Router) {
    imageService.setControllerPath("tourist/image");
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getTours();
    this.loadPurchasedTours();
  }
  searchTours():void{
    this.router.navigate(['/tour-search']);
  }

  getTours(): void {
    this.isLoading=true
    this.service.getTours().subscribe({
      next: (result: Array<Tour>) => {
        this.tours = result;
        console.log(this.tours)
        this.isLoading=false;
        // Assign a single key point to each tour
        this.tours.forEach(tour => {
          this.assignSingleKeyPoint(tour);
        });

      },
      error: (err: any) => {
        console.log(err);
        this.isLoading=false
        this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  private loadPurchasedTours(): void {
    this.isLoading=true;
    this.service.getPurchasedTours().subscribe({
      next: (tours: Tour[]) => {
        this.purchasedTours = tours;
        this.isLoading=false
      },
      error: (err) => {
        console.error('Failed to load purchased tours:', err);
        this.isLoading=false;
        this.snackBar.open('Failed to load purchased tours. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  assignSingleKeyPoint(tour: Tour): void {
    if (tour.id !== undefined) { // Ensure tour.id is defined
      this.service.getKeyPoints().subscribe(keyPoints => {
        const keyPoint = keyPoints.find(kp => kp.tourIds.includes(tour.id!)); // Use `!` after `tour.id`
        if (keyPoint) {
          if (!tour.keyPoints) {
            tour.keyPoints = []; // Initialize `keyPoints` if it is undefined
          }
          tour.keyPoints[0] = keyPoint; // Assign the first matching key point
        }
      });
    } else {
      console.error('Tour ID is undefined');
    }
  }

  addToCart(tourId: number, tourName: string, price: number): void {

    // Define the cart key based on the user ID
    const cartKey = `cart_${this.user.id}`;

    // Get the existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    // Check if the item already exists in the cart
    const existingItem = cart.find((item: { tourId: number }) => item.tourId === tourId);

    if (existingItem) {
      console.log('Item already in cart');
      this.snackBar.open('Tour is already in cart.', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });
    } else {
      // If item does not exist, add it with quantity 1
      const newItem: OrderItem = { tourId, tourName, price };
      cart.push(newItem);
      console.log("Added to cart");
      console.log(`Tour with ID ${tourId} added to cart for user ${this.user.username}`);
      this.snackBar.open('Tour added to cart successfully!', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });
    }

    // Update the cart in localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  isTourInCart(id: number): boolean {
    const cartKey = `cart_${this.user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    console.log(cart.some((item: { tourId: number }) => item.tourId === id))
    return cart.some((item: { tourId: number }) => item.tourId === id);
  }

  isPurchased(tourId: number): boolean {
    return this.purchasedTours.some(tour => tour.id === tourId);
  }

  showReviews(tourId: number): void {
    this.isReviewsModalOpen = true;
    this.getReviews(tourId);
  }

  closeReviewsModal(): void {
    this.isReviewsModalOpen = false;
  }

  getReviews(tourId: number): void {
    this.tourService.getReviews().subscribe({
      next: (result: PagedResults<TourReview>) => {
        this.selectedTourReviews = result.results.filter(review => review.tourId === tourId);
        this.getImages();
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.snackBar.open('Failed to load reviews. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  getImages(): void {
    for (const review of this.selectedTourReviews) {
      review.reviewImages = [];
      this.imageService.setControllerPath("tourist/image");
      review.images.split(',').forEach(element => {
        this.imageService.getImage(Number(element).valueOf()).subscribe((blob: Blob) => {
          console.log(blob);  // Proveri sadržaj Blob-a
          if (blob.type.startsWith('image')) {
            review.reviewImages?.push(URL.createObjectURL(blob));
            this.cd.detectChanges();
          } else {
            console.error("Blob nije slika:", blob);
          }
        });

      });
      //kraj
    }
  }
  
  

}
