import { Component, OnInit } from '@angular/core';
import { Wallet } from '../model/wallet.model';
import { TourShoppingService } from '../tour-shopping.service';

@Component({
  selector: 'xp-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  wallet: Wallet | null = null;
  error: string | null = null;
  isLoading: boolean = true; // Add loading state

  constructor(private service: TourShoppingService) {}

  ngOnInit(): void {
    this.loadWallet();
  }

  // Fetch wallet data
  loadWallet(): void {
    this.service.getWallet().subscribe({
      next: (wallet: Wallet) => {
        this.wallet = wallet;
        this.error = null; // Clear any previous error
        this.isLoading = false; // Stop loading
      },
      error: (err) => {
        this.wallet = null;
        this.error = 'Failed to load wallet data. Please try again later.';
        this.isLoading = false; // Stop loading
        console.error('Error fetching wallet:', err); // Log for debugging
      }
    });
  }
}
