import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Object } from '../model/object.model'
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'xp-object-form',
  templateUrl: './object-form.component.html',
  styleUrls: ['./object-form.component.css']
})
export class ObjectFormComponent {

  imageId:Number;
  selectedFile: File;
  previewImage: string | null = null

  constructor(private service: TourAuthoringService, private imageService: ImageService) { }

  objectForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    category: new FormControl(0, [Validators.required])
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
        longitude:25,
        latitude: 25,
        imageId: -1,
        image:""
      };
      /*----------------Dio 2 za upload slike---------------*/
      this.imageService.uploadImage(this.selectedFile).subscribe((imageId: number) => {
        this.imageService.getImage(imageId);
        object.imageId=imageId;
        this.service.addObject(object).subscribe({
          next: () => {
            alert('Objekat uspešno kreiran!');
            this.objectForm.reset();
            this.previewImage = null;
          },
          error: () => {
            alert('Došlo je do greške prilikom kreiranja objekta.');
          }
        });
      });



      /*---------------------Kraj------------------------*/

      
    } else {

      alert('Molimo vas da popunite sva polja ispravno.');
    }
  }


}
