import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ExploreToursComponent } from './explore-tours/explore-tours.component';



@NgModule({
  declarations: [
    ShoppingCartComponent,
    ExploreToursComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TourShoppingModule { }
