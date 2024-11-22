import { Component, Input, Output, EventEmitter,OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout.service';
import { UserProfile } from '../model/user-profile.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.css']
})
export class UserProfileFormComponent implements OnInit {

  @Input() profile: UserProfile
  @Output() profileUpdated = new EventEmitter<string>();
  selectedFile: File;
  user: User;
  showImageUpload: boolean = false
  @ViewChild('imageUploadInput') imageUploadInput: ElementRef;


  constructor(private layoutService: LayoutService,
    private imageService: ImageService, 
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.userProfileForm.patchValue(this.profile);
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  changeImage() {
    this.showImageUpload = true
    setTimeout(() => {
      this.imageUploadInput.nativeElement.focus();
    }, 0);
  }

  userProfileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    imageURL: new FormControl(''),
    biography: new FormControl(''),
    motto: new FormControl('')
  })
  /*Dio 1 za upload slika*/
  onFileSelected(file: File): void {
    this.selectedFile = file;  // Čuvanje fajla kada ga child komponenta emituje
    console.log('Selected file:', this.selectedFile);
  }
  /*Kraj*/
  updateProfile(): void {

    const userProfile: UserProfile = {
      id: this.user.id,
      firstName: this.userProfileForm.value.firstName || "",
      lastName: this.userProfileForm.value.lastName || "",
      imageURL: this.userProfileForm.value.imageURL || "",
      biography: this.userProfileForm.value.biography || "",
      motto: this.userProfileForm.value.motto || ""
    }
    if(this.selectedFile){
      /*----------------Dio 2 za upload slike---------------*/
    var role=this.user.role
    this.imageService.setControllerPath(role+"/image");
    this.imageService.uploadImage(this.selectedFile).subscribe((imageId: number) => {
      this.imageService.getImage(imageId);
      userProfile.imageURL=imageId.toString();
      this.layoutService.updateProfile(userProfile, this.user.role).subscribe({
        next: (_) => {
          this.profileUpdated.emit("Profile Successfully updated.")
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            panelClass:"succesful"
          });
        },
        error: (err: any) => {
          console.log(err);
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000,
            panelClass:"succesful"
          });
        }
      })
    });
    /*---------------------Kraj------------------------*/
    }else{
      this.layoutService.updateProfile(userProfile, this.user.role).subscribe({
        next: (_) => {
          this.profileUpdated.emit("Profile Successfully updated.")
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            panelClass:"succesful"
          });
        },
        error: (err: any) => {
          console.log(err);
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000,
            panelClass:"succesful"
          });
        }
      })
    }
    
  }
}
