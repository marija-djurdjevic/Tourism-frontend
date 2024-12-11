import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Bundle } from '../model/bundle.model';
import { BundleService } from '../bundle.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

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
    newTitle: string;
    isLoading = true;
    user: User;

    constructor(
        private tourService: TourAuthoringService,
        private snackBar: MatSnackBar,
        private service: BundleService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.loadTours();
        });
    }

    loadTours(): void {
        this.tourService.getToursByAuthorId(this.user.id).subscribe({
            next: (result: PagedResults<Tour>) => {
                this.tours = result.results;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "error"
                });
            }
        });
    }

    toggleTourSelection(tour: Tour): void {
        const index = this.selectedTours.indexOf(tour);
        if (index === -1) {
            this.selectedTours.push(tour);
        } else {
            this.selectedTours.splice(index, 1);
        }
        this.calculateTotalPrice();
    }

    calculateTotalPrice(): void {
        this.totalPrice = this.selectedTours.reduce((sum, tour) => sum + tour.price, 0);
    }

    createBundle(): void {
        if (!this.newPrice || this.newPrice >= this.totalPrice) {
            this.snackBar.open('The new price must be lower than the total price.', 'Close', {
                duration: 3000,
                panelClass: "error"
            });
            return;
        }

        if (!this.newTitle) {
            this.snackBar.open('Please enter a title.', 'Close', { duration: 3000 });
            return;
        }

        if (this.selectedTours.length < 2) {
            this.snackBar.open('Please select at least two tours.', 'Close', { duration: 3000 });
            return;
        }

        const tourIds = this.selectedTours.map(tour => tour.id!);
        const newBundle: Bundle = {
            authorId: this.user.id,
            tourIds: tourIds,
            price: this.newPrice,
            status: 0,
            title: this.newTitle,
        };

        this.service.createBundle(newBundle).subscribe({
            next: () => {
                this.snackBar.open('Bundle created successfully!', 'Close', { duration: 3000 });
                this.router.navigate(['/bundles']);
            },
            error: () => {
                this.snackBar.open('Failed to add bundle. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "error"
                });
            }
        });

        this.selectedTours = [];
        this.newPrice = 0;
        this.calculateTotalPrice();
    }
}
