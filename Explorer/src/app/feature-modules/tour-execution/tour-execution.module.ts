import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouristEquipmentComponent } from './tourist-equipment/tourist-equipment.component';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';


@NgModule({
  declarations: [
    TouristEquipmentComponent,
  
  ],
  imports: [
    CommonModule
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    TouristEquipmentComponent
    TourReviewComponent,
    ProblemReportComponent,
    ProblemFormComponent,
    TourReviewFormComponent,
    TourPreferencesComponent
   
  ]
})
export class TourExecutionModule { }
