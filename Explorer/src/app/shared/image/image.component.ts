import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {
  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  imageUrl: string | null = null;

  constructor(private imageService: ImageService) {}
  imageSrc: string | ArrayBuffer | null = null;

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = reader.result;
      };

      reader.readAsDataURL(file); // Pretvori fajl u Base64 format
      this.fileSelected.emit(file);
    }
  }

  loadImage(imageId: number) {
    this.imageService.getImage(imageId).subscribe((blob: Blob) => {
      this.imageUrl = URL.createObjectURL(blob);
    });
  }
}
