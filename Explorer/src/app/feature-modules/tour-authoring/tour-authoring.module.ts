import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubsComponent } from './clubs/clubs.component';



@NgModule({
  declarations: [
    ClubsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ClubsComponent
  ]
})
export class TourAuthoringModule { }
