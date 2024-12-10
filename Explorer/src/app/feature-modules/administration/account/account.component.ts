import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Wallet } from '../../tour-shopping/model/wallet.model';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  account: Account[] = [];
  wallets: Wallet[] = [];
  isLoading = false;
  selectedWallet: Wallet | null = null;
  showWalletPopup = false;

  constructor(private service: AdministrationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadAccount();
    this.loadWallets();
  }

  loadAccount(): void {
    this.isLoading = true;
    this.service.getAccount().subscribe({
      next: (result: PagedResults<Account>) => {
        this.account = result.results;
        this.isLoading = false;
        // this.snackBar.open('Data loaded successfully!', 'Close', {
        //   duration: 3000,
        //   panelClass:"succesful"
        // });
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
        this.snackBar.open('Failed to load data. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "succesful"
        });
      }
    });
  }

  getAccount(): void {
    this.loadAccount();
  }

  blockAccount(account: Account): void {
    const accounts: Account = {}
    this.service.blockAccount(account).subscribe({
      next: (_) => {
        this.getAccount();
        this.snackBar.open('Account blocked successfully!', 'Close', {
          duration: 3000,
          panelClass: "succesful"
        });
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open('Failed to block account. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "succesful"
        });
      }
    })
  }

  isBlocked(account: Account): boolean {
    return account.isActive === false;
  }

  loadWallets(): void {
    this.service.getAllWallets().subscribe({
      next: (result: PagedResults<Wallet>) => {
        this.wallets = result.results; // Store all wallets
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open('Failed to load wallets. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'error'
        });
      }
    });
  }

  showWallet(userId: number): void {
    const wallet = this.wallets.find(w => w.touristId === userId);

    if (!wallet) {
      this.snackBar.open('Wallet not found.', 'Close', {
        duration: 3000,
        panelClass: 'error'
      });
      return;
    }

    this.selectedWallet = { ...wallet }; // Create a copy of the wallet to edit
    this.showWalletPopup = true; // Show the popup
  }

  closePopup(): void {
    this.selectedWallet = null;
    this.showWalletPopup = false; // Hide the popup
  }

  increaseBalance(): void {
    if (this.selectedWallet) {
      this.selectedWallet.balance += 1;
    }
  }

  decreaseBalance(): void {
    if (this.selectedWallet && this.selectedWallet.balance > 0) {
      this.selectedWallet.balance -= 1;
    }
  }

  saveWallet(): void {
    if (this.selectedWallet) {
      this.service.updateWallet(this.selectedWallet).subscribe({
        next: () => {
          this.snackBar.open('Wallet balance updated successfully!', 'Close', {
            duration: 3000,
            panelClass: 'success'
          });
          this.loadWallets(); // Refresh the wallets
          this.closePopup();
        },
        error: (err: any) => {
          console.log(err);
          this.snackBar.open('Failed to update wallet. Please try again.', 'Close', {
            duration: 3000,
            panelClass: 'error'
          });
        }
      });
    }
  }
}
