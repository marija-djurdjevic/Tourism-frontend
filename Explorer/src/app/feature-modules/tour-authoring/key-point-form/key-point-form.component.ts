import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyPointService } from '../key-point.service'; 
import { TourAuthoringService } from '../tour-authoring.service'; 
import { KeyPoint } from '../model/key-point.model';
import { Tour } from '../model/tour.model';
import { TransportInfo, TransportType } from '../model/transportInfo.model';

@Component({
  selector: 'xp-key-point-form',
  templateUrl: './key-point-form.component.html',
  styleUrls: ['./key-point-form.component.css']
})
export class KeyPointFormComponent implements OnInit {
  tourId: number;
  newKeyPoint: KeyPoint; 
  transportType: 'walking' | 'driving' | 'cycling'; 
  tour: Tour;
  imagePath: string | ArrayBuffer | null;



  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result; 
        this.newKeyPoint.imagePath = this.imagePath as string; 
      };
      reader.readAsDataURL(file); 
    }
  }

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService, private tourService: TourAuthoringService, private router: Router) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); 
    
    this.resetForm(); 
    this.loadTour();
    
  }

 loadTour() {
    this.tourService.getKeyPointsByTourId(this.tourId).subscribe(tour => {
      this.tour = tour; 
      
    });
    
  }

  resetForm() {
    this.newKeyPoint = { tourId: this.tourId, name: '', description: '', imagePath: '', longitude: 0, latitude: 0 }; // Reset forme
  }

  onAddKeyPoint() {
    this.keyPointService.getKeyPoints().subscribe({
      next: (allKeyPoints) => {
       
        const keyPointsForTour = allKeyPoints.filter(kp => kp.tourId === this.tourId);
  
       
        keyPointsForTour.push(this.newKeyPoint);
  
       const latlngs: [number, number][] = keyPointsForTour.length > 1 
          ? keyPointsForTour.map(kp => [kp.longitude, kp.latitude] as [number, number])
          : [[this.newKeyPoint.longitude, this.newKeyPoint.latitude]];
        console.log("Koordinate svih tačaka:", latlngs);
  
        const distance = keyPointsForTour.length > 1 
          ? this.tourService.calculateDistance(latlngs) 
          : 0;

        console.log("Ukupna udaljenost:", distance);
        const transportEnum = this.tour.transportInfo.transport;
        const time = keyPointsForTour.length > 1 
          ? this.tourService.calculateTime(distance, transportEnum) 
          : 0;
        console.log("Ukupno vreme:", time);
        const transportInfo: TransportInfo = {
          transport: transportEnum,
          distance: Math.round(distance * 100) / 100,
          time: Math.floor(time)
        };
  
        this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
          next: (keyPoint) => {
            
            alert(`Uspješno dodata ključna tačka! Izračunata distanca: ${distance.toFixed(2)} km, Vreme: ${time.toFixed(0)} minuta.`);
            this.resetForm();
  
            this.tourService.updateTransportInfo(this.tourId, transportInfo).subscribe({
              next: () => {
                console.log('Transport info ažuriran uspešno.');
              },
              error: (error) => {
                console.error("Greška prilikom ažuriranja transport informacija: ", error);
                alert('Došlo je do greške prilikom ažuriranja informacija o transportu.');
              }
            });
          },
          error: (error) => {
            console.error("Greška prilikom dodavanja ključne tačke: ", error);
            console.error("Detaljne greške: ", error.error.errors);
          }
        });
      },
      error: (error) => {
        console.error("Greška prilikom učitavanja ključnih tačaka: ", error);
      }
    });
  }
  
  
  

  mapTransportType(type: 'walking' | 'driving' | 'cycling'): TransportType {
    switch (type) {
      case 'driving':
        return TransportType.Car;
      case 'walking':
        return TransportType.Walk;
      case 'cycling':
        return TransportType.Bicycle;
      default:
        throw new Error("Nepoznat tip transporta");
    }
  }

  onKeyPointSelected(event: { latitude: number, longitude: number }): void {
   
    this.newKeyPoint.latitude = event.latitude;
    this.newKeyPoint.longitude = event.longitude;
    
    console.log('Odabrana tačka:', this.newKeyPoint.latitude, this.newKeyPoint.longitude);
  }

  updateTransportInfo(distance: number, time: number) {
    const transportInfo: TransportInfo = {
      transport: this.tour.transportInfo.transport,
      distance: distance,
      time: time
  };
    console.log('Šaljem transport info:', transportInfo);
    this.tourService.updateTransportInfo(this.tourId, transportInfo).subscribe({
        next: () => {
            console.log('Transport info ažuriran uspešno.');
        },
        error: (error) => {
            console.error("Greška prilikom ažuriranja transport informacija: ", error);
            alert('Došlo je do greške prilikom ažuriranja informacija o transportu.');
        }
    });
  }
  
}
