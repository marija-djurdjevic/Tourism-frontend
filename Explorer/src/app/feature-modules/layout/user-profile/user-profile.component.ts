import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../model/user-profile.model';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  
  constructor(private service: LayoutService) {}
  
  ngOnInit(): void {
    this.service.getProfile().subscribe({
      next:(result: UserProfile) => {
        this.userProfile = result;
        console.log(result)
      },
      error:(err:any) => {
        console.log(err)
      }
    })
  }

  userProfile: UserProfile;
}
