import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Object } from '../model/object.model'
import { ImageService } from 'src/app/shared/image.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent {

  imageId:Number;
  selectedFile: File;
  previewImage: string | null = null
  longitude:Number;
  latitude:Number;
  isPublic: boolean = false;

  constructor(private service: TourAuthoringService,private notificationService: NotificationService, private imageService: ImageService,private router: Router) {
    /*Obavezan dio za podesavanje putanje za kontoler koji cuva slike
    ODREDJUJE SE NA OSNOVU ULOGE KOJA VRSI OPERACIJU ZBOG AUTORIZACIJE*/
    imageService.setControllerPath("author/image");
   }

  objectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    isPublic: new FormControl(false)
  })

  /*Dio 1 za upload slika*/
  onFileSelected(file: File): void {
    this.selectedFile = file;  // Čuvanje fajla kada ga child komponenta emituje
    console.log('Selected file:', this.selectedFile);
  }
  /*Kraj*/

  addObject(): void {
    if (this.objectForm.valid) {
      const object: Object = {
        name: this.objectForm.value.name || "",
        description: this.objectForm.value.description || "",
        category: this.objectForm.value.category || 0,
        longitude:this.longitude,
        latitude: this.latitude,
        imageId: -1,
        image:"",
        status: this.objectForm.value.isPublic ? 0 : 1
      };
      /*----------------Dio 2 za upload slike---------------*/
      this.imageService.setControllerPath("author/image");
      this.imageService.uploadImage(this.selectedFile).subscribe((imageId: number) => {
        this.imageService.getImage(imageId);
        object.imageId=imageId;
        this.service.addObject(object).subscribe({
          next: () => {
            console.log('Objekat uspešno kreiran!');
            this.objectForm.reset();
            this.previewImage = null;
            this.router.navigate(['/object']);
            this.notificationService.notify({ message:'Object added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
          },
          error: () => {
            console.log('Došlo je do greške prilikom kreiranja objekta.');
            this.notificationService.notify({ message:'Failed to add object. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
          }
        });
      });



      /*---------------------Kraj------------------------*/

      
    } else {

      // alert('Molimo vas da popunite sva polja ispravno.');
      this.notificationService.notify({ message:'Please fill in all fields correctly.', duration: 3000, notificationType: NotificationType.INFO });
    }
  }

  onKeyPointSelected(event: { latitude: number, longitude: number }): void {
    // Pristup prosleđenim parametrima (latitude i longitude)
    this.latitude = event.latitude;
    this.longitude = event.longitude;
    
    // Sada možeš raditi nešto sa prosleđenim koordinatama
    console.log('Odabrana tačka:', this.latitude, this.longitude);
  }


}
