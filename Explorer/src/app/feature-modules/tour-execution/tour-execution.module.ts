import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';


@NgModule({
  declarations: [
    ProblemReportComponent,
    ProblemFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [ 
    ProblemReportComponent,
    ProblemFormComponent
  ]
})
export class TourExecutionModule { }
