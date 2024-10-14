import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecutionService } from '../tour-execution.service';
import { TourPreferences } from 'src/app/shared/model/tour-preferences.model';

@Component({
  selector: 'xp-tour-preferences',
  templateUrl: './tour-preferences.component.html',
  styleUrls: ['./tour-preferences.component.css']
})
export class TourPreferencesComponent implements OnInit {
  
  user: User | undefined;
  tourPreferences: TourPreferences;
  tourPreferencesForm: FormGroup;

  constructor(private authService: AuthService, private service: TourExecutionService, private fb: FormBuilder) {
    this.tourPreferencesForm = this.fb.group({
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

      if (this.user && this.user.id) {
        this.loadTourPreferences(this.user.id);
      }
    });
  }

  loadTourPreferences(touristId: number): void {
    this.service.getTourPreferencesByTouristId(touristId).subscribe(
      data => {
        console.log('Tour Preferences:', data);
        this.tourPreferences = data;
        this.tourPreferencesForm.patchValue(data);
      },
      error => {
        console.log('Error fetching tour preferences:', error);
      }
    );
  }

  onSubmit(): void {
    console.log('Form submitted:', this.tourPreferencesForm.value);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
