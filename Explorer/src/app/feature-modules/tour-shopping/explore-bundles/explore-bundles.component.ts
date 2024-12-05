import { Component, OnInit } from "@angular/core";
import { Bundle } from "../model/bundle.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { BundleService } from "../bundle.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { Router } from "@angular/router";
import { Tour } from "../../tour-authoring/model/tour.model";
import { TourShoppingService } from "../tour-shopping.service";
import { PaymentRecord } from "../model/payment-record.model";
import { PagedResults } from "src/app/shared/model/paged-results.model";

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
        private bundleService: BundleService,  // Assuming you have a bundleService for bundles
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private router: Router,
        private shoppingService: TourShoppingService
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;
            this.getBundles();
            this.getPurchasedBundles();
        });
        console.log(this.user)
    }

    // Fetch bundles for the author
    getBundles(): void {
        this.isLoading = true;
        this.bundleService.getAllBundles().subscribe({
            next: (result: PagedResults<Bundle>) => {
                this.bundles = result.results;
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

    getPurchasedBundles(): void {
        this.isLoading = true;
        this.shoppingService.getPurchasedBundles(this.user.id).subscribe({
            next: (result: any) => {
                if (result && result.value) {
                    this.purchasedBundles = result.value as Bundle[];  // Extract the 'value' array and cast it
                } else {
                }
                console.log("Purchased bundles not loaded properly: ", this.purchaseBundle);
                this.isLoading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.isLoading = false;
                this.snackBar.open('Failed to load purchased bundles. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "succesful"
                });
            }
        });
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
                    + "\nprice: " + this.paymentRecord.price
                )
            },
            error: (err: any) => {
                console.log(err);
                this.isLoading = false;
                this.snackBar.open('Failed to buy a bundle. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "succesful"
                });
            }
        });
    }

}
