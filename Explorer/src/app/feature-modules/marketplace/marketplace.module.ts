import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourSearchComponent } from './tour-search/tour-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    TourSearchComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatCardModule,
    SharedModule
  ],
  exports: [
    TourSearchComponent
  ]
})
export class MarketplaceModule { }
