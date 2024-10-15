import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';
import {TourComponent } from './tour/tour.component'
import { TourFormComponent } from './tour-form/tour-form.component';
import { MatButtonModule } from '@angular/material/button';
import { KeyPointComponent } from './key-point/key-point/key-point.component';
import { FormsModule } from '@angular/forms';
import { KeyPointFormComponent } from './key-point-form/key-point-form.component';



@NgModule({
  declarations: [
    ObjectComponent,
    ObjectFormComponent,
    TourFormComponent,
    TourComponent,
    KeyPointComponent,
    KeyPointFormComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
    ],
  exports:[
    ObjectComponent,
    ReactiveFormsModule,
     TourComponent,
    TourFormComponent
  ],



})
export class TourAuthoringModule { }
