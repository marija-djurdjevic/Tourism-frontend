import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourReview } from '../model/tour-review.model';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent implements OnInit{

  entities :  TourReview[] = []; 

  constructor(private service: TourExecutionService) {}
   

  ngOnInit(): void {
    this.service.getReviews().subscribe({
      next:(result: PagedResults<TourReview>) => {
        this.entities = result.results;
      },
      error: (err:any) => {                                   
        console.log(err)
      }
  })
  }
}
