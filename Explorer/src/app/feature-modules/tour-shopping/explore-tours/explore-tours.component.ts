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
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaleService } from '../sales.service';
import { Sale } from '../model/sale.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-explore-tours',
  templateUrl: './explore-tours.component.html',
  styleUrls: ['./explore-tours.component.css']
})
export class ExploreToursComponent implements OnInit {

  tours: Tour[] = [];
  sales: Sale[] = [];

  showDiscountedOnly: boolean = false;
  isReviewsModalOpen = false;
  user: User;
  purchasedTours: Tour[] = [];
  selectedTourReviews: TourReview[] = [];
  isLoading = false;
  refundId: number | null = null;
  refundedTourId: number;

  constructor(private service: TourShoppingService, private saleService: SaleService, private notificationService: NotificationService, private cd: ChangeDetectorRef, private imageService: ImageService, private authService: AuthService, private tourService: TourExecutionService, private router: Router, private route: ActivatedRoute) {
    imageService.setControllerPath("tourist/image");
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.getTours();
    this.loadSalesData();
    this.loadPurchasedTours();
    this.route.queryParams.subscribe(params => {
      const selectedTourId = params['selectedTourId'] ? Number(params['selectedTourId']) : null;
      if (selectedTourId) {
        this.refundedTourId = selectedTourId; // Koristi refundedTourId da iskoristiš isti hajlajt mehanizam
        console.log('Selected Tour ID:', this.refundedTourId);
      }
    });
    this.route.queryParams.subscribe(params => {
      this.refundId = params['refundId'] ? Number(params['refundId']) : null;
      console.log('Captured refundId:', this.refundId);

      if (this.refundId) {
        this.fetchRefundedTour(this.refundId); // Fetch the refunded tour
      }
    });
  }

  loadSalesData(): void {
    // Fetch sales data
    this.saleService.getSales().subscribe({
      next: (results: PagedResults<Sale>) => {
        this.sales = results.results
        console.log("Sales:", this.sales);
      },
      error: () => {
        console.log("ERROR LOADING SALES");
        this.notificationService.notify({ message: 'Failed to load sales data. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  getDiscountedPrice(tour: Tour): number {
    const sale = this.sales.find(s => s.tourIds.includes(tour.id as number));
    if (sale) {
      // Apply discount (percentage discount)
      const discountAmount = (tour.price * sale.discount) / 100;
      return tour.price - discountAmount;
    }
    return tour.price; // Return original price if no sale
  }

  searchTours(): void {
    this.router.navigate(['/tour-search']);
  }

  fetchRefundedTour(refundId: number): void {
    this.service.getRefundedTour(refundId).subscribe({
      next: (refundedTourId: number) => {
        this.refundedTourId = refundedTourId; // Assign the value from the observable
        console.log('Refunded Tour ID:', this.refundedTourId);
      },
      error: (err) => {
        console.error('Error fetching refunded tour ID:', err);
        this.notificationService.notify({ message: 'Failed to fetch refunded tour ID.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  getFilteredTours() {
    if (this.showDiscountedOnly) {
      return this.tours.filter(tour => this.getDiscountedPrice(tour) !== tour.price);
    }
    return this.tours;
  }

  // This method toggles the filter
  toggleDiscountFilter() {
    this.showDiscountedOnly = !this.showDiscountedOnly;
  }

  getTours(): void {
    this.isLoading = true
    if (this.user.role == "tourist") {
      this.service.getTours().subscribe({
        next: (result: Array<Tour>) => {
          this.tours = result;
          console.log(this.tours)
          this.isLoading = false;
          // Assign a single key point to each tour
          this.tours.forEach(tour => {
            this.assignSingleKeyPoint(tour);
          });

        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false
          this.notificationService.notify({ message: 'Failed to load tours. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
        }
      });
    }
  }

  private loadPurchasedTours(): void {
    this.isLoading = true;
    if (this.user.role == "tourist") {
      this.service.getPurchasedTours().subscribe({
        next: (tours: Tour[]) => {
          this.purchasedTours = tours;
          this.isLoading = false
        },
        error: (err) => {
          console.error('Failed to load purchased tours:', err);
          this.isLoading = false;
          this.notificationService.notify({ message: 'Failed to load purchased tours. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
        }
      });
    }
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
      this.notificationService.notify({ message: 'Tour is already in cart.', duration: 3000, notificationType: NotificationType.INFO });
    } else {
      // If item does not exist, add it with quantity 1
      const newItem: OrderItem = { tourId, tourName, price };
      cart.push(newItem);
      console.log("Added to cart");
      console.log(`Tour with ID ${tourId} added to cart for user ${this.user.username}`);
      this.notificationService.notify({
        message: 'Tour added to cart successfully!', duration: 3000, notificationType: NotificationType.SUCCESS, action: 'View Cart', actionCallback: () =>
          this.router.navigate(['/cart'])
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
        this.notificationService.notify({ message: 'Failed to load reviews. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
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
