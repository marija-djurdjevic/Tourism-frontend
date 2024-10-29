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

  removeFromCart(id: number): void {
    if (!this.user) {
      console.log("User not logged in");
      return;
    }
  
    const cartKey = `cart_${this.user.id}`;

    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const itemIndex = cart.findIndex((item: { id: number }) => item.id === id);

    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
      console.log(`Item with ID ${id} removed from cart.`);

      localStorage.setItem(cartKey, JSON.stringify(cart));
  
      this.orderItems = cart;
    } else {
      console.log(`Item with ID ${id} not found in cart.`);
    }
  }
  

  resetCart(): void {
    if (!this.user) {
      console.log("User not logged in");
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
  
}
