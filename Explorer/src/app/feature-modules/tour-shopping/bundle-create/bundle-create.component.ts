import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Bundle } from '../model/bundle.model';
import { BundleService } from '../bundle.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
    selector: 'bundle-create',
    templateUrl: './bundle-create.component.html',
    styleUrls: ['./bundle-create.component.css']
})
export class BundleCreateComponent implements OnInit {
    tours: Tour[] = [];
    selectedTours: Tour[] = [];
    totalPrice: number = 0;
    newPrice: number;
    isLoading = false;
    user: User;
    tokenStorage: any;

    constructor(
        private tourService: TourAuthoringService,
        private snackBar: MatSnackBar,
        private service: BundleService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.loadTours();
        });
    }

    // Load tours from the tourService
    loadTours(): void {
        this.tourService.getToursByAuthorId(this.user.id).subscribe({
            next: (result: PagedResults<Tour>) => {
                console.log(result);
                this.tours = result.results;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "succesful"
                });
            }
        });
    }

    // Toggle tour selection when checkbox is clicked
    toggleTourSelection(tour: Tour): void {
        const index = this.selectedTours.indexOf(tour);
        if (index === -1) {
            this.selectedTours.push(tour); // Add tour
        } else {
            this.selectedTours.splice(index, 1); // Remove tour
        }
        this.calculateTotalPrice(); // Update total price
    }

    // Calculate the total price of selected tours
    calculateTotalPrice(): void {
        this.totalPrice = this.selectedTours.reduce((sum, tour) => sum + tour.price, 0);
    }

    // Create the bundle with the selected tours and new price
    createBundle(): void {
        if (!this.newPrice) {
            this.snackBar.open('Please enter a valid new price.', 'Close', { duration: 3000 });
            return;
        }

        const tourIds = this.selectedTours.map(tour => tour.id!);

        const newBundle: Bundle = {
            authorId: this.user.id,
            tourIds: tourIds,
            price: this.newPrice,
            status: 0
        };
        this.service.createBundle(newBundle).subscribe({
            next: () => {
                this.snackBar.open('Bundle created successfully!', 'Close', { duration: 3000 });
            },
            error: () => {
                this.snackBar.open('Failed to add bundle. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "succesful"
                });
            }
        });


        // Reset state
        this.selectedTours = [];
        this.newPrice = 0;
        this.calculateTotalPrice();
    }
}
