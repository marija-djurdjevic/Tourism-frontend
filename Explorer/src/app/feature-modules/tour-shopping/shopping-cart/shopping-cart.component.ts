import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Coupon } from '../model/coupon.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  orderItems: OrderItem[] = [];
  user: User;
  isLoading = false;
  enteredCouponCode: string = '';
  appliedCoupons: Coupon[] | null = null
  constructor(private service: TourShoppingService,private snackBar:MatSnackBar, private authService: AuthService, private tourService: TourAuthoringService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
      this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    if (!this.user) {
      console.log("User not logged in");
      this.snackBar.open('User not logged in . Login.', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });
      this.isLoading = false;
      this.orderItems = [];
      return;
    }
    
    // Define the cart key based on the user ID
    const cartKey = `cart_${this.user.id}`;

    // Retrieve the cart from localStorage
    const storedCart = localStorage.getItem(cartKey);

    // Parse the cart if it exists, or assign an empty array if not
    this.orderItems = storedCart ? JSON.parse(storedCart) : [];
    console.log('Loaded cart:', this.orderItems);
    this.isLoading = false;
  }

  removeFromCart(id: number): void {
    if (!this.user) {
      console.log("User not logged in");
      this.snackBar.open('User not logged in. Login.', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });
      return;
    }
  
    const cartKey = `cart_${this.user.id}`;

    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const itemIndex = cart.findIndex((item: { tourId: number }) => item.tourId === id);

    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
      console.log(`Item with ID ${id} removed from cart.`);
      this.snackBar.open('Item removed successfully!', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });

      localStorage.setItem(cartKey, JSON.stringify(cart));
  
      this.orderItems = cart;
    } else {
      console.log(`Item with ID ${id} not found in cart.`);
      this.snackBar.open('Item not found in cart.', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });
    }
  }
  

  resetCart(): void {
    if (!this.user) {
      console.log("User not logged in");
      this.snackBar.open('User not logged in. Login.', 'Close', {
        duration: 3000,
        panelClass:"succesful"
      });
      return;
    }
  
    // Define the cart key based on the user ID
    const cartKey = `cart_${this.user.id}`;
  
    // Remove the cart from localStorage
    localStorage.removeItem(cartKey);
  
    // Clear the orderItems array
    this.orderItems = [];
    this.appliedCoupons = [];
  
    console.log("Cart has been reset for user:", this.user.username);
  }
  
  

  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price, 0);
  }

  checkout(): void {
    this.service.getWallet().subscribe({
      next: (wallet) => {
        const totalPrice = this.getTotalPrice();
  
        if (totalPrice > wallet.balance) {
          alert(`Insufficient funds. Your wallet balance is ${wallet.balance}, but the total price is ${totalPrice}.`);
          return;
        }
  
        // Proceed with checkout
        this.service.checkout(this.orderItems).subscribe({
          next: (response) => {
            console.log("Checkout successful:", response);
  
            // Update the wallet balance
            const updatedWallet = {
              ...wallet,
              balance: wallet.balance - totalPrice, // Deduct the total price
            };
  
            this.service.updateWallet(updatedWallet).subscribe({
              next: (updatedResponse) => {
                console.log("Wallet updated successfully:", updatedResponse);
                this.snackBar.open('Checkout successful and wallet updated!', 'Close', {
                  duration: 3000,
                  panelClass: "succesful"
                });
                this.resetCart(); // Clear the cart after successful checkout
              },
              error: (error) => {
                console.error("Failed to update wallet:", error);
                alert('Checkout was successful, but wallet update failed. Please contact support.');
              }
            });
          },
          error: (error) => {
            console.error("Checkout failed:", error);
            this.snackBar.open('Checkout failed. Try again.', 'Close', {
              duration: 3000,
              panelClass: "succesful"
            });
          }
        });
      },
      error: (err) => {
        console.error("Failed to fetch wallet balance:", err);
        alert('Could not fetch wallet balance. Please try again later.');
      }
    });
  }

  useCoupon(): void {
    if (!this.enteredCouponCode.trim()) {
      alert('Please enter a coupon code.');
      return;
    }
  
    // Check if the coupon has already been applied
    if (this.appliedCoupons){
      const alreadyApplied = this.appliedCoupons.some(coupon => coupon.code === this.enteredCouponCode);
      if (alreadyApplied) {
        alert('This coupon has already been applied.');
        return;
      }
    }   
  
    this.service.getCouponByCode(this.enteredCouponCode).subscribe({
      next: (coupon) => {
        const alreadyApplied = this.appliedCoupons!.some(c => c.code === coupon.code);
        if (alreadyApplied) {
          alert('This coupon has already been applied.');
          return;
        }
  
        // Add the coupon to the appliedCoupons list
        this.appliedCoupons!.push(coupon);
  
        if (coupon.allDiscounted) {
          // Fetch all tours authored by the coupon's author
          this.tourService.getToursByAuthorIdAsTourist(coupon.authorId).subscribe({
            next: (toursResponse) => {
              const authorTours = toursResponse.results.map(tour => tour.id);
  
              // Find matching tours in the cart and apply the discount to the most expensive one
              const matchingItems = this.orderItems.filter(item => authorTours.includes(item.tourId));
  
              if (matchingItems.length > 0) {
                const mostExpensiveItem = matchingItems.reduce((prev, current) =>
                  current.price > prev.price ? current : prev
                );
  
                const originalPrice = mostExpensiveItem.price;
                const discountedPrice = originalPrice - (originalPrice * (coupon.discount / 100));
                mostExpensiveItem.price = parseFloat(discountedPrice.toFixed(2)); // Update the price
  
                // Save the updated cart to localStorage
                const cartKey = `cart_${this.user.id}`;
                localStorage.setItem(cartKey, JSON.stringify(this.orderItems));
  
                alert(`Coupon applied! ${coupon.discount}% off on the most expensive tour of the author.`);
              } else {
                alert('No tours from this author found in your cart.');
              }
            },
            error: (err) => {
              console.error('Error fetching author tours:', err);
              alert('Could not fetch tours for this coupon. Please try again.');
            },
          });
        } else {
          // Apply discount to a specific tour
          let discountApplied = false;
  
          this.orderItems = this.orderItems.map(item => {
            if (item.tourId === coupon.discountedTourId) {
              const originalPrice = item.price;
              const discountedPrice = originalPrice - (originalPrice * (coupon.discount / 100));
              item.price = parseFloat(discountedPrice.toFixed(2)); // Update the price with discount
              discountApplied = true;
            }
            return item;
          });
  
          if (discountApplied) {
            // Save the updated cart to localStorage
            const cartKey = `cart_${this.user.id}`;
            localStorage.setItem(cartKey, JSON.stringify(this.orderItems));
  
            alert(`Coupon applied successfully! Discount: ${coupon.discount}%`);
          } else {
            alert('Coupon does not apply to any items in your cart.');
          }
        }
      },
      error: (err) => {
        console.error('Error fetching coupon:', err);
        alert('Invalid coupon code or an error occurred.');
      },
    });
  }
  
}
