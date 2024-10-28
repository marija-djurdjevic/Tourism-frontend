import { Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { TourShoppingService } from '../tour-shopping.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { OrderItem } from '../model/order-item.model';

@Component({
  selector: 'xp-explore-tours',
  templateUrl: './explore-tours.component.html',
  styleUrls: ['./explore-tours.component.css']
})
export class ExploreToursComponent implements OnInit{

  tours: Tour[] = [];
  user: User;

  constructor(private service: TourShoppingService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
      this.getTours();
  }

  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: Array<Tour>) => {
        this.tours = result;
        console.log(result);        
      },
      error: (err : any) => {
        console.log(err)
      }
    });
  }

  addToCart(id: number, name: string, price: number): void {
    console.log(id);
    
    // Define the cart key based on the user ID
    const cartKey = `cart_${this.user.id}`;
    
    // Get the existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    // Check if the item already exists in the cart
    const existingItem = cart.find((item: { id: number }) => item.id === id);

    if (existingItem) {
        // If item exists, increment the quantity
        existingItem.quantity += 1;
        console.log(`Increased quantity for Tour ID ${id} to ${existingItem.quantity}`);
    } else {
        // If item does not exist, add it with quantity 1
        const newItem: OrderItem = { id, name, price, quantity: 1 };
        cart.push(newItem);
        alert("Added to cart");
        console.log(`Tour with ID ${id} added to cart for user ${this.user.username} with quantity 1`);
    }

    // Update the cart in localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

}
