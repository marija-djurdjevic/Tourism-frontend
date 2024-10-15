import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Router } from '@angular/router';

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

  constructor(private service: TourAuthoringService, private router: Router) { }

  ngOnInit(): void {
    this.getTours();
  }

  getTours(): void {
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
      },
      error: () => {
        this.tours = [{ id: 1, name: "Ime", description: "Opis", difficulty: 1, status: 1, tags: "Neki tagovi", price: 100 }, { id: 2, name: "Ime 2", description: "Opis 2", difficulty: 1, status: 1, tags: "Neki tagovi", price: 100 }]
      }
    })
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
      default:
        return 'Unknown';
    }
  }

  onAddClicked(): void {
    this.router.navigate(['/add-tour']);
  }
}
