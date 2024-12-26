import { Component, OnInit } from "@angular/core";
import { Bundle } from "../model/bundle.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { BundleService } from "../bundle.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { TourShoppingService } from "../tour-shopping.service";
import { PaymentRecord } from "../model/payment-record.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { NotificationService } from "src/app/shared/notification.service";
import { NotificationType } from "src/app/shared/model/notificationType.enum";

@Component({
    selector: 'xp-bundles',
    templateUrl: './explore-bundles.component.html',
    styleUrls: ['./explore-bundles.component.css']
})
export class ExploreBundlesComponent implements OnInit {

    bundles: Bundle[] = [];
    isLoading = false;
    user: User;
    purchasedBundles: Bundle[] = [];
    paymentRecord: PaymentRecord;
    constructor(
        private bundleService: BundleService,
        private notificationService: NotificationService,
        private authService: AuthService,
        private router: Router,
        private shoppingService: TourShoppingService,
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.getBundles();
            this.getPurchasedBundles();
        });
        console.log(this.user)
    }

    getBundles(): void {
        this.isLoading = true;
        this.bundleService.getAllBundles().subscribe({
            next: (result: PagedResults<Bundle>) => {
                this.bundles = result.results.filter(bundle => bundle.status === 1);
                this.isLoading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.isLoading = false;
                this.notificationService.notify({ message: 'Failed to load bundles. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
            }
        });
    }

    getPurchasedBundles(): void {
        this.isLoading = true;
        if (this.user.role == 'tourist') {
            this.shoppingService.getPurchasedBundles(this.user.id).subscribe({
                next: (result: any) => { // from any you can get .values
                    if (result && result.value) {
                        this.purchasedBundles = result.value as Bundle[];  // extract the 'value' array and cast it
                    } else {
                    }
                    console.log("Purchased bundles not loaded properly: ", this.purchaseBundle);
                    this.notificationService.notify({ message: 'Purchased bundles not loaded properly. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
                    this.isLoading = false;
                },
                error: (err: any) => {
                    console.log(err);
                    this.isLoading = false;
                    this.notificationService.notify({ message: 'Failed to load purchased bundles. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
                }
            });
        }
    }

    isPurchased(bundleId: number): boolean {
        console.log("Checking if purchased bundle ID:", bundleId);
        console.log("Purchased bundles:", this.purchasedBundles);
        return this.purchasedBundles.some(bundle => bundle.id === bundleId);
    }

    purchaseBundle(bundle: Bundle): void {
        this.isLoading = true;
        this.shoppingService.purchaseBundle(bundle, this.user.id).subscribe({
            next: (result: any) => {
                this.paymentRecord = result.value;
                this.isLoading = false;
                alert("Payment recorded: \nbundle: " + this.paymentRecord.bundleId
                    + "\nprice: " + this.paymentRecord.price)
                this.notificationService.notify({ message: "Payment recorded: \nbundle: " + this.paymentRecord.bundleId + "\nprice: " + this.paymentRecord.price, duration: 3000, notificationType: NotificationType.INFO });
            },
            error: (err: any) => {
                console.log(err);
                this.isLoading = false;
                this.notificationService.notify({ message: 'Failed to buy a bundle. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
            }
        });
    }

    viewTours(bundle: Bundle): void {
        this.router.navigate(['/bundle/' + bundle.id + '/author/' + bundle.authorId]);
    }

}
