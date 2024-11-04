import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourSearchComponent } from './tour-search/tour-search.component';



@NgModule({
  declarations: [
    TourSearchComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TourSearchComponent
  ]
})
export class MarketplaceModule { }
