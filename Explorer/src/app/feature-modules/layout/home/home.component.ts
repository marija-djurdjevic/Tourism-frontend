import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private router: Router
  ) { }
  exploreTours() {
    this.router.navigate(['/explore']);
  }
}
