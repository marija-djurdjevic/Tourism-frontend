import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { TourReview } from '../model/tour-review.model';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css'],
  providers: [DatePipe]
})
export class TourReviewFormComponent {

  @Output() tourReviewUpdated = new EventEmitter<null>();
  constructor(private service: TourExecutionService, private datePipe: DatePipe) {}

  tourReviewForm = new FormGroup({
    grade : new FormControl('', [Validators.required]),
    comment : new FormControl('', [Validators.required]),
    images : new FormControl('', [Validators.required]),
    visitDate: new FormControl('', [Validators.required])
  })

  addTourReview() : void {

  //  const visitDate: string | null = this.tourReviewForm.value.visitDate || null; // Default to null if undefined
   // const formattedVisitDate = this.getFormattedDate(visitDate);

    const tourReview: TourReview = {
      grade: Number(this.tourReviewForm.value.grade) || 1,
      comment: this.tourReviewForm.value.comment || "",
      images: this.tourReviewForm.value.images || "", 
      tourVisitDate:  new Date(this.tourReviewForm.value.visitDate || Date.now()),
      tourReviewDate: new Date(Date.now())
     
    };
      
    this.service.addTourReview(tourReview).subscribe({
      next: () => {
        this.tourReviewUpdated.emit();
      }
    
    });
  }

}
