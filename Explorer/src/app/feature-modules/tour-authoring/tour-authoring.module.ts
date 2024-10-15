import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TourComponent } from './tour/tour.component'
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TourEquipmentComponent } from './tour-equipment/tour-equipment.component';


@NgModule({
  declarations: [
    TourFormComponent,
    TourComponent,
    TourEquipmentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    TourComponent,
    TourFormComponent,
    TourEquipmentComponent
  ]
})
export class TourAuthoringModule { }
