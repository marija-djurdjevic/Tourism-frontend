import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './live-notification.component.html',
  styleUrls: ['./live-notification.component.css']
})
export class LiveNotificationComponent implements OnInit {
  @Input() notifications: any[] = [];
  currentNotification: any | null = null;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // alert('LiveNotificationComponent initialized');
    this.showNextNotification();
  }

  showNextNotification(): void {
    if (this.notifications.length > 0) {
      this.currentNotification = this.notifications.pop();
      // alert(this.currentNotification.content);
      this.cdr.detectChanges(); // Obavestite Angular o promeni
    }
  }

  closeNotification(): void {
    this.currentNotification = null;
    this.showNextNotification();
  }
}
