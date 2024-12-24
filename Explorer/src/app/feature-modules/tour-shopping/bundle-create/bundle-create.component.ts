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
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

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
        private notificationService: NotificationService,
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
                this.notificationService.notify({ message:'Failed to load tours. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
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
            this.notificationService.notify({ message:'The new price must be lower than the total price.', duration: 3000, notificationType: NotificationType.WARNING });
            return;
        }

        if (!this.newTitle) {
            this.notificationService.notify({ message:'Please enter a title.', duration: 3000, notificationType: NotificationType.WARNING });
            return;
        }

        if (this.selectedTours.length < 2) {
            this.notificationService.notify({ message:'Please select at least two tours.', duration: 3000, notificationType: NotificationType.WARNING });
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
                this.notificationService.notify({ message:'Bundle created successfully!',duration: 3000, notificationType: NotificationType.SUCCESS });
                this.router.navigate(['/bundles']);
            },
            error: () => {
                this.notificationService.notify({ message:'Failed to add bundle. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
            }
        });

        this.selectedTours = [];
        this.newPrice = 0;
        this.calculateTotalPrice();
    }
}
