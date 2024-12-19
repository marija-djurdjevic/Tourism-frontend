import { Component, OnInit } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import 'leaflet-routing-machine';
import { WebSocketService } from './shared/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles.css']
})
export class AppComponent implements OnInit {
  title = 'Explorer';
  notifications: any[] = [];
  showNotification = false;

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) { }


  ngOnInit(): void {
    this.checkIfUserExists();
    // this.notifications.push({ Content: 'Welcome to Explorer!',ImagePath: 'assets/Points-Collector.png' });
    // this.showNotification = true;

    this.webSocketService.messageSubject.subscribe((notification) => {
      console.log('Message received in AppComponent:', notification);
      this.onMessageReceived(notification);
    });

    this.webSocketService.connect();
  }

  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }

  onMessageReceived(notification: any) {
    this.notifications.push(notification);
    this.showNotification = true;
  }
}
