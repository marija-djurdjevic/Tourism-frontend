import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  tours: Tour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;

  constructor(private service: TourAuthoringService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getTours();
  }

  getTours(): void {
    this.authService.user$.subscribe((loggedInUser) => {
      if (loggedInUser && loggedInUser.role === 'author') {
        this.service.getToursByAuthorId(loggedInUser.id).subscribe({
          next: (result: Tour[]) => {
            this.tours = result;
          },
          error: () => {
          }
        });
      } else {
        this.service.getTours().subscribe({
          next: (result: PagedResults<Tour>) => {
            this.tours = result.results;
          },
          error: () => {
          }
        });
      }
    });
  }

  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Medium';
      case 2:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }

  onAddClicked(): void {
    this.router.navigate(['/add-tour']);
  }

  onAddKeyPoint(tourId: number) {
    this.router.navigate(['/key-points-form', tourId]); 
  }

  onShowKeyPoints(tourId: number) {
    this.router.navigate(['/key-points', tourId]); 
  }

  onPublish(tourId: number): void {
    this.service.publishTour(tourId).subscribe({
      next: (result: Tour) => {
        console.log('Tour published successfully:', result);
        this.getTours(); 
      },
      error: (err) => {
        console.error('Error publishing tour:', err);
      }
    });
  }

  onArchive(tourId: number) {

  }
}
