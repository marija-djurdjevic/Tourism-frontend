import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout.service';
import { UserRating } from '../model/user-rating.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.css']
})
export class UserRatingComponent {

  user: User

  constructor(private service: LayoutService,
    private authService: AuthService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ratingForm = new FormGroup({
    rating: new FormControl('', [Validators.required]),
    comment: new FormControl('')
  })

  submitRating(): void {
    console.log(this.ratingForm.value)

    const rating: UserRating = {
      rating: Number(this.ratingForm.value.rating),
      comment: this.ratingForm.value.comment || "",
      createdAt: new Date(),
      userId: 0
    }

    this.service.submitRating(rating, this.user.role).subscribe({
      next: (_) => {
        console.log("Success");
        console.log("Rating submitted!");
        this.ratingForm.reset();
        this.notificationService.notify({ message:'Rating submitted successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to load data. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }


}
