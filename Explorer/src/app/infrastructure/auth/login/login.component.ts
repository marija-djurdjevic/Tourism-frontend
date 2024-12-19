import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from 'src/app/shared/web-socket.service';

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService
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
          this.router.navigate(['/']);
          this.isLoading = false;
          this.webSocketService.connect();
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
