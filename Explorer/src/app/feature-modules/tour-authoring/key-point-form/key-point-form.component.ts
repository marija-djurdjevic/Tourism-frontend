import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyPointService } from '../key-point.service'; 
import { TourAuthoringService } from '../tour-authoring.service'; 
import { KeyPoint } from '../model/key-point.model';
import { Tour } from '../model/tour.model';
import { TransportInfo, TransportType } from '../model/transportInfo.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Input, Output, EventEmitter } from '@angular/core';

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
  isPublic: Boolean = false;
    

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

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService,private snackBar:MatSnackBar, private tourService: TourAuthoringService, private router: Router) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); 
    
    this.resetForm(); 
    this.loadTour();
    
  }

 loadTour() {
    this.tourService.getKeyPointsByTourId(this.tourId).subscribe( {
      next:(tour)=>{
        this.tour = tour;
      },
      error:(err: any) => {
        console.log(err);
        this.snackBar.open('Failed to load tour data. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
    
  }

  resetForm() {
    this.newKeyPoint = {tourIds:[this.tourId], name: '', description: '', imagePath: '', longitude: 0, latitude: 0, status: 1 }; // Reset forme
  }
  onAddKeyPoint() {
    this.keyPointService.getKeyPoints().subscribe({
      next: (allKeyPoints) => {
        // Ensure tourIds is an array before using .includes()
        const keyPointsForTour = allKeyPoints.filter(kp => Array.isArray(kp.tourIds) && kp.tourIds.includes(this.tourId)) ;
  
        // Add the new key point to the list of key points for the tour
        keyPointsForTour.push(this.newKeyPoint);
  
        // Calculate latlngs for all key points
        const latlngs: [number, number][] = keyPointsForTour.length > 1 
          ? keyPointsForTour.map(kp => [kp.longitude, kp.latitude] as [number, number])
          : [[this.newKeyPoint.longitude, this.newKeyPoint.latitude]];
  
        console.log("Koordinate svih tačaka:", latlngs);
  
        // Calculate the distance
        const distance = keyPointsForTour.length > 1 
          ? this.tourService.calculateDistance(latlngs) 
          : 0;
  
        console.log("Ukupna udaljenost:", distance);
  
        const transportEnum = this.tour.transportInfo.transport;
  
        // Calculate the time
        const time = keyPointsForTour.length > 1 
          ? this.tourService.calculateTime(distance, transportEnum) 
          : 0;
  
        console.log("Ukupno vreme:", time);
  
        const transportInfo: TransportInfo = {
          transport: transportEnum,
          distance: Math.round(distance * 100) / 100,
          time: Math.floor(time)
        };
  
        // Set the status of the key point
        this.newKeyPoint.status = this.isPublic ? 0 : 1;
  
        // Add the new key point
        this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
          next: (keyPoint) => {
            console.log(`Uspješno dodata ključna tačka! Izračunata distanca: ${distance.toFixed(2)} km, Vreme: ${time.toFixed(0)} minuta.`);
            this.resetForm();
            this.snackBar.open('Key point added successfully!', 'Close', {
              duration: 3000,
              panelClass: "succesful"
            });
  
            // Update the transport info
            this.tourService.updateTransportInfo(this.tourId, transportInfo).subscribe({
              next: () => {
                console.log('Transport info ažuriran uspešno.');
                this.snackBar.open('Key point added successfully! and Transport info updated successfully!', 'Close', {
                  duration: 3000,
                  panelClass: "succesful"
                });
              },
              error: (error) => {
                console.error("Greška prilikom ažuriranja transport informacija: ", error);
                this.snackBar.open('Failed to update transport info. Please try again.', 'Close', {
                  duration: 3000,
                  panelClass: "error"
                });
              }
            });
          },
          error: (error) => {
            console.error("Greška prilikom dodavanja ključne tačke: ", error);
            this.snackBar.open('Failed to add key point. Please try again.', 'Close', {
              duration: 3000,
              panelClass: "error"
            });
          }
        });
      },
      error: (error) => {
        console.error("Greška prilikom učitavanja ključnih tačaka: ", error);
        this.snackBar.open('Failed to load key points. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
      }
    });
  }
  
  onUpdateKeyPoint() {
    this.keyPointService.getKeyPoints().subscribe({
      next: (allKeyPoints) => {
        // Ensure tourIds is an array before using .includes()
        const keyPointsForTour = allKeyPoints.filter(kp => Array.isArray(kp.tourIds) && kp.tourIds.includes(this.tourId));
  
        // Add the new key point to the list of key points for the tour
        keyPointsForTour.push(this.newKeyPoint);
  
        // Calculate latlngs for all key points
        const latlngs: [number, number][] = keyPointsForTour.length > 1 
          ? keyPointsForTour.map(kp => [kp.longitude, kp.latitude] as [number, number])
          : [[this.newKeyPoint.longitude, this.newKeyPoint.latitude]];
  
        console.log("Koordinate svih tačaka:", latlngs);
  
        // Calculate the distance
        const distance = keyPointsForTour.length > 1 
          ? this.tourService.calculateDistance(latlngs) 
          : 0;
  
        console.log("Ukupna udaljenost:", distance);
  
        const transportEnum = this.tour.transportInfo.transport;
  
        // Calculate the time
        const time = keyPointsForTour.length > 1 
          ? this.tourService.calculateTime(distance, transportEnum) 
          : 0;
  
        console.log("Ukupno vreme:", time);
  
        const transportInfo: TransportInfo = {
          transport: transportEnum,
          distance: Math.round(distance * 100) / 100,
          time: Math.floor(time)
        };
  
        // Set the status of the key point
        this.newKeyPoint.status = this.isPublic ? 0 : 1;
  
        // Add the new key point
        this.keyPointService.addTourToKeyPoint(this.newKeyPoint, this.tourId).subscribe({
          next: (keyPoint) => {
            console.log(`Uspješno dodata ključna tačka! Izračunata distanca: ${distance.toFixed(2)} km, Vreme: ${time.toFixed(0)} minuta.`);
            this.resetForm();
            this.snackBar.open('Key point added successfully!', 'Close', {
              duration: 3000,
              panelClass: "succesful"
            });
  
            // Update the transport info
            this.tourService.updateTransportInfo(this.tourId, transportInfo).subscribe({
              next: () => {
                console.log('Transport info ažuriran uspešno.');
                this.snackBar.open('Key point added successfully! and Transport info updated successfully!', 'Close', {
                  duration: 3000,
                  panelClass: "succesful"
                });
              },
              error: (error) => {
                console.error("Greška prilikom ažuriranja transport informacija: ", error);
                this.snackBar.open('Failed to update transport info. Please try again.', 'Close', {
                  duration: 3000,
                  panelClass: "error"
                });
              }
            });
          },
          error: (error) => {
            console.error("Greška prilikom dodavanja ključne tačke: ", error);
            this.snackBar.open('Failed to add key point. Please try again.', 'Close', {
              duration: 3000,
              panelClass: "error"
            });
          }
        });
      },
      error: (error) => {
        console.error("Greška prilikom učitavanja ključnih tačaka: ", error);
        this.snackBar.open('Failed to load key points. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
      }
    });
  }
  

 /* onAddKeyPoint() {
    this.keyPointService.getKeyPoints().subscribe({
      next: (allKeyPoints) => {
       
        const keyPointsForTour = allKeyPoints.filter(kp => kp.tourIds.includes(this.tourId));
  
       
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
        if(this.isPublic)
        {
          this.newKeyPoint.status = 0;
        }
        else
        {
          this.newKeyPoint.status = 1;
        }
       
        this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
          next: (keyPoint) => {
            
            console.log(`Uspješno dodata ključna tačka! Izračunata distanca: ${distance.toFixed(2)} km, Vreme: ${time.toFixed(0)} minuta.`);
            this.resetForm();
            this.snackBar.open('Key point added successfully!', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
  
            this.tourService.updateTransportInfo(this.tourId, transportInfo).subscribe({
              next: () => {
                console.log('Transport info ažuriran uspešno.');
                this.snackBar.open('Key point added successfully! and Transport info updated successfully!', 'Close', {
                  duration: 3000,
                  panelClass:"succesful"
                });
              },
              error: (error) => {
                console.error("Greška prilikom ažuriranja transport informacija: ", error);
                console.error('Došlo je do greške prilikom ažuriranja informacija o transportu.');
                this.snackBar.open('Failed to load key point. Please try again.', 'Close', {
                  duration: 3000,
                  panelClass:"succesful"
                });
              }
            });
          },
          error: (error) => {
            console.error("Greška prilikom dodavanja ključne tačke: ", error);
            console.error("Detaljne greške: ", error.error.errors);
            this.snackBar.open('Failed to add key point. Please try again.', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
          }
        });
      },
      error: (error) => {
        console.error("Greška prilikom učitavanja ključnih tačaka: ", error);
        this.snackBar.open('Failed to add key point. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }*/
  
  
  

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
    if ('name' in event && 'description' in event) {
      const point = event as KeyPoint;
      this.newKeyPoint = point;
      this.onUpdateKeyPoint();
      console.log('Odabrana javna tačka:');
    }else{
    this.newKeyPoint.latitude = event.latitude;
    this.newKeyPoint.longitude = event.longitude;
    
    console.log('Odabrana tačka:', this.newKeyPoint.latitude, this.newKeyPoint.longitude);
    }
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
