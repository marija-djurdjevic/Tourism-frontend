import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';

@NgModule({
  declarations: [
    TourPreferencesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TourPreferencesComponent
  ]
})
export class TourExecutionModule { }
