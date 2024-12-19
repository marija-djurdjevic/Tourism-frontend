import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;

  connect() {
    this.socket = new WebSocket('wss://localhost:44333/ws');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed');
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.error('Connection closed unexpectedly');
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket encountered an error:', error);
    };
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
