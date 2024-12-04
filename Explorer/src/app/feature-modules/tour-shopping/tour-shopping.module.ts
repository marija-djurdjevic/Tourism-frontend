import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ExploreToursComponent } from './explore-tours/explore-tours.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { WalletComponent } from './wallet/wallet.component';
import { BundleComponent } from './bundles/bundle.component';
import { BundleCreateComponent } from './bundle-create/bundle-create.component';
import { FormsModule } from '@angular/forms';
import { ExploreBundlesComponent } from './explore-bundles/explore-bundles.component';

@NgModule({
  declarations: [
    ShoppingCartComponent,
    ExploreToursComponent,
    PurchasedToursComponent,
    WalletComponent,
    BundleComponent,
    BundleCreateComponent,
    ExploreBundlesComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TourShoppingModule { }
