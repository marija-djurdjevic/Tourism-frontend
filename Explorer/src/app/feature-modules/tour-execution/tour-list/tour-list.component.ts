import { Component,OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';

@Component({
  selector: 'xp-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css']
})

export class TourListComponent implements OnInit {
  tours: Tour[] = [];
  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;

  constructor(private tourExecutionService: TourExecutionService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTours();
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

  onStartTourSession(tourId: number): void {

    if (tourId) {
      this.tourExecutionService.startTour(tourId, this.location.latitude, this.location.longitude).subscribe({
        next: (result) => {
          if (result) {
            this.tourStarted = true;
            console.log('Tura je uspešno započeta!');
            this.router.navigate(['/tourSession', tourId]);
          } else {
            alert('Tura nije mogla biti započeta.');
          }
        },
        error: () => {
          alert('Došlo je do greške prilikom pokretanja ture.');
          window.location.href = 'http://localhost:4200/tourList';
        }
      });
    } else {
      console.warn('Lokacija ili tourId nisu dostupni za startovanje ture.');
    }
    
   
  }



  getAllTours(): void {
    this.tourExecutionService.getAllTours().subscribe({
      next: (tours) => {
        this.tours = tours;
        console.log('Ture su uspešno učitane:', this.tours);
      },
      error: () => {
        console.error('Došlo je do greške prilikom preuzimanja tura.');
      }
    });
  }
}
