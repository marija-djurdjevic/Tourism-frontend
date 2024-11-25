import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoading=false;

  constructor(private service: TourAuthoringService,private snackBar:MatSnackBar, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.getTours();
  }

  getTours(): void {
    this.isLoading=true;
    this.authService.user$.subscribe((loggedInUser) => {
      if (loggedInUser && loggedInUser.role === 'author') {
        this.service.getToursByAuthorId(loggedInUser.id).subscribe({
          next: (result: PagedResults<Tour>) => {
            console.log(result);
            this.tours = result.results;
            this.isLoading=false;
          },
          error: () => {
            this.isLoading=false;
            this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
          }
        });
      } else {
        this.service.getTours().subscribe({
          next: (result: PagedResults<Tour>) => {
            this.tours = result.results;
            this.isLoading=false;
          },
          error: () => {
            this.isLoading=false;
            this.snackBar.open('Failed to load tours. Please try again.', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
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


  onPublish(tour: Tour): void {
    this.service.publishTour(tour).subscribe({

      next: (result: Tour) => {
        console.log('Tour published successfully:', result);
        this.getTours(); 
        this.snackBar.open('Tour published successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error publishing tour:', err);
        this.snackBar.open('Failed to publish tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  onArchive(tour: Tour) {
    this.service.archiveTour(tour).subscribe({
      next: (result: Tour) => {
        console.log('Tour published successfully:', result);
        this.getTours(); 
        this.snackBar.open('Tour archived successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error publishing tour:', err);
        this.snackBar.open('Failed to publish tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }

  onEdit(tour: Tour) {
    this.shouldEdit = true;
    this.selectedTour = tour;
    this.router.navigate(['/add-tour'], {
      queryParams: {
        tour: JSON.stringify({
          id: tour.id,
          name: tour.name,
          description: tour.description, 
          difficulty: tour.difficulty,
          tags: tour.tags,
          status: tour.status,
          price: tour.price,
          publishedAt: tour.publishedAt,
          archivedAt: tour.archivedAt,
          avarageScore: tour.averageScore,
          authorId: tour.authorId,
          transportInfo: tour.transportInfo,
          keyPoints: tour.keyPoints,
          reviews: tour.reviews,
          reviewStatus: tour.reviewStatus
        })
      }
    })
  }
}
