import { Component, OnInit } from '@angular/core';
import { AuthService } from './infrastructure/auth/auth.service';
import 'leaflet-routing-machine';
import { WebSocketService } from './shared/WebSocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../styles.css']
})
export class AppComponent implements OnInit {
  title = 'Explorer';
  notifications: any[] = [];
  showNotification=false;

  constructor(
    private authService: AuthService,
    private webSocketService: WebSocketService
  ) {}


  ngOnInit(): void {
    this.checkIfUserExists();
    this.webSocketService.connect();
  }
  
  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }
}
