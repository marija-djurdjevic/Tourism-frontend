import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  orderItems: OrderItem[] = [];
  user: User;
  isLoading = false;

  constructor(private service: TourShoppingService,private snackBar:MatSnackBar, private authService: AuthService) {}

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
  
    console.log("Cart has been reset for user:", this.user.username);
  }
  
  

  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price, 0);
  }

  checkout(): void {
    this.service.checkout(this.orderItems).subscribe({
      next: (response) => {
        console.log("Checkout successful:", response);
        this.snackBar.open('Checkout successful!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
        // Optionally, clear the cart or navigate to another page after successful checkout
        this.resetCart(); // clear the cart
      },
      error: (error) => {
        console.error("Checkout failed:", error);
        this.snackBar.open('Checkout failed. Try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      complete: () => {
        console.log("Checkout process completed.");
        this.snackBar.open('Checkout process completed.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }
}
