import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';



@NgModule({
  declarations: [
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
