import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../model/tour.model';
import { TransportType } from '../model/transportInfo.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  tags: string[] = [];  
  newTag: string = '';  

  constructor(
    private service: TourAuthoringService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['tour']) {
        const tour = JSON.parse(params['tour']);
        this.tour = tour;
        this.shouldEdit = true;
        this.tourForm.patchValue(this.tour);
        this.tags = this.tour.tags || [];
      }
    });
  }
  
  ngOnChanges(): void {
    console.log('ngOnChanges triggered:', this.shouldEdit, this.tour);
  
    if (this.shouldEdit && this.tour) {
      this.tourForm.patchValue(this.tour);
      this.tags = this.tour.tags || [];
    } else {
      this.tourForm.reset();
    }
  }
  

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficulty: new FormControl(0, [Validators.required]),
    tags: new FormControl<string[]>([], []),  
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    transportType: new FormControl(TransportType.Car, [Validators.required]),
  });

  
  addTag(): void {
    if (this.newTag.trim()) { 
      this.tags.push(this.newTag.trim());  
      this.newTag = '';  
    }
  }


  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);  
    }
  }


  addTour(): void {
    const loggedInUser = this.authService.user$.value;
    const tour: Tour = {
      name: this.tourForm.value.name || '',
      description: this.tourForm.value.description || '',
      difficulty: Number(this.tourForm.value.difficulty) || 0,
      tags: this.tags,  
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

  updateTour(): void {
    const updatedTour: Tour = {
      ...this.tour, 
      name: this.tourForm.value.name || this.tour.name,
      description: this.tourForm.value.description || this.tour.description,
      difficulty: Number(this.tourForm.value.difficulty) || this.tour.difficulty,
      tags: this.tags, 
      price: this.tourForm.value.price || this.tour.price,
      transportInfo: {
        ...this.tour.transportInfo,
        transport: this.tourForm.value.transportType as TransportType,
      },
    };
  
    console.log('Tour to be updated:', updatedTour);
  
    this.service.updateTour(updatedTour).subscribe({
      next: () => {
        this.tourUpdated.emit(); 
        this.router.navigate(['/tours']);
        this.snackBar.open('Tour updated successfully!', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
      error: (err) => {
        console.error('Error updating tour:', err);
        this.snackBar.open('Failed to update tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
    });
  }
  
}
