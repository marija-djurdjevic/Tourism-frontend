import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserProfile } from '../model/user-profile.model';
import { LayoutService } from '../layout.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoading=false;

  constructor(private layoutService: LayoutService,
    private router:Router,
    private authService: AuthService,
    private imageService:ImageService, 
    private cd: ChangeDetectorRef,
    private snackBar:MatSnackBar) { }
  
  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.role=user.role;
    });
    this.getProfile()
    
  }

  getProfile() {
    this.isLoading=true;
    this.layoutService.getProfile(this.user.role).subscribe({
      next:(result: UserProfile) => {
        this.userProfile = result;
        console.log(result)
        // kod za ucitavanje slike po id
        this.isLoading=false;
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
        this.isLoading = false;
        this.snackBar.open('Failed to load profile. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    })
  }

  seeProblems():void{
    this.router.navigate(['/problems']);
  }
  myReviews():void{
    this.router.navigate(['/tourReviews']);
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

  seeWallet():void{
    this.router.navigate(['/wallet']);
  }
}

