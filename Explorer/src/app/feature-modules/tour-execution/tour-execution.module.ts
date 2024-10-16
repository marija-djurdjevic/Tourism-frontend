import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { TourReviewFormComponent } from './tour-review-form/tour-review-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';


@NgModule({
  declarations: [
    TourReviewComponent,
    ProblemReportComponent,
    ProblemFormComponent,
    TourReviewFormComponent
   
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
    TourPreferencesComponent
  ],
  exports: [ 
    ProblemReportComponent,
    ProblemFormComponent,
    TourPreferencesComponent

  ]
})
export class TourExecutionModule { }
