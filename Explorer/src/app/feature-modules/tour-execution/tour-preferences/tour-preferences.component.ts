import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecutionService } from '../tour-execution.service';
import { TourPreferences } from 'src/app/shared/model/tour-preferences.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tour-preferences',
  templateUrl: './tour-preferences.component.html',
  styleUrls: ['./tour-preferences.component.css'],
})
export class TourPreferencesComponent implements OnInit {
  
  user: User | undefined;
  tourPreferences: TourPreferences;
  tourPreferencesForm: FormGroup;
  isLoading=false;

  constructor(private authService: AuthService, private service: TourExecutionService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.tourPreferencesForm = this.fb.group({
      id: [null],
      touristId: [null],
      difficulty: [null],
      walkingRating: [null],
      cyclingRating: [null],
      drivingRating: [null],
      sailingRating: [null],
      tags: ['']
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;

      this.tourPreferences = {
        id: 0, 
        touristId: this.user.id,
        walkingRating: 0, 
        cyclingRating: 0,
        drivingRating: 0,
        sailingRating: 0,
        tags: [] 
      };
      
      if (this.user && this.user.id) {
        this.tourPreferences.touristId = this.user.id;
        this.loadTourPreferences(this.user.id);
      }
    });
  }

  loadTourPreferences(touristId: number): void {
    this.isLoading=true;
    this.service.getTourPreferencesByTouristId(touristId).subscribe(
      data => {
        console.log('Tour Preferences:', data);
        this.tourPreferences = data;
        this.tourPreferencesForm.patchValue(data);
        this.isLoading=false;
      },
      error => {
        console.log('Error fetching tour preferences:', error);
        this.isLoading=false;
        this.snackBar.open('Failed to load preferences. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    );
  }

  onSubmit(): void {
    console.log('Form submitted:', this.tourPreferencesForm.value);

    this.tourPreferences.difficulty = Number(this.tourPreferencesForm.value.difficulty);
    this.tourPreferences.walkingRating = this.tourPreferencesForm.value.walkingRating;
    this.tourPreferences.cyclingRating = this.tourPreferencesForm.value.cyclingRating;
    this.tourPreferences.drivingRating = this.tourPreferencesForm.value.drivingRating;
    this.tourPreferences.sailingRating = this.tourPreferencesForm.value.sailingRating;
    this.tourPreferences.tags = String(this.tourPreferencesForm.value.tags).split(',');

    this.addOrUpdateTourPreferences(this.tourPreferences);
  }

  addOrUpdateTourPreferences(tourPreferences : TourPreferences): void {
    console.log('Tour Preferences:', tourPreferences);

    if (this.tourPreferences.id !== 0) {
      this.service.updateTourPreferences(tourPreferences).subscribe({
        next: (response) => { console.log('Preferences updated:', response); 
          this.snackBar.open('Preferences Updated', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
         }
      });
    } else {
      this.service.addTourPreferences(tourPreferences).subscribe({
        next: (response) => { console.log('Added new preferences:', response); 
          this.tourPreferences.id = response.id;
          this.snackBar.open('Preferences Added', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
