import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { GroupTourExecution } from '../model/group-tour-exectuion.model';
import { GroupTour } from '../../tour-authoring/model/group-tour.model';

@Component({
  selector: 'xp-explore-tours',
  templateUrl: './explore-tours.component.html',
  styleUrls: ['./explore-tours.component.css']
})
export class ExploreToursComponent implements OnInit {

  tours: Tour[] = [];
  sales: Sale[] = [];
  participations: GroupTourExecution[] = [];
  groupTours: GroupTour[] = [];

  showDiscountedOnly: boolean = false;
  isReviewsModalOpen = false;
  user: User;
  purchasedTours: Tour[] = [];
  selectedTourReviews: TourReview[] = [];
  isLoading=false;
  refundId: number | null = null;
  refundedTourId: number;
  visiblePopupId: number | null = null;
  disabledGroupTourParticipation = false;

  @ViewChild('popup') popup!: ElementRef;
  @ViewChild('popupParent') popupParent!: ElementRef;

  constructor(private service: TourShoppingService, private saleService: SaleService, private snackBar:MatSnackBar, private cd: ChangeDetectorRef, private imageService: ImageService, private authService: AuthService, private tourService: TourExecutionService, private router: Router,private route: ActivatedRoute) {
    imageService.setControllerPath("tourist/image");
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.getTours();
    this.loadSalesData();
    this.loadPurchasedTours();
    this.loadParticipations();
    this.loadGroupTours();
    this.route.queryParams.subscribe(params => {
      this.refundId = params['refundId'] ? Number(params['refundId']) : null;
      console.log('Captured refundId:', this.refundId);

      if (this.refundId) {
        this.fetchRefundedTour(this.refundId); // Fetch the refunded tour
      }
    });
  }

  togglePopup(tourId?: number): void {
    console.log(tourId);
    if (tourId !== undefined) {
      this.visiblePopupId = this.visiblePopupId === tourId ? null : tourId;
    }
    else{
      this.visiblePopupId = null;
    }
  }

  onMouseEnter(tourId?: number): void {
    if (tourId !== undefined) {
    this.visiblePopupId = tourId;
    }
  }

  onMouseLeave(): void {
    this.visiblePopupId = null;
  }

  loadParticipations(): void {
    this.service.getAllParticipations().subscribe({
      next: (results: PagedResults<GroupTourExecution>) => {
        this.participations = results.results; 
        console.log(this.participations);
        console.log("Participations:", this.participations); 
        console.log(this.user.id);
        this.disabledGroupTourParticipation = this.participations.some(participation => participation.touristId === this.user.id);
        console.log('da li je ili nije', this.disabledGroupTourParticipation);
      },
      error: () => {
        console.log("ERROR LOADING PARTICIPATIONS");
      }
    });
  }

  loadGroupTours(): void {
    this.service.getAllGroupTours().subscribe({
      next: (results: PagedResults<GroupTour>) => {
        this.groupTours = results.results; 
      },
      error: () => {
        console.log("ERROR LOADING PARTICIPATIONS");
      }
    });
  }

  getDateAndTime(t: any): Date | null {
    const groupTour = this.groupTours.find(tour => tour.id === t.id);
    if(groupTour !== undefined){
      return groupTour.startTime;
    }
    return null;
  }

  TourParticipation(tourId?: number): boolean {
    if(tourId != undefined) {
      return this.participations.some(participation => 
        participation.touristId === this.user.id && participation.groupTourId === tourId
    );
    }
   return false;
}

  hasAlreadyParticipated(tourId?: number): boolean {
    console.log(this.participations);
    if(tourId != undefined) {
      return this.participations.some(participation => 
        participation.touristId === this.user.id && participation.groupTourId === tourId && participation.isFinished == true
    );
    }
  return false;
  }


  groupTourStatus(tourId?: number): boolean {
    const groupTour = this.groupTours.find(tour => tour.id === tourId);
    if (groupTour !== undefined && groupTour.startTime) {
      const currentTime = new Date(); 
      const tourStartTime = new Date(groupTour.startTime); 
      return tourStartTime > currentTime; 
    }
    return false; 
  }

  groupTourProgress(tourId?: number): boolean {
    const groupTour = this.groupTours.find(tour => tour.id === tourId);
    if (groupTour !== undefined) {
      return groupTour.progress === 0; 
    }
    return false; 
  }

  getProgressStatus(tourId?: number): string {
    const groupTour = this.groupTours.find(tour => tour.id === tourId);
    if (groupTour !== undefined) {
      return this.getProgressLabel(groupTour.progress); 
    }
    return '';
  }

  getProgressLabel(progress: number): string {
    switch (progress) {
      case 0:
        return 'Scheduled';
      case 1:
        return 'In progress';
      case 2:
        return 'Finished';
      default:
        return 'Canceled';
    }
  }

cancelParticipation(tourId?: number): void {
  const groupTour = this.groupTours.find(tour => tour.id === tourId);
  if (groupTour) {
    const currentTime = new Date();
    const startTime = new Date(groupTour.startTime);
    const timeDifference = startTime.getTime() - currentTime.getTime();
  
    console.log(startTime);
    console.log(timeDifference);
    if (timeDifference > 24 * 60 * 60 * 1000) {
      console.log("Start time is more than 24 hours ago.");
      if(tourId != undefined) {
        this.service.cancelParticipation(this.user.id, tourId)
          .subscribe({
            next: (response: any) => {
              console.log('Successfully canceled the group tour:', response);
              this.loadParticipations();
            },
            error: (error: any) => {
              console.error('Error canceling the group tour:', error);
            }
          });
      }

    } else {
      alert("Start time of this tour is within 24 hours. Canceling is forbidden!");
    }
  } else {
    console.log("Tour not found.");
  }
  
}

  checkPopupPosition() {
    if (this.popup && this.popupParent) {
      const popupElement = this.popup.nativeElement;
      const parentElement = this.popupParent.nativeElement;
      const parentRect = parentElement.getBoundingClientRect();
      const popupRect = popupElement.getBoundingClientRect();

      // Proveravamo da li popup izlazi izvan roditeljskog elementa
      if (popupRect.bottom > parentRect.bottom || popupRect.top < parentRect.top) {
        this.visiblePopupId = null; // Sakrij popup ako izlazi izvan okvira
      }
    }
  }

  loadSalesData(): void {
    // Fetch sales data
    this.saleService.getSales().subscribe({
      next: ( results: PagedResults<Sale> ) => {
          this.sales =results.results
          console.log("Sales:", this.sales); 
      },
      error: () => {
          console.log("ERROR LOADING SALES");
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

  searchTours():void{
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
        this.snackBar.open('Failed to fetch refunded tour ID.', 'Close', {
          duration: 3000,
          panelClass: 'error'
        });
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
  
  participateInGroupTour(tourId: number) {
    const groupTourExecution: GroupTourExecution = {
      groupTourId: tourId,
      touristId: this.user.id,  
      isFinished: false
    };
  
    console.log(groupTourExecution);
    this.service.groupTourParticipate(groupTourExecution)
      .subscribe({
        next: (response) => {
          console.log('Successfully joined the group tour:', response);
          this.loadParticipations();
        },
        error: (error) => {
          console.error('Error joining the group tour:', error);
        }
      });
  }
  


}
