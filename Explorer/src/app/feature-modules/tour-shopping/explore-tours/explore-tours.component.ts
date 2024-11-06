import { Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourShoppingService } from '../tour-shopping.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { OrderItem } from '../model/order-item.model';
import { KeyPoint } from '../../tour-authoring/model/key-point.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from '../../tour-execution/model/tour-review.model';

@Component({
  selector: 'xp-explore-tours',
  templateUrl: './explore-tours.component.html',
  styleUrls: ['./explore-tours.component.css']
})
export class ExploreToursComponent implements OnInit{

  tours: Tour[] = [];
  isReviewsModalOpen = false;
  user: User;
  purchasedTours: Tour[] = [];
  selectedTourReviews: TourReview[] = [];
  allSelectedTourReviews: TourReview[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 0;
  totalPages: number = 0;
  currentTourId: number = 0;


  constructor(private service: TourShoppingService, private authService: AuthService, private tourService: TourExecutionService ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
      this.getTours();
      this.loadPurchasedTours();
  }

  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: Array<Tour>) => {
        this.tours = result;
        console.log(this.tours)
        // Assign a single key point to each tour
        this.tours.forEach(tour => {
          this.assignSingleKeyPoint(tour);
        });
        
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private loadPurchasedTours(): void {
    this.service.getPurchasedTours().subscribe({
      next: (tours: Tour[]) => {
        this.purchasedTours = tours;
      },
      error: (err) => {
        console.error('Failed to load purchased tours:', err);
      }
    });
  }

  assignSingleKeyPoint(tour: Tour): void {
    this.service.getKeyPoints().subscribe(keyPoints => {
      const keyPoint = keyPoints.find(kp => kp.tourId === tour.id);
      if (keyPoint) {
        tour.keyPoints[0] = keyPoint; // Assign the first matching key point
      }
    });
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
    } else {
        // If item does not exist, add it with quantity 1
        const newItem: OrderItem = { tourId, tourName, price };
        cart.push(newItem);
        alert("Added to cart");
        console.log(`Tour with ID ${tourId} added to cart for user ${this.user.username}`);
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

  showReviews(tourId: number) : void {
    this.isReviewsModalOpen = true;
    this.currentPage = 1;
    this.getReviews(tourId);
    this.currentTourId = tourId;
  }

  closeReviewsModal() : void {
    this.isReviewsModalOpen = false; 
  }

  getReviews(tourId: number): void {
    this.tourService.getReviews(this.currentPage, this.itemsPerPage).subscribe({
      next: (result: PagedResults<TourReview>) => {
        this.selectedTourReviews = result.results.filter(review => review.tourId === tourId);
        this.totalPages = Math.ceil(this.selectedTourReviews.length / 1);
        this.paginateReviews();
        this.isReviewsModalOpen = true;
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      }
    });
  }

  paginateReviews(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.selectedTourReviews = this.selectedTourReviews.slice(startIndex, endIndex);
  }
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getReviewsForPage();
    }
  }
  
  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getReviewsForPage();
    }
  }
  
  getReviewsForPage(): void {
    
    this.getReviews(this.currentTourId);
  }
  

}
