import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from '../model/tour-review.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit{

  
  tourReview :  TourReview[] = []; 

  constructor(private service: TourExecutionService) {}
   

  ngOnInit(): void {
    this.service.getReviews(0,0).subscribe({
      next:(result: PagedResults<TourReview>) => {
        this.tourReview = result.results;
      },
      error: (err:any) => {                                   
        console.log(err)
      }
  })
  }

  getReviews(): void {
    this.service.getReviews(0,0).subscribe({
      next: (result: PagedResults<TourReview>) => {
        this.tourReview = result.results;
      },
      error: () => {
      }
    })
  }

}
