import { Component, OnInit } from '@angular/core';
import { UserRating } from '../model/user-rating.model';
import { LayoutService } from '../layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-ratings-list',
  templateUrl: './ratings-list.component.html',
  styleUrls: ['./ratings-list.component.css']
})
export class RatingsListComponent implements OnInit {
  ratings: UserRating[] = [];
  isLoading:boolean=false;
  constructor(private service: LayoutService,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.isLoading=true;
    this.service.getRatings().subscribe({
      next: (result: Array<UserRating>) => {
        this.ratings = result;
        console.log(result);
        this.isLoading=false;
      },
      error: (err : any) => {
        console.log(err)
        this.isLoading = false;
        this.snackBar.open('Failed to load ratings. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });   
      }
    });
  }
}
