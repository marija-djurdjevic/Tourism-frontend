import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouristEquipmentComponent } from './tourist-equipment/tourist-equipment.component';
import { TouristEquipmentFormComponent } from './tourist-equipment-form/tourist-equipment-form.component';



@NgModule({
  declarations: [
    TouristEquipmentComponent,
    TouristEquipmentFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TouristEquipmentComponent
  ]
})
export class TourExecutionModule { }
