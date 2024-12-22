import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyPointService } from '../../key-point.service'; 
import { KeyPoint } from '../../model/key-point.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WeatherService } from '../../weather-service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-key-point',
  templateUrl: './key-point.component.html',
  styleUrls: ['./key-point.component.css']
})
export class KeyPointComponent implements OnInit {
  tourId: number;
  keyPoints: KeyPoint[] = [];
  newKeyPoint: KeyPoint; 
  isLoading=false;
  isUpdate: boolean = false;  
  selectedKeyPoint: KeyPoint | null = null;
  currentWeather: any = null;
  cityName = ''

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService,private notificationService:NotificationService,private router:Router,private weatherService: WeatherService) { }


  async ngOnInit(): Promise<void> {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); // Uzimanje tourId iz URL-a
    this.newKeyPoint = { tourIds: [this.tourId], name: '', description: '', imagePath: '', longitude:0, latitude:0, status: 1 }; // Inicijalizacija newKeyPoint
    await this.loadKeyPoints(); // Poziv funkcije za učitavanje ključnih tačaka
    console.log('Final Key Points:', this.keyPoints); // This will log properly now

    if (this.keyPoints.length > 0) {
      this.getCityByCoords(this.keyPoints[0].latitude,this.keyPoints[0].longitude); // Fetch weather only if there are key points
    } else {
      console.warn('No key points found for this tour.');
    }

  }

  onEdit(keyPoint: KeyPoint) {
    console.log("Navigacija ka ruti za editovanje", keyPoint.id);
    this.router.navigate(['/key-points/edit', keyPoint.id]);
  }

  getCityByCoords(latitude:number,longitude:number) : void {
    this.weatherService.getCityByCoords(latitude, longitude).subscribe({
      next: (response) => {
        if (response && response[0]) {
          this.cityName = response[0].name || 'Unknown';
          console.log('City Name:', this.cityName);
          this.getWeatherForCity(this.keyPoints[0])
        }

      },
      error: (err) => {
        console.error('Error fetching city:', err);
      },
    });
  }

  getWeatherForCity(keyPoint: KeyPoint): void {
    this.weatherService
          .getWeatherByCoords(keyPoint.latitude, keyPoint.longitude) // Use latitude and longitude
          .subscribe({
            next: (weather) => {
              this.currentWeather = weather
              this.currentWeather.sunset = this.convertUnixToGMT1(this.currentWeather.sunset)
              this.currentWeather.sunrise = this.convertUnixToGMT1(this.currentWeather.sunrise)
            },
            error: (err) => console.error('Error fetching weather:', err),
          });
      };
  

  getWeatherIcon(temp: number): string {
    if (temp < 0) return 'snow'; // Snow icon for temperatures below 0°C
    if (temp >= 0 && temp <= 15) return 'cloudy'; // Cloudy for cooler weather
    if (temp > 15) return 'sun'; // Sun for warmer weather
    return 'default'; // Default icon
  }
  
  
  convertUnixToGMT1(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const gmt1Date = new Date(date.getTime() + 1 * 60 * 60 * 1000); // Add 1 hour for GMT+1
    return gmt1Date.toTimeString().slice(0, 5);
  }
  /*loadKeyPoints() {
    this.isLoading=true;
    this.keyPointService.getKeyPoints().subscribe({
      next:(keyPoints) =>{
        console.log('Vraćeni keyPoints:', keyPoints); 
        this.keyPoints = keyPoints.filter(kp => kp.tourIds.includes(this.tourId)); // Filtriranje po tourId
        console.log('Filtrirane ključne tačke: ', this.keyPoints); 
        this.isLoading=false;
      },
      error:(err: any) => {
        console.log(err);
        this.isLoading=false;
        this.notificationService.notify({ message:'Failed to load data. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }*/
    loadKeyPoints(): Promise<void> {
      return new Promise((resolve, reject) => {
        this.isLoading = true;
    
        this.keyPointService.getKeyPoints().subscribe({
          next: (keyPoints) => {
            this.keyPoints = keyPoints.filter(
              (kp) =>
                Array.isArray(kp.tourIds) &&
                kp.tourIds.includes(this.tourId) &&
                (kp.status === 1 || kp.status === 2)
            );
    
            console.log('Loaded Key Points:', this.keyPoints);
            this.isLoading = false;
            resolve(); // Resolve the promise when key points are loaded
          },
          error: (err: any) => {
            console.error('Error loading key points:', err);
            this.isLoading = false;
            this.notificationService.notify({ message:'Failed to load key points. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
            reject(err); // Reject the promise in case of error
          },
        });
      });
    }
    
    

  onAddKeyPoint() {
    if (!this.newKeyPoint.tourIds.includes(this.tourId)) {
      this.newKeyPoint.tourIds.push(this.tourId);
    }
    this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
      next: (keyPoint) => {
        this.keyPoints.push(keyPoint);
        this.newKeyPoint = { tourIds: [this.tourId], name: '', description: '', imagePath: '', latitude: 0, longitude: 0, status: 1 }; // Reset forme
        this.notificationService.notify({ message:'Key point added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (error) => {
        console.error("Greška prilikom dodavanja ključne tačke: ", error); 
        console.error("Detaljne greške: ", error.error.errors); 
        this.notificationService.notify({ message:'Failed to add key point. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  onDelete(keyPointId: number) {
    console.log('Deleting key point with ID:', keyPointId);
    this.keyPointService.deleteKeyPoint(keyPointId).subscribe(response => {
      console.log('Deleted key point:', response);
      this.keyPoints = this.keyPoints.filter(k => k.id !== keyPointId); 
    });
  }
    
  onUpdateKeyPoint() {
    if (this.selectedKeyPoint && this.selectedKeyPoint.id !== undefined) {
      // Pozivanje servisa sa id-jem i podacima o ključnoj tački
      this.keyPointService.updateKeyPoint(this.selectedKeyPoint.id, this.selectedKeyPoint).subscribe({
        next: (updatedKeyPoint) => {
          // Ažuriranje u lokalnoj listi
          const index = this.keyPoints.findIndex(kp => kp.id === updatedKeyPoint.id);
          if (index !== -1) {
            this.keyPoints[index] = updatedKeyPoint;
          }
          this.isUpdate = false;  // Resetovanje stanja za ažuriranje
          this.selectedKeyPoint = null;  // Resetovanje selektovane tačke
          this.notificationService.notify({ message:'Key point updated successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
        },
        error: (error) => {
          console.error("Greška prilikom ažuriranja ključne tačke: ", error);
          this.notificationService.notify({ message:'Failed to update key point. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
        }
      });
    } else {
      this.notificationService.notify({ message:'Key point ID is missing!', duration: 3000, notificationType: NotificationType.WARNING });
    }
  }
  




  addEncounter(id:number|undefined){
    this.router.navigate(['/add-encounter',id]);
  }

  
}
