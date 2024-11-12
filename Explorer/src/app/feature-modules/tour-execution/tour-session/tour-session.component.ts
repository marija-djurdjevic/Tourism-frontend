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
    this.updateSession()
   
  }


  onLocationReceived(location: Location): void {
   
    this.location = location;
    console.log('Koordinate primljene u TourSessionComponent:', this.location);
    
    this.updateLocation();
    this.updateSession();
 
  }


  abandonTour(): void {
    this.tourExecutionService.abandonTour(this.tourId).subscribe({
      next: (result) => {
        if (result) {
          this.tourStarted = false;
          console.log('Tura je napuštena!');
          window.location.href = 'http://localhost:4200/tourList';
        } else {
          alert('Tura nije mogla biti napuštena.');
        }
      },
      error: () => {
        alert('Došlo je do greške prilikom napuštanja ture.');
      }
    });
  }


  updateLocation(): void {
    this.tourExecutionService.updateLocation(this.tourId, this.location.latitude, this.location.longitude).subscribe({
      next: (isNear) => {
        if (isNear) {
          console.log('Nalazite se u blizini ključne tačke ture.');
          window.location.href = 'http://localhost:4200/tourList';
        } else {
          console.log('Niste u blizini ključne tačke.');
        }
      },
      error: () => {
        console.warn('Došlo je do greške prilikom ažuriranja lokacije.');
      }
    });
  }
  

  updateSession(): void {
    this.tourExecutionService.updateSession(this.tourId, this.location.latitude, this.location.longitude).subscribe({
      next: () => {
        console.log('Sesija uspešno ažurirana.');
      },
      error: () => {
        console.warn('Došlo je do greške prilikom ažuriranja sesije.');
      }
    });
  }



  







}
