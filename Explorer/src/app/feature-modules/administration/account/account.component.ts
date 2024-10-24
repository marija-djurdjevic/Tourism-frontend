import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  account: Account[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.service.getAccount().subscribe({
      next:  (result: PagedResults<Account>) => {
        this.account = result.results;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getAccount(): void {
    this.service.getAccount().subscribe({
      next: (result: PagedResults<Account>) => {
        this.account = result.results;
      },
      error: () => {
      }
    })
  }

  blockAccount(account: Account): void {
    const accounts: Account = {}
    this.service.blockAccount(account).subscribe({
      next: (_) => {
        this.getAccount();
      }
    }) 
  }
}
