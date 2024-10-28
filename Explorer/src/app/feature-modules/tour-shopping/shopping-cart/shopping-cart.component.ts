import { Component, OnInit } from '@angular/core';
import { OrderItem } from '../model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourShoppingService } from '../tour-shopping.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  orderItems: OrderItem[] = [];
  user: User;

  constructor(private service: TourShoppingService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
      this.loadCart();
  }

  loadCart(): void {
    if (!this.user) {
      console.log("User not logged in");
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
  }

  updateQuantity(id: number, operation: string = "+"): void {
    // Find the item in orderItems by id
    const itemIndex = this.orderItems.findIndex((orderItem) => orderItem.id === id);
  
    if (itemIndex !== -1) {
      const item = this.orderItems[itemIndex];
      
      // Increment or decrement the quantity based on the operation
      if (operation === "+") {
        item.quantity += 1;
      } else if (operation === "-") {
        item.quantity -= 1;
  
        // If quantity reaches zero, remove the item from the cart
        if (item.quantity === 0) {
          this.orderItems.splice(itemIndex, 1);
          console.log(`Item with ID ${id} removed from cart.`);
        }
      }
  
      // Define the cart key based on the user ID
      const cartKey = `cart_${this.user.id}`;
  
      // Save the updated orderItems array back to localStorage
      localStorage.setItem(cartKey, JSON.stringify(this.orderItems));
      console.log(`Updated quantity for item with ID ${id} to ${item.quantity}`);
    } else {
      console.log(`Item with ID ${id} not found in cart.`);
    }
  }
  

  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  
}
