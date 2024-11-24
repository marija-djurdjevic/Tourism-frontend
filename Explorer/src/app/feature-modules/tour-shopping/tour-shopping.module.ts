import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ExploreToursComponent } from './explore-tours/explore-tours.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { WalletComponent } from './wallet/wallet.component';



@NgModule({
  declarations: [
    ShoppingCartComponent,
    ExploreToursComponent,
    PurchasedToursComponent,
    WalletComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TourShoppingModule { }
