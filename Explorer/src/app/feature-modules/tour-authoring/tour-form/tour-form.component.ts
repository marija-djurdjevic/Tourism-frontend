import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../model/tour.model';
import { TransportType } from '../model/transportInfo.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css'],
})
export class TourFormComponent implements OnChanges {
  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;

  public TransportType = TransportType;
  tags: string[] = [];  // Lista tagova koja se dinamički menja
  newTag: string = '';  // Unos novog taga

  constructor(
    private service: TourAuthoringService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges(): void {
    this.tourForm.reset();
    if (this.shouldEdit) {
      this.tourForm.patchValue(this.tour);
      this.tags = this.tour.tags || [];  // Ako postoje tagovi pri editovanju, prikazujemo ih
    }
  }

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficulty: new FormControl(0, [Validators.required]),
    tags: new FormControl<string[]>([], []),  // Tagovi kao niz stringova
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    transportType: new FormControl(TransportType.Car, [Validators.required]),
  });

  // Metoda za dodavanje taga
  addTag(): void {
    if (this.newTag.trim()) {  // Provera da li tag nije prazan
      this.tags.push(this.newTag.trim());  // Dodavanje taga u listu
      this.newTag = '';  // Čišćenje unosa nakon dodavanja
    }
  }

  // Metoda za uklanjanje taga
  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);  // Uklanjanje taga iz liste
    }
  }

  // Metoda za dodavanje ture
  addTour(): void {
    const loggedInUser = this.authService.user$.value;
    const tour: Tour = {
      name: this.tourForm.value.name || '',
      description: this.tourForm.value.description || '',
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      tags: this.tags,  // Prosleđivanje liste tagova
      status: 0,
      price: this.tourForm.value.price || 0,
      authorId: loggedInUser.id || 0,
      transportInfo: {
        time: 0,
        distance: 0,
        transport: this.tourForm.value.transportType as TransportType,
      },
      keyPoints: [],
      reviews: [],
      publishedAt: new Date(Date.now()),
      archivedAt: new Date(Date.now()),
      averageScore: 0,
    };

    console.log('Tour to be added:', tour);

    this.service.addTour(tour).subscribe({
      next: () => {
        this.tourUpdated.emit();
        this.router.navigate(['/tours']);
        this.snackBar.open('Tour created successfully!', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
      error: (err) => {
        console.error('Error adding tour:', err);
        this.snackBar.open('Failed to create tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
    });
  }
}
