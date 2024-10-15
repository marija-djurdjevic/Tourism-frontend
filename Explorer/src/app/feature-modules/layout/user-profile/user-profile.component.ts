import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../model/user-profile.model';
import { LayoutService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user : User
  userProfile: UserProfile;
  isEditing =  false;

  constructor(private layoutService: LayoutService,private authService: AuthService) { }
  
  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getProfile()
    
  }

  getProfile() {
    this.layoutService.getProfile(this.user.role).subscribe({
      next:(result: UserProfile) => {
        this.userProfile = result;
        console.log(result)
      },
      error:(err:any) => {
        console.log(err)
      }
    })
  }

  onProfileUpdated() {
    this.ngOnInit();
    this.isEditing = false;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing; 
  }
}

