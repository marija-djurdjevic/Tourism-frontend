import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import 'leaflet-routing-machine';
import { WebSocketService } from './shared/web-socket.service';
import { NotificationComponent } from './shared/notification/notification.component';
import { NotificationService } from './shared/notification.service';
import { NotificationType } from './shared/model/notificationType.enum';
import { Notification } from './feature-modules/layout/model/notification.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles.css']
})
export class AppComponent implements OnInit {
  @ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;
  title = 'Explorer';
  notifications: any[] = [];
  showNotification = false;

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
  ) { }

  ngAfterViewInit() {
    this.notificationService.register(this.notificationComponent);
  }

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
    this.notificationService.notify({message: notification.Content, duration: 5000,notificationType:NotificationType.MESSAGE,messageSender:'Explorer'});
  }
}
