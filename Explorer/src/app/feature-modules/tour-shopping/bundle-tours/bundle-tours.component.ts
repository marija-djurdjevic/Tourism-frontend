import { Component, OnInit } from "@angular/core";
import { Tour } from "../../tour-authoring/model/tour.model";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ImageService } from "src/app/shared/image.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BundleService } from "../bundle.service";

@Component({
    selector: 'xp-bundle-tours',
    templateUrl: './bundle-tours.component.html',
    styleUrls: ['./bundle-tours.component.css']
})
export class BundleToursComponent implements OnInit {

    tours: Tour[] = [];
    showDiscountedOnly: boolean = false;
    isReviewsModalOpen = false;
    user: User;
    isLoading = false;
    bundleId: number;
    authorId: number;

    constructor(
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private service: BundleService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.bundleId = Number(params.get('bundleId'));
            this.authorId = Number(params.get('authorId'));
        });

        this.authService.user$.subscribe(user => {
            this.user = user;
            this.getTours();
        });
    };

    getTours(): void {
        this.isLoading = true;
        this.service.getBundleTours(this.authorId, this.bundleId).subscribe({
            next: (result: Tour[]) => {
                console.log("result", result)
                this.tours = result;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.log(err);
                this.isLoading = false;
                this.snackBar.open('Failed to load bundle tours. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: "succesful"
                });
            }
        });
    }
}