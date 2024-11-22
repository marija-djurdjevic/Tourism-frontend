import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  account: Account[] = [];
  isLoading = false;

  constructor(private service: AdministrationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadAccount();
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
}
