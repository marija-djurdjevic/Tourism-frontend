import { Component, OnInit } from "@angular/core";
import { Bundle } from "../model/bundle.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { BundleService } from "../bundle.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'xp-bundles',
    templateUrl: './bundle.component.html',
    styleUrls: ['./bundle.component.css']
})
export class BundleComponent implements OnInit {

    bundles: Bundle[] = [];
    isLoading = false;
    user: User;

    constructor(
        private service: BundleService,  // Assuming you have a service for bundles
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.getBundles();
        });
    }

    // Fetch bundles for the author
    getBundles(): void {
        this.isLoading = true;
        this.service.getAuthorBundles(this.user.id).subscribe({
            next: (result: Bundle[]) => {
                this.bundles = result;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.isLoading = false;
                this.snackBar.open('Failed to load bundles. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "succesful"
                });
            }
        });
    }

    // Route to the create new bundle page
    createNewBundle(): void {
        this.router.navigate(['/bundle-create']);
    }

    updateBundleStatus(bundle: any): void {
        let newStatus: number;

        if (bundle.status === 0) {
            //checkTourStatus();
            newStatus = 1;
        } else if (bundle.status === 1) {
            newStatus = 2;
        } else {
            return; // Don't update if the status is already 2
        }

        const updatedBundle = { ...bundle, status: newStatus };

        // Send the updated bundle to the backend
        this.service.updateBundleStatus(updatedBundle).subscribe({
            next: () => {
                this.snackBar.open('Bundle status updated successfully', 'Close', { duration: 3000 });
                bundle.status = newStatus; // Update the status locally
            },
            error: (err) => {
                console.error(err);
                this.snackBar.open('Failed to update bundle status', 'Close', { duration: 3000 });
            }
        });
    }

    // checkTourStatus(bundle: Bundle): boolean {
    //     let publishedCount = 0; // Counter for published tours
    //     let tourFetchCount = 0; // To keep track of how many tours have been fetched

    //     for (let tourId of bundle.tourIds) {
    //         this.tourService.getTourById(tourId).subscribe({
    //             next: (tour: any) => {
    //                 tourFetchCount++;

    //                 // Check if the tour is published
    //                 if (tour.status === 'published' || tour.status === 1) {
    //                     publishedCount++;
    //                 }

    //                 // If two published tours are found, update the bundle status and stop checking further
    //                 if (publishedCount >= 2) {
    //                     this.updateBundleStatus(bundle, 1); // Mark the bundle as published
    //                     return true;
    //                 }

    //                 // If all tours have been checked and there are not enough published tours
    //                 if (tourFetchCount === bundle.tourIds.length && publishedCount < 2) {
    //                     this.snackBar.open('You need at least 2 published tours to publish the bundle', 'Close', { duration: 3000 });
    //                     return false;
    //                 }
    //                 return false;
    //             },
    //             error: (err) => {
    //                 console.error(err);
    //                 this.snackBar.open('Failed to load tour', 'Close', { duration: 3000 });
    //             }
    //         });
    //     }
    //     return false;
    // }

    getButtonLabel(status: number): string {
        if (status === 0) {
            return 'Publish';
        } else if (status === 1) {
            return 'Archive';
        } else {
            return 'Archived'; // No action when the status is 2
        }
    }

    // Method to get status text
    getStatusText(status: number): string {
        switch (status) {
            case 0: return 'Draft';
            case 1: return 'Published';
            default: return 'Archived';
        }
    }

    viewTours(tourIds: number[]): void {
        //     // Option 1: Open a modal with tour details
        //     const dialogRef = this.dialog.open(TourListDialogComponent, {
        //       data: { tourIds: tourIds }
        //     });

        //     dialogRef.afterClosed().subscribe(result => {
        //       console.log('The dialog was closed');
        //     });

        //     // Option 2: Navigate to a tour details page
        //     // this.router.navigate(['/tour-details'], { queryParams: { tourIds: tourIds } });
        //   }
    }
}
