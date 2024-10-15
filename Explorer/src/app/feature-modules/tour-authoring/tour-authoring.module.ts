import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent } from './tour/tour.component'
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { KeyPointComponent } from './key-point/key-point/key-point.component';
import { FormsModule } from '@angular/forms';
import { KeyPointFormComponent } from './key-point-form/key-point-form.component';


@NgModule({
  declarations: [
    TourFormComponent,
    TourComponent,
    KeyPointComponent,
    KeyPointFormComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TourComponent,
    TourFormComponent
  ]
})
export class TourAuthoringModule { }
