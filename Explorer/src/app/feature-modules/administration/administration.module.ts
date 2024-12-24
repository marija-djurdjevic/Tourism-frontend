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
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { AchievementsComponent } from './achievements/achievements.component';
@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountComponent,
    EncounterComponent,
    EncounterFormComponent,
    AchievementsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTooltipModule,
    FormsModule
],
    
 
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    AccountComponent,
    AchievementsComponent
  ]
})
export class AdministrationModule { }
