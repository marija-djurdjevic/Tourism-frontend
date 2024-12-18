import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../model/user.model';

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: User | undefined;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(login).subscribe({
        next: () => {
          this.authService.user$.subscribe(user => {
            this.user = user;
          });

          this.isLoading = false;

          if (this.user?.role === 'administrator') {
            this.router.navigate(['/account']);
          } else if (this.user?.role === 'author') {
            this.router.navigate(['/tours']);
          } else if (this.user?.role === 'tourist') {
            this.router.navigate(['/explore-tours']);
          }
        },error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Invalid username or password', 'Close', {
            duration: 5000,
            panelClass: ['mat-toolbar', 'mat-warn']
          });
        }
      });
    }
  }
}
