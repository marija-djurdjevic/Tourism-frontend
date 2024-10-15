import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourReviewComponent } from './tour-review/tour-review.component';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';



@NgModule({
  declarations: [
    TourReviewComponent,
    ProblemReportComponent,
    ProblemFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ 
    ProblemReportComponent,
    ProblemFormComponent
  ]
})
export class TourExecutionModule { }
