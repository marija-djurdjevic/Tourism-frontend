import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Notification } from 'src/app/infrastructure/auth/model/notification.model';
import { LayoutService } from '../layout.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../../../../styles.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  notifications: Notification[] = [];
  showNotifications: boolean = false;

  constructor(private authService: AuthService, private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;

      if(user.role === 'author') {
       this.layoutService.getAuthorNotifications(user.id).subscribe(notificationsData => {
        console.log('notificationsData:', notificationsData);
        this.notifications = notificationsData;
        console.log('notifications:', this.notifications);
       });
      }
      else if(user.role === 'tourist') {
        this.layoutService.getTouristNotifications(user.id).subscribe(notificationsData => {
          this.notifications = notificationsData;
         });
      }
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onLogout(): void {
    this.authService.logout();
    this.notifications = [];
  }
}
