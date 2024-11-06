import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnChanges {
  @Output() fileSelected: EventEmitter<File> = new EventEmitter<File>();
  @Output() addedFiles: EventEmitter<File[]> = new EventEmitter<File[]>();
  imageUrl: string | null = null;
  imageSrcs: string[] = [];
  showingImage: string | ArrayBuffer | null = null;;
  @Input() selectSingle: boolean = true;
  @Input() imagesToShow: string = ''

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imagesToShow']) {
      this.showImages()
    }
  }

  showImages() {
    if (this.imagesToShow !== '') {
      this.imageSrcs = []
      for (var imageId of this.imagesToShow.split(',')) {
        this.loadImage(Number(imageId).valueOf());
      }
    }
  }

  ngOnInit(): void {
    this.showImages();
  }

  constructor(private imageService: ImageService) { 
    imageService.setControllerPath('tourist/image')
  }
  imageSrc: string | ArrayBuffer | null = null;
  index: number = 0;

  NextImage() {
    this.showingImage = this.imageSrcs[++this.index % this.imageSrcs.length]
  }
  PreviousImage() {
    this.index = (this.index - 1 + this.imageSrcs.length) % this.imageSrcs.length;
    this.showingImage = this.imageSrcs[this.index];
  }

  onFileSelected(event: any) {
    var allFiles: File[] = [];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.selectSingle) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imageSrc = reader.result;
      };

      reader.readAsDataURL(file); // Pretvori fajl u Base64 format
      this.fileSelected.emit(file);
    }
    if (input.files && !this.selectSingle) {
      this.imageSrcs = [];
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            this.imageSrcs.push(reader.result as string);
            this.showingImage = this.imageSrcs[0];
          }
        };
        reader.readAsDataURL(file);
        allFiles.push(file);
      });
      this.addedFiles.emit(allFiles);
    }
  }

  loadImage(imageId: number) {
    this.imageService.getImage(imageId).subscribe((blob: Blob) => {
      this.imageSrcs.push(URL.createObjectURL(blob));
      this.showingImage = this.imageSrcs[0];
    });
  }
}
