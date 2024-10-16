import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemReportComponent } from './problem-report/problem-report.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourPreferencesComponent } from './tour-preferences/tour-preferences.component';


@NgModule({
  declarations: [
    ProblemReportComponent,
    ProblemFormComponent,
    TourPreferencesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [ 
    ProblemReportComponent,
    ProblemFormComponent,
  TourPreferencesComponent

  ]
})
export class TourExecutionModule { }
