import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;

  // Subject za emitovanje primljenih poruka
  public messageSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  async connect() {
    try {
      const response: any = await this.http.post('https://localhost:44333/api/websocket/register', {}).toPromise();
      const webSocketUrl = response.webSocketUrl;

      this.socket = new WebSocket(webSocketUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };

      this.socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
        // Emitovanje poruke kroz Subject
        const notification = JSON.parse(event.data);
        this.messageSubject.next(notification);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to register WebSocket:', error);
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log('Message sent:', message);
    } else {
      console.error('Cannot send message. WebSocket is not open.');
    }
  }
}
