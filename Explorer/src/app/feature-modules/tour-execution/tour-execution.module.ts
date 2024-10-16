import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouristEquipmentComponent } from './tourist-equipment/tourist-equipment.component';



@NgModule({
  declarations: [
    TouristEquipmentComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TouristEquipmentComponent
  ]
})
export class TourExecutionModule { }
