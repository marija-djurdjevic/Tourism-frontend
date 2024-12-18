import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Notification, NotificationType } from 'src/app/feature-modules/layout/model/notification.model';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';
import { UserProfile } from '../model/user-profile.model';
import { ImageService } from 'src/app/shared/image.service';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EncounterService } from '../../encounters/encounter.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Encounter } from '../../encounters/model/encounter.model';
import { AdministrationService } from '../../administration/administration.service';
import { Achievement } from '../../administration/model/achievement.model';

@Component({
  selector: 'xp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css', '../../../../styles.css']
})
export class NavbarComponent implements OnInit {

  user: User | undefined;
  notifications: Notification[] = [];
  showNotifications: boolean = false;
  userProfile: UserProfile;
  showProfileMenu: boolean = false;
  showLocationButton: boolean = true;
  badge: string = '';

  constructor(private authService: AuthService, private administrationService: AdministrationService, private layoutService: LayoutService, private router: Router, private imageService: ImageService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showLocationButton = !this.router.url.startsWith('/tourSession');
        console.log('Current URL:', this.router.url);
        console.log('Hide Location Button:', this.showLocationButton);
      });

    this.authService.user$.subscribe(user => {
      this.user = user;

      this.administrationService.getAchievements().subscribe({
        next: (result: Achievement[]) => {
          var achievements = result.filter(a => a.type === 7 && a.imagePath != 'assets/badge.png').sort((a, b) => b.criteria - a.criteria);
          this.badge = achievements[0].imagePath || '';
        },
      });

      if (user.role === 'author') {
        this.layoutService.getAuthorNotifications(user.id).subscribe(notificationsData => {
          console.log('notificationsData:', notificationsData);
          this.notifications = notificationsData;
          console.log('notifications:', this.notifications);
        });
      }
      else if (user.role === 'tourist') {
        this.layoutService.getTouristNotifications(user.id).subscribe(notificationsData => {
          this.notifications = notificationsData;
          console.log("NOTIFICATIONS : ", this.notifications)
        });
      }
      this.layoutService.getProfile(user.role).subscribe({
        next: (result: UserProfile) => {
          this.userProfile = result;
          console.log(result)
          this.imageService.setControllerPath(user.role + "/image");
          this.imageService.getImage(Number(this.userProfile.imageURL)).subscribe({
            next: (blob: Blob) => {
              console.log(blob);
              if (blob.type.startsWith('image')) {
                this.userProfile.imageURL = URL.createObjectURL(blob);
                this.cd.detectChanges();
              } else {
                console.error("Blob nije slika:", blob);
              }
            },
            error: () => {
              this.userProfile.imageURL = 'assets/user.png';
            }
          });
        },
        error: (err: any) => {
          console.log(err)
        }
      })
    });


  }

  goToHome(): void {
    console.log("Metoda goToHome pozvana!");
    console.log("Navigacija ka: ", this.user?.role);
    if (this.user?.role === 'administrator') {
      this.router.navigate(['/account']);
    } else if (this.user?.role === 'author') {
      this.router.navigate(['/tours']);
    } else if (this.user?.role === 'tourist') {
      this.router.navigate(['/explore-tours']);
    }
  }
   
  myProfile(){
    this.showProfileMenu = !this.showProfileMenu;
    this.router.navigate(['/profile']);
  }
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.cd.detectChanges();
  }
  goToProblem(notification: Notification, problemId: number): void {
    if (this.user?.role === 'tourist') {
      this.layoutService.markAsReadTourist(notification).subscribe(result => {
        this.notifications = this.notifications.filter(n => n !== notification);

        if (notification.type === NotificationType.TourRefund) {
          this.router.navigate(['explore-tours'], { queryParams: { refundId: notification.referenceId } });
        } else {
          this.router.navigate(['/problem'], { queryParams: { id: problemId } });
        }
      });
    }
    else if (this.user?.role === 'author') {
      this.layoutService.markAsReadAuthor(notification).subscribe(result => {
        this.notifications = this.notifications.filter(n => n !== notification);
        if (notification.type == NotificationType.TourProblem) this.router.navigate(['/problem'], { queryParams: { id: problemId } });
      });
    }

    this.showNotifications = !this.showNotifications;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onLogout(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.authService.logout();
    this.notifications = [];
  }
}
