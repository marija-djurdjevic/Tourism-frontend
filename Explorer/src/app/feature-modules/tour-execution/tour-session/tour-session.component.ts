import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';

@Component({
  selector: 'xp-tour-session',
  templateUrl: './tour-session.component.html',
  styleUrls: ['./tour-session.component.css']
})
export class TourSessionComponent implements OnInit {
  tourId: number;
  location: Location = { latitude: 0, longitude: 0 };
  tourStarted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tourExecutionService: TourExecutionService
  ) {}

  ngOnInit(): void {
    
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
    this.startTour();
  }


  onLocationReceived(location: Location): void {
   
    this.location = location;
    console.log('Koordinate primljene u TourSessionComponent:', this.location);
  }



  startTour(): void {
    if (this.location.latitude && this.location.longitude && this.tourId) {
      this.tourExecutionService.startTour(this.tourId, this.location.latitude, this.location.longitude).subscribe({
        next: (result) => {
          if (result) {
            this.tourStarted = true;
            console.log('Tura je uspešno započeta!');
          } else {
            alert('Tura nije mogla biti započeta.');
          }
        },
        error: () => {
          alert('Došlo je do greške prilikom pokretanja ture.');
        }
      });
    } else {
      console.warn('Lokacija ili tourId nisu dostupni za startovanje ture.');
    }
  }



  abandonTour(): void {
    this.tourExecutionService.abandonTour(this.tourId).subscribe({
      next: (result) => {
        if (result) {
          this.tourStarted = false;
          console.log('Tura je napuštena!');
        } else {
          alert('Tura nije mogla biti napuštena.');
        }
      },
      error: () => {
        alert('Došlo je do greške prilikom napuštanja ture.');
      }
    });
  }


}
