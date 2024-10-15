import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout.service';
import { UserRating } from '../model/user-rating.model';

@Component({
  selector: 'xp-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.css']
})
export class UserRatingComponent {
  
  constructor(private service : LayoutService) {}

  ratingForm = new FormGroup({
    rating: new FormControl('', [Validators.required]),
    comment: new FormControl('')
  })

  submitRating() : void{
    console.log(this.ratingForm.value)
    
    const rating : UserRating = {
      rating: Number(this.ratingForm.value.rating),
      comment: this.ratingForm.value.comment || ""
    }

    this.service.submitRating(rating).subscribe({
      next: (_) => {
          console.log("Success")
      }
    });
  }

  
}
