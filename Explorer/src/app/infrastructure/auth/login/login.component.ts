import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from 'src/app/shared/web-socket.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';
import { NotificationService } from 'src/app/shared/notification.service';

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
    private notificationService: NotificationService,
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
          this.notificationService.notify({ message:'Invalid username or password', duration: 3000, notificationType: NotificationType.WARNING });
        }
      });
    }
  }
}
