import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectComponent } from './object/object.component';
import { ObjectFormComponent } from './object-form/object-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ObjectComponent,
    ObjectFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
    ],
  exports:[
    ObjectComponent
  ]


})
export class TourAuthoringModule { }
