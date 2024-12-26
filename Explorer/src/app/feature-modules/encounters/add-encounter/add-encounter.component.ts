import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Encounter } from '../model/encounter.model';
import { Coordinates } from '../model/coordinates.model';
import { ActivatedRoute } from '@angular/router';
import { EncounterService } from '../encounter.service';
import { ImageService } from 'src/app/shared/image.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { range } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-add-encounter',
  templateUrl: './add-encounter.component.html',
  styleUrls: ['./add-encounter.component.css']
})
export class AddEncounterComponent implements OnInit {
  @Input() createdByTourist: boolean = false;
  @Input() inputKeyPoint: number= -110;

  keyPointId: number;
  encounterForm: FormGroup;
  selectedCategory: number = 0;
  encounter: Encounter;
  selectedFile: File;
  coordinates: Coordinates = { latitude: 0, longitude: 0 };

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private notificationService:NotificationService, private service: EncounterService, private imageService: ImageService) {
    if (this.createdByTourist) {
      this.imageService.setControllerPath("tourist/image");
    } else {
      imageService.setControllerPath("author/image");
    }
    this.encounterForm = this.fb.group({
      category: [0, Validators.required], // Podrazumevano postavljeno na 0 i dodan validator
      name: ['', Validators.required],
      description: ['', Validators.required],
      longitude: [this.coordinates.longitude, Validators.required],
      latitude: [this.coordinates.latitude, Validators.required],
      range: [null, [Validators.required, Validators.min(10)]],
      xp: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      touristsNumber: [null, [Validators.required, Validators.min(2)]],
      creator: [false, []]
    });
  }

  ngOnInit(): void {
    this.keyPointId = +this.route.snapshot.paramMap.get('id')!;
    if(this.inputKeyPoint!=-110){
      this.keyPointId = this.inputKeyPoint;
    }

    this.encounter = {
      id: 0,
      userId: 0,
      keyPointId: 0,
      name: '',
      description: '',
      xp: 0,
      coordinates: this.coordinates,
      status: 0,
      type: 0,
      creator: 0,
    };
  }

  onCategoryChange(): void {
    this.selectedCategory = +this.encounterForm.get('category')?.value;

    // Resetovanje opcionalnih polja na osnovu kategorije
    if (this.selectedCategory === 0) {
      this.encounterForm.patchValue({ name: '', description: '', range: null, touristsNumber: null });
    } else if (this.selectedCategory === 3) {
      this.encounterForm.patchValue({ name: '', description: '' });
    } else {
      this.encounterForm.patchValue({ name: null, description: null, range: null, selectedFile: undefined, longitude: 0, latitude: 0, touristsNumber: null });
    }
  }

  onSubmit(): void {
    if (this.encounterForm.get('category')?.value == 1) {
      this.encounterForm.patchValue({
        range: 20,
        touristsNumber: 20
      });
    } else if (this.encounterForm.get('category')?.value == 3) {
      this.encounterForm.patchValue({
        range: 20,
        touristsNumber: 20
      });
    }
    if (this.encounterForm.invalid || (this.encounterForm.get('category')?.value == 1 && this.selectedFile === undefined)) {
      this.encounterForm.markAllAsTouched();
      if (this.encounterForm.get('category')?.value == 1 && this.selectedFile === undefined) {
        this.notificationService.notify({ message:'Please select an image.', duration: 3000, notificationType: NotificationType.INFO });
      }
      return;
    }

    this.encounter.userId = 0;
    this.encounter.keyPointId = this.keyPointId;
    this.encounter.xp = 50;
    this.encounter.status = 1;
    this.encounter.creator = 1;

    this.encounter.type = parseInt(this.encounterForm.get('category')?.value);
    this.encounter.name = this.encounterForm.get('name')?.value;
    this.encounter.description = this.encounterForm.get('description')?.value;
    this.encounter.range = parseInt(this.encounterForm.get('range')?.value);
    this.encounter.xp = parseInt(this.encounterForm.get('xp')?.value);
    this.encounter.touristNumber = parseInt(this.encounterForm.get('touristsNumber')?.value);
    this.encounter.creator = this.encounterForm.get('creator')?.value ? 0 : 1;
    this.encounter.coordinates.latitude = parseFloat(this.encounterForm.get('latitude')?.value);
    this.encounter.coordinates.longitude = parseFloat(this.encounterForm.get('longitude')?.value);

    console.log('location:', this.encounter.coordinates);

    console.log('Payload being sent:', this.encounter);
    if (this.encounter.type == 1) {
      /*----------------Dio 2 za upload slike---------------*/
      if (this.createdByTourist) {
        this.imageService.setControllerPath("tourist/image");
      } else {
        this.imageService.setControllerPath("author/image");
      }
      this.imageService.uploadImage(this.selectedFile).subscribe((imageId: number) => {
        this.imageService.getImage(imageId);
        this.encounter.imagePath = imageId;
        this.addEncounter(this.encounter);
      });

      /*---------------------Kraj------------------------*/
    } else {
      this.addEncounter(this.encounter);
    }
  }

  addEncounter(encounter: Encounter): void {
    this.service.addEncounter(encounter,this.createdByTourist?'tourist':'author').subscribe({
      next: (response) => {
        console.log('Added Encounter', response);
        this.notificationService.notify({ message:'Encounter added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: () => {
        console.log('Došlo je do greške prilikom kreiranja encountera.');
        this.notificationService.notify({ message:'Failed to add encounter. Please try again.', duration: 3000, notificationType: NotificationType.ERROR });
      }
    });
  }

  onCreatorChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox is now:', isChecked ? 'AuthorRequired (0)' : 'Author (1)');
  }

  onLocationSelected(event: { latitude: number, longitude: number }): void {
    this.coordinates.latitude = event.latitude;
    this.coordinates.longitude = event.longitude;
    this.encounterForm.patchValue({
      latitude: event.latitude,
      longitude: event.longitude
    });
  }

  /*Dio 1 za upload slika*/
  onFileSelected(file: File): void {
    this.selectedFile = file;  // Čuvanje fajla kada ga child komponenta emituje
    console.log('Selected file:', this.selectedFile);
    this.encounterForm.patchValue({
      imagePath: 1
    });
  }
  /*Kraj*/
}
