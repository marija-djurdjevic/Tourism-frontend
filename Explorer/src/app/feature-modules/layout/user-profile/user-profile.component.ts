import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfile } from '../model/user-profile.model';
import { LayoutService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user : User
  userProfile: UserProfile;
  isEditing =  false;
  role:String='';
  constructor(private layoutService: LayoutService,private router:Router, private authService: AuthService,private imageService:ImageService, private cd: ChangeDetectorRef) { }
  
  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.role=user.role;
    });
    this.getProfile()
    
  }

  getProfile() {
    this.layoutService.getProfile(this.user.role).subscribe({
      next:(result: UserProfile) => {
        this.userProfile = result;
        console.log(result)
        // kod za ucitavanje slike po id
        this.imageService.setControllerPath(this.role+"/image");
          this.imageService.getImage(Number(this.userProfile.imageURL)).subscribe((blob: Blob) => {
            console.log(blob);  // Proveri sadržaj Blob-a
            if (blob.type.startsWith('image')) {
              this.userProfile.imageURL = URL.createObjectURL(blob);
              this.cd.detectChanges();
            } else {
              console.error("Blob nije slika:", blob);
            }
          });

        //kraj
      },
      error:(err:any) => {
        console.log(err)
      }
    })
  }

  setPreferences():void{
    this.router.navigate(['/tour-preferences']);
  }
  onProfileUpdated() {
    this.getProfile();
    this.isEditing = false;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing; 
  }
}

