import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout.service';
import { UserRating } from '../model/user-rating.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.css']
})
export class UserRatingComponent {
  
  user: User

  constructor(private service : LayoutService, private authService : AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
     this.user = user;
   });
  }

  ratingForm = new FormGroup({
    rating: new FormControl('', [Validators.required]),
    comment: new FormControl('')
  })

  submitRating() : void{
    console.log(this.ratingForm.value)
    
    const rating : UserRating = {
      rating: Number(this.ratingForm.value.rating),
      comment: this.ratingForm.value.comment || "",
      createdAt: new Date(),
      userId: 0
    }

    this.service.submitRating(rating, this.user.role).subscribe({
      next: (_) => {
          console.log("Success");
          alert("Rating submitted!");
          this.ratingForm.reset();
      }
    });
  }

  
}
