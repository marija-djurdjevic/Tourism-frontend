import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './account/account.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EncounterComponent } from './encounter/encounter.component';
import { EncounterFormComponent } from './encounter-form/encounter-form.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountComponent,
    EncounterComponent,
    EncounterFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressSpinnerModule
],
    
 
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    AccountComponent
  ]
})
export class AdministrationModule { }
