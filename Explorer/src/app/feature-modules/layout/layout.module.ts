import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { UserRatingComponent } from './user-rating/user-rating.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingsListComponent } from './ratings-list/ratings-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    UserRatingComponent,
    RatingsListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    UserRatingComponent,
    RatingsListComponent
  ]
})
export class LayoutModule { }
