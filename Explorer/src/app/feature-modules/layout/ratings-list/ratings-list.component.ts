import { Component, OnInit } from '@angular/core';
import { UserRating } from '../model/user-rating.model';
import { LayoutService } from '../layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-ratings-list',
  templateUrl: './ratings-list.component.html',
  styleUrls: ['./ratings-list.component.css']
})
export class RatingsListComponent implements OnInit {
  ratings: UserRating[] = [];

  constructor(private service: LayoutService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.service.getRatings().subscribe({
      next: (result: Array<UserRating>) => {
        this.ratings = result;
        console.log(result);        
      },
      error: (err : any) => {
        console.log(err)
      }
    });
  }
}
