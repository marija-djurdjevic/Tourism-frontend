import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';
import {DatePipe} from '@angular/common';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';




@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css'],
  providers: [DatePipe]
})
export class TourReviewFormComponent {

  user: User | undefined;
  feedbackMessage: string | null = null;

  @Output() tourReviewUpdated = new EventEmitter<null>();
  constructor(private service: TourExecutionService, private datePipe: DatePipe, private authService: AuthService,  private tokenStorage: TokenStorage) {}

  tourReviewForm = new FormGroup({
    tourId: new FormControl('', [Validators.required]),
    userId: new FormControl(''),
    username: new FormControl(''),
    grade : new FormControl('', [Validators.required]),
    comment : new FormControl('', [Validators.required]),
    images : new FormControl('', [Validators.required]),
    visitDate: new FormControl('', [Validators.required])
  })

  addTourReview() : void {

   const accessToken = this.tokenStorage.getAccessToken();
   const jwtHelperService = new JwtHelperService();
   if(accessToken){
    
      const decodedToken = jwtHelperService.decodeToken(accessToken);

      const tourReview: TourReview = {
        tourId: Number(this.tourReviewForm.value.tourId) || 0,
        userId: +jwtHelperService.decodeToken(accessToken).id || 0,
        username: jwtHelperService.decodeToken(accessToken).username || "",
        grade: Number(this.tourReviewForm.value.grade) || 1,
        comment: this.tourReviewForm.value.comment || "",
        images: this.tourReviewForm.value.images || "", 
        tourVisitDate:  new Date(this.tourReviewForm.value.visitDate || Date.now()),
        tourReviewDate: new Date(Date.now())
      
      };
      
      this.service.addTourReview(tourReview).subscribe({
        next: () => {
          this.feedbackMessage = '';
          alert('Tour review added successfully');
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
    } else {
      console.error('No access token found');
    }
   
  }

}
