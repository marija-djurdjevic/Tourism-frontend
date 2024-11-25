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
import { ProblemsListComponent } from './problems-list/problems-list.component';
import { TourProblemComponent } from './tour-problem/tour-problem.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TourSessionComponent } from './tour-session/tour-session.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { AddEncounterComponent } from '../encounters/add-encounter/add-encounter.component';

@NgModule({
  declarations: [
    TourReviewComponent,
    ProblemReportComponent,
    ProblemFormComponent,
    TourReviewFormComponent,
    TourPreferencesComponent,
    TouristLocationComponent,
    ProblemsListComponent,
    TourProblemComponent,
    TourSessionComponent,
    TourListComponent,
    AddEncounterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,


],
  exports: [ 
    ProblemReportComponent,
    ProblemFormComponent,
    TourPreferencesComponent,
    TouristLocationComponent,
    TourSessionComponent,
    TourListComponent
  ]
})
export class TourExecutionModule { }
