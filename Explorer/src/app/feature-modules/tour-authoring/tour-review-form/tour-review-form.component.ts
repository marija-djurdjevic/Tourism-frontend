import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { TourReview } from '../model/tour-review.model';
import { DatePipe, Location } from '@angular/common';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ImageService } from 'src/app/shared/image.service';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css'],
  providers: [DatePipe]
})
export class TourReviewFormComponent {

  imageId: Number;
  selectedFile: File[];
  previewImage: string | null = null
  user: User | undefined;
  feedbackMessage: string | null = null;
  tourId: number | null = null;
  tourName: string | null = "ime";

  @Output() tourReviewUpdated = new EventEmitter<null>();

  constructor(private route: ActivatedRoute, private location: Location, private service: TourExecutionService, private imageService: ImageService, private datePipe: DatePipe, private authService: AuthService, private tokenStorage: TokenStorage) {
    imageService.setControllerPath("tourist/image");
  }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId'));
    this.tourName = this.route.snapshot.paramMap.get('tourName');
  }

  tourReviewForm = new FormGroup({
    grade: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  })

  /*Dio 1 za upload slika*/
  onFileSelected(file: File[]): void {
    this.selectedFile = file;  // Čuvanje fajla kada ga child komponenta emituje
    console.log('Selected file:', this.selectedFile);
  }
  /*Kraj*/

  addTourReview(): void {

    const accessToken = this.tokenStorage.getAccessToken();
    const jwtHelperService = new JwtHelperService();
    if (accessToken) {

      const decodedToken = jwtHelperService.decodeToken(accessToken);

      const tourReview: TourReview = {
        tourId: this.tourId || 0,
        userId: 0,
        username: jwtHelperService.decodeToken(accessToken).username || "",
        grade: Number(this.tourReviewForm.value.grade) || 1,
        comment: this.tourReviewForm.value.comment || "",
        images: "",
        tourVisitDate: new Date(Date.now()),
        tourReviewDate: new Date(Date.now()),
        tourProgressPercentage: 0
      };
      /*----------------Dio 2 za upload slike---------------*/
      let processedFilesCount = 0;
      if (!this.selectedFile) {
        this.SaveReview(tourReview)
      } else {
        const totalFiles = this.selectedFile.length;
        for (const file of this.selectedFile) {
          this.imageService.uploadImage(file).subscribe((imageId: number) => {
            this.imageService.getImage(imageId);
            if (tourReview.images === "") {
              tourReview.images = tourReview.images + imageId;
            }
            else {
              tourReview.images = tourReview.images + ',' + imageId;
            }
            processedFilesCount++;

            // Proveravamo da li smo obradili sve fajlove
            if (processedFilesCount === totalFiles) {
              this.SaveReview(tourReview);  // Pozivamo funkciju kad je sve završeno
            }
          });

        }
        /*---------------------Kraj------------------------*/

      }

    } else {
      console.error('No access token found');
    }
  }

  SaveReview(tourReview: TourReview): void {
    this.service.addTourReview(tourReview).subscribe({
      next: () => {
        this.feedbackMessage = '';
        alert('Tour review added successfully');
        this.location.back();
        this.tourReviewUpdated.emit();
      },
      error: (error) => {

        let errorMessage = 'An error occurred while adding the tour review.';


        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        this.feedbackMessage = errorMessage;
      }
    });
  }

}

