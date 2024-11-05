import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent implements OnChanges {

  @Output() tourUpdated = new EventEmitter<null>();
  @Input() tour: Tour;
  @Input() shouldEdit: boolean = false;

  constructor(private service: TourAuthoringService, private authService: AuthService, private router: Router) {
}

  ngOnChanges(): void {
    this.tourForm.reset();
    if(this.shouldEdit) {
      this.tourForm.patchValue(this.tour);
    }
  }

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    difficulty: new FormControl(0, [Validators.required]), 
    tags: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(0)]) 
  });

  addTour(): void {
    const loggedInUser = this.authService.user$.value; 
  const tour: Tour = {
    name: this.tourForm.value.name || "",
    description: this.tourForm.value.description || "",
    difficulty: Number(this.tourForm.value.difficulty) || 0,
    tags: this.tourForm.value.tags || "",
    status: 0,
    price: this.tourForm.value.price || 0,
    authorId: loggedInUser.id || 0,
    transportInfo: {
      time: 0,
      distance: 0,
      transport:  0, 
    },
    keyPoints: [], 
    reviews:[],
    publishedAt: new Date(Date.now()),
    archivedAt: new Date(Date.now()),
    averageScore: 0
    };

  
    console.log('Tour to be added:', tour); 
  
    this.service.addTour(tour).subscribe({
      next: () => { this.tourUpdated.emit();
        this.router.navigate(['/tours']);
       },
      error: (err) => console.error('Error adding tour:', err) 
    });
  }

}
