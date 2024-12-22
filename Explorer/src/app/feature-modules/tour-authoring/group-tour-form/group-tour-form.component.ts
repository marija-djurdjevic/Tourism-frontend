import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupTour, ProgressStatus } from '../model/group-tour.model'; 
import { TransportType } from '../model/transportInfo.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-group-tour-form',
  templateUrl: './group-tour-form.component.html',
  styleUrls: ['./group-tour-form.component.css'],
})
export class GroupTourFormComponent implements OnChanges {
  @Output() groupTourUpdated = new EventEmitter<null>();
  @Input() groupTour: GroupTour;
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
        const groupTour = JSON.parse(params['tour']);
        
        
        const patchedGroupTour = {
          ...groupTour,
          startTime: groupTour.startTime ? new Date(groupTour.startTime).toISOString() : '', // ISO string za kompatibilnost
        };
  
        this.groupTour = groupTour;
        this.shouldEdit = true;
        this.groupTourForm.patchValue(patchedGroupTour); 
        this.tags = groupTour.tags || [];
      }
    });
  }
  

  ngOnChanges(): void {
    console.log('ngOnChanges triggered:', this.shouldEdit, this.groupTour);
  
    if (this.shouldEdit && this.groupTour) {
      const patchedGroupTour = {
        ...this.groupTour,
        startTime: this.groupTour.startTime?.toISOString(), // Konvertovanje Date u ISO string
      };
  
      this.groupTourForm.patchValue(patchedGroupTour);
      this.tags = this.groupTour.tags || [];
    } else {
      this.groupTourForm.reset();
    }
  }
  

  groupTourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficulty: new FormControl(0, [Validators.required]),
    tags: new FormControl<string[]>([], []),
    price: new FormControl(0, [Validators.required]),
    transportType: new FormControl(TransportType.Car, [Validators.required]),
    touristNumber: new FormControl(0, [Validators.required, Validators.min(1)]),
    startTime: new FormControl('', [Validators.required]),
    duration: new FormControl(0),
    progress: new FormControl(ProgressStatus.Scheduled, [Validators.required])
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

  addGroupTour(): void {
    const loggedInUser = this.authService.user$.value;
    const groupTour: GroupTour = {
      name: this.groupTourForm.value.name || '',
      
      description: this.groupTourForm.value.description || '',
      difficulty: Number(this.groupTourForm.value.difficulty) || 0,
      tags: this.tags,
      price: 0,
      touristNumber: this.groupTourForm.value.touristNumber || 0,
      startTime: new Date(this.groupTourForm.value.startTime || Date.now()),
      duration: this.groupTourForm.value.duration || 0,
      progress: 0,
      status: 0,
      averageScore: 0,
      transportInfo: {
        time: 0,
        distance: 0,
        transport: this.groupTourForm.value.transportType as TransportType,
      },
      keyPoints: [],
      reviews: [],
      authorId: loggedInUser.id,
      isGroupTour: true
    };

    console.log('Group Tour to be added:', groupTour);

    this.service.addGroupTour(groupTour).subscribe({
      next: () => {
        this.groupTourUpdated.emit();
        this.router.navigate(['/group-tours']);
        this.snackBar.open('Group Tour created successfully!', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
      error: (err) => {
        console.error('Error adding group tour:', err);
        this.snackBar.open('Failed to create group tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
    });
  }

  updateGroupTour(): void {
    const updatedGroupTour: GroupTour = {
      ...this.groupTour,
      name: this.groupTourForm.value.name || this.groupTour.name,
      description: this.groupTourForm.value.description || this.groupTour.description,
      difficulty: Number(this.groupTourForm.value.difficulty) || this.groupTour.difficulty,
      tags: this.tags,
      isGroupTour: true,
      price: this.groupTourForm.value.price || this.groupTour.price,
      touristNumber: this.groupTourForm.value.touristNumber || this.groupTour.touristNumber,
      startTime: new Date(this.groupTourForm.value.startTime || this.groupTour.startTime),
      duration: this.groupTourForm.value.duration || this.groupTour.duration,
      progress: this.groupTourForm.value.progress || this.groupTour.progress,
      transportInfo: {
        ...this.groupTour.transportInfo,
        transport: this.groupTourForm.value.transportType as TransportType,
      },
    };

    console.log('Group Tour to be updated:', updatedGroupTour);

    this.service.updateGroupTour(updatedGroupTour).subscribe({
      next: () => {
        this.groupTourUpdated.emit();
        this.router.navigate(['/tours']);
        this.snackBar.open('Group Tour updated successfully!', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
      error: (err) => {
        console.error('Error updating group tour:', err);
        this.snackBar.open('Failed to update group tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'succesful',
        });
      },
    });
  } 
}
