import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coupon } from '../../tour-shopping/model/coupon.model';
import { TourShoppingService } from '../../tour-shopping/tour-shopping.service';
import { GroupTour } from '../model/group-tour.model';
import { MatDialog } from '@angular/material/dialog';
import { GroupTourDetailsDialogComponent } from '../group-tour-details-dialog/group-tour-details-dialog.component';


@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  tours: Tour[] = [];
  groupTours: GroupTour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  isLoading=false;
  coupons: Coupon[] = [];
  isCouponModalOpen = false;
  isToursClicked = true;
  isGroupToursClicked = false;

  // Controls visibility of the coupon form
isCouponFormVisible: boolean = false;
editMode: boolean = false; // Determines whether the form is in edit mode
currentCouponId: number | null = null; // Holds the ID of the coupon being edited

// Model for new coupon data
newCoupon: {
  discount: number | null;
  discountedTourId: number | null;
  expiryDate: string | null;
  allDiscounted: boolean;
} = {
  discount: null,
  discountedTourId: null,
  expiryDate: null,
  allDiscounted: false,
};

  constructor(private service: TourAuthoringService,private snackBar:MatSnackBar, private router: Router, private authService: AuthService,
    private shoppingService: TourShoppingService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTours();
    this.getGroupTours();
  }

  openDialog(groupTourId: number): void {
    console.log('Otvaranje dijaloga za grupnu turu sa ID:', groupTourId);
    const dialogRef = this.dialog.open(GroupTourDetailsDialogComponent, {
      width: '800px',
      height: '600px',
      data: { groupTourId }, // Prosleđeni podaci
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('Dijalog zatvoren');
      this.getGroupTours();
    });
  }
  
  getProgressClass(progress: number): string {
    switch (progress) {
      case 0:
        return 'scheduled';
      case 1:
        return 'in-progress';
      case 2:
        return 'finished';
      case 3:
        return 'canceled';
      default:
        return '';
    }
  }
  

  onAddGroupTour(): void {
    this.router.navigate(['/add-group-tour']);
  }

  getTours(): void {
    this.isLoading=true;
    this.authService.user$.subscribe((loggedInUser) => {
      if (loggedInUser && loggedInUser.role === 'author') {
        this.service.getToursByAuthorId(loggedInUser.id).subscribe({
          next: (result: PagedResults<Tour>) => {
            console.log(result);
            this.tours = result.results;
            console.log('toursssss');
            console.log(this.tours);
            this.isLoading=false;
          },
          error: () => {
            this.isLoading=false;
            this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
          }
        });
      } else {
        this.service.getTours().subscribe({
          next: (result: PagedResults<Tour>) => {
            this.tours = result.results;
            this.isLoading=false;
          },
          error: () => {
            this.isLoading=false;
            this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
          }
        });
      }
    });
  }

  getGroupTours(): void {
    this.isLoading = true;
    console.log("grupneee");
    this.authService.user$.subscribe((loggedInUser) => {
      if (loggedInUser && loggedInUser.role === 'author') {
        console.log("usaosoaoaoaooaa");
        this.service.getAllGroupTours().subscribe({
          next: (result: PagedResults<GroupTour>) => {
            // Filtriramo ture na osnovu authorId
            this.groupTours = result.results.filter(tour => tour.authorId === loggedInUser.id);
            console.log("usao ovdje glupan glupi");
            console.log(this.groupTours);
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
              duration: 3000,
              panelClass: 'succesful'
            });
          }
        });
      } else {
        // Ako nije 'author', učitavamo sve ture bez filtriranja
        this.service.getAllGroupTours().subscribe({
          next: (result: PagedResults<GroupTour>) => {
            this.groupTours = result.results;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
            this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
              duration: 3000,
              panelClass: 'succesful'
            });
          }
        });
      }
    });
  }
  

  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Medium';
      case 2:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Archived';
      default:
        return 'Unknown';
    }
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
  
  onAddClicked(): void {
    this.router.navigate(['/add-tour']);
  }

  onAddKeyPoint(tourId: number) {
    this.router.navigate(['/key-points-form', tourId]); 
  }

  onShowKeyPoints(tourId: number) {
    this.router.navigate(['/key-points', tourId]); 
  }


  onPublish(tour: Tour): void {
    this.service.publishTour(tour).subscribe({

      next: (result: Tour) => {
        console.log('Tour published successfully:', result);
        this.getTours(); 
        this.getGroupTours();
        this.snackBar.open('Tour published successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error publishing tour:', err);
        this.snackBar.open('Failed to publish tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  onArchive(tour: Tour) {
    this.service.archiveTour(tour).subscribe({
      next: (result: Tour) => {
        console.log('Tour published successfully:', result);
        this.getTours(); 
        this.getGroupTours();
        this.snackBar.open('Tour archived successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error publishing tour:', err);
        this.snackBar.open('Failed to publish tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  onEdit(tour: Tour) {
    this.shouldEdit = true;
    this.selectedTour = tour;
    this.router.navigate(['/add-tour'], {
      queryParams: {
        tour: JSON.stringify({
          id: tour.id,
          name: tour.name,
          description: tour.description, 
          difficulty: tour.difficulty,
          tags: tour.tags,
          status: tour.status,
          price: tour.price,
          publishedAt: tour.publishedAt,
          archivedAt: tour.archivedAt,
          avarageScore: tour.averageScore,
          authorId: tour.authorId,
          transportInfo: tour.transportInfo,
          keyPoints: tour.keyPoints,
          reviews: tour.reviews,
          reviewStatus: tour.reviewStatus
        })
      }
    })
  }

  onEditGroup(tour: GroupTour) {
    this.shouldEdit = true;
    this.selectedTour = tour;
    this.router.navigate(['/add-group-tour'], {
      queryParams: {
        tour: JSON.stringify({
          id: tour.id,
          name: tour.name,
          description: tour.description, 
          difficulty: tour.difficulty,
          tags: tour.tags,
          status: tour.status,
          price: tour.price,
          publishedAt: tour.publishedAt,
          archivedAt: tour.archivedAt,
          avarageScore: tour.averageScore,
          authorId: tour.authorId,
          transportInfo: tour.transportInfo,
          keyPoints: tour.keyPoints,
          reviews: tour.reviews,
          reviewStatus: tour.reviewStatus,
          progress: tour.progress,
          startTime: tour.startTime,
          duration: tour.duration,
          touristNumber: tour.touristNumber
        })
      }
    })
  }

  onCouponsClicked(): void {
    this.isCouponModalOpen = true;
    this.loadCoupons();
  }

  loadCoupons(){
    this.authService.user$.subscribe((loggedInUser) => {
      if (loggedInUser && loggedInUser.role === 'author') {
    this.shoppingService.getCouponsByAuthorId(loggedInUser.id).subscribe({
      next: (response) => {
        // Assuming PagedResults has a `results` array with the tourists
        //this.coupons = response;
        this.coupons = response.map((coupon) => ({
          ...coupon,
          // Map discountedTourId to tour name using the tours list
          tourName: this.tours.find((tour) => tour.id === coupon.discountedTourId)?.name || "N/A",
        }));
        console.log(this.coupons)
      },
      error: (err) => {
        console.error('Failed to load tourists:', err);
        alert('There was an error loading the tourists list. Please try again later.');
      }
    });
  }
  });
  }

  closeCouponModal(): void {
    this.isCouponModalOpen = false;
  }

  updateCoupon(): void {
    if (!this.newCoupon.allDiscounted && (!this.newCoupon.discountedTourId || this.newCoupon.discountedTourId===-999)) {
      alert("Please select a tour or mark 'All Tours' as discounted.");
      return; // Prevent submission
    }

    if (!this.currentCouponId) {
      console.error("No coupon selected for update.");
      return;
    }
  
    // Find the existing coupon by ID to retain immutable fields
    const existingCoupon = this.coupons.find(c => c.id === this.currentCouponId);
  
    if (!existingCoupon) {
      console.error("Coupon not found.");
      return;
    }
  
    // Construct the updated coupon
    const updatedCoupon: Coupon = {
      ...existingCoupon, // Retain immutable fields like id, code, and authorId
      discount: this.newCoupon.discount!,
      discountedTourId: this.newCoupon.discountedTourId!,
      expiryDate: this.newCoupon.expiryDate!,
      allDiscounted: this.newCoupon.allDiscounted,
    };
  
    // Call the service to update the coupon
    this.shoppingService.updateCoupon(updatedCoupon).subscribe(
      (response) => {
        // Update the local coupons list with the updated coupon
        const index = this.coupons.findIndex(c => c.id === this.currentCouponId);
        if (index !== -1) this.coupons[index] = response;
        this.resetEditForm();
        this.loadCoupons();
      },
      (error) => {
        console.error('Error updating coupon:', error);
      }
    );
  }

  resetEditForm(): void {
    this.editMode = false;
    this.currentCouponId = null;
    this.isCouponFormVisible = false;
    this.newCoupon = {
      discount: null,
      discountedTourId: null,
      expiryDate: null,
      allDiscounted: false,
    };
  }

  onEditClicked(coupon: Coupon): void {
    this.editMode = true;
    this.isCouponFormVisible = true;
    this.currentCouponId = coupon.id;
  
    // Populate form fields with existing data
    this.newCoupon = {
      discount: coupon.discount,
      discountedTourId: coupon.discountedTourId,
      expiryDate: coupon.expiryDate ? coupon.expiryDate.toString().split('T')[0] : null,
      allDiscounted: coupon.allDiscounted,
    };
  }

  deleteCoupon(id: number){
    this.shoppingService.deleteCoupon(id).subscribe(() => {
      this.coupons = this.coupons.filter((coupon) => coupon.id !== id);
    });
  }

  toggleCouponForm(): void {
    this.isCouponFormVisible = !this.isCouponFormVisible;
    if(!this.isCouponFormVisible){
      this.resetEditForm()
    }
  }

  createCoupon(): void {
    if (!this.newCoupon.allDiscounted && !this.newCoupon.discountedTourId) {
      alert("Please select a tour or mark 'All Tours' as discounted.");
      return; // Prevent submission
    }
    // Map the form values to the `Coupon` object for submission
    const coupon : Omit<Coupon,  'id' >= {
      discountedTourId: this.newCoupon.allDiscounted ? -999 : this.newCoupon.discountedTourId!,
      tourName: this.tours.find(tour => tour.id === this.newCoupon.discountedTourId)?.name || '',
      //expiryDate: this.newCoupon.expiryDate ? new Date(this.newCoupon.expiryDate) : new Date("2199-12-31"), // Convert string to Date
      //expiryDate: this.newCoupon.expiryDate
    //? this.newCoupon.expiryDate.split('T')[0] : "2199-12-31", // Create a Date object from the date part
      // Use a Date object for the fallback value
      expiryDate: this.newCoupon.expiryDate
    ? new Date(this.newCoupon.expiryDate).toISOString().split('T')[0]  // Format as 'YYYY-MM-DD'
    : "2199-12-31",
    //expiryDate: this.newCoupon.expiryDate
    //? new Date(this.newCoupon.expiryDate.split('T')[0])  // Parse only the date portion to a Date object
    //: new Date("2199-12-31"),
    allDiscounted: this.newCoupon.allDiscounted,
      discount: this.newCoupon.discount!,
      code: "dummycode123",
      authorId: 0
    };
  
    // Call the service method to create the coupon
    this.shoppingService.createCoupon(coupon as Coupon).subscribe({
      next: (createdCoupon) => {
        console.log('Coupon created:', createdCoupon);
        // Refresh the list or reset form as needed
        this.coupons.push(createdCoupon);
        this.resetCouponForm();
        this.loadCoupons();
      },
      error: (error) => {
        console.error('Failed to create coupon:', error);
      }
    });

    //this.loadCoupons();
  }
  
  // Reset the form for creating a new coupon
  resetCouponForm(): void {
    this.newCoupon = {
      discount: 0,
      discountedTourId: null,
      expiryDate: null,
      allDiscounted: false
    };
    this.isCouponFormVisible = false;
  }
  
  onGroupTours() {
    this.isGroupToursClicked = true;
    this.isToursClicked = false;
  }

  onTours() {
    this.isGroupToursClicked = false;
    this.isToursClicked = true;
  }


}
