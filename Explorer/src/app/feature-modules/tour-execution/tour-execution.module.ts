import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';

@NgModule({
  declarations: [
    TourPreferencesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    TourPreferencesComponent
  ]
})
export class TourExecutionModule { }
