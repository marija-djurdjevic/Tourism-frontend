import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from '../tour-authoring/tour-review/tour-review.component';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { TourReviewFormComponent } from '../tour-authoring/tour-review-form/tour-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';
import { TouristLocationComponent } from './tourist-location/tourist-location.component';
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  declarations: [
    TourReviewComponent,
    ProblemReportComponent,
    ProblemFormComponent,
    TourReviewFormComponent,
    TourPreferencesComponent,
    TouristLocationComponent,
    TouristLocationComponent
   
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
],
  exports: [ 
    ProblemReportComponent,
    ProblemFormComponent,
    TourPreferencesComponent,
    TouristLocationComponent
  ]
})
export class TourExecutionModule { }
