import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRatingComponent } from './user-rating/user-rating.component';
import { RatingsListComponent } from './ratings-list/ratings-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    UserProfileComponent,
    UserProfileFormComponent,
    UserRatingComponent,
    RatingsListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    UserProfileComponent,
    UserRatingComponent,
    RatingsListComponent
  ]
})
export class LayoutModule { }
