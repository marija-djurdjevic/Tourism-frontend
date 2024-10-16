import { Component, Input,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout.service';
import { UserProfile } from '../model/user-profile.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.css']
})
export class UserProfileFormComponent {

  @Input() profile: UserProfile
  @Output() profileUpdated = new EventEmitter<string>();

  user: User;

  constructor(private layoutService: LayoutService,private authService: AuthService) { }

  ngOnInit(): void {
    this.userProfileForm.patchValue(this.profile);
    this.authService.user$.subscribe(user => {
     this.user = user;
   });
  }

  userProfileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    imageURL: new FormControl(''),
    biography: new FormControl(''),
    motto: new FormControl('')
  })

  updateProfile(): void {

    const userProfile: UserProfile = {
      id: this.user.id,
      firstName: this.userProfileForm.value.firstName || "",
      lastName: this.userProfileForm.value.lastName || "",
      imageURL: this.userProfileForm.value.imageURL || "",
      biography: this.userProfileForm.value.biography || "",
      motto: this.userProfileForm.value.motto || ""
    }
    this.layoutService.updateProfile(userProfile,this.user.role).subscribe({
      next: (_) => {
        this.profileUpdated.emit("Profile Successfully updated.")
      }
      
    })
  }
}
