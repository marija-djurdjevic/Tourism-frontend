import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyPointService } from '../key-point.service';
import { KeyPoint } from '../model/key-point.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Map, Marker } from 'leaflet';
import * as L from 'leaflet';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-key-point-update-form',
  templateUrl: './key-point-update-form.component.html',
  styleUrls: ['./key-point-update-form.component.css']
})
export class KeyPointUpdateFormComponent implements OnInit {
  selectedKeyPoint: KeyPoint = {
    tourIds: [],
    name: '',
    description: '',
    imagePath: '',
    latitude: 0,
    longitude: 0,
    status: 1
};
private map: Map;

constructor(
  private route: ActivatedRoute,
  private keyPointService: KeyPointService,
  private notificationService: NotificationService,
  private router: Router
) {}

ngOnInit(): void {
  const keyPointId = Number(this.route.snapshot.paramMap.get('id'));
  if (keyPointId) {
    this.getKeyPointById(keyPointId);
  }
  this.initializeMap();
}
ngOnDestroy() {
  // Uništavanje mape pri uništavanju komponente
  if (this.map) {
    this.map.remove();
  }
}

initializeMap() {
  // Ako mapa već postoji, prvo je ukloni
  if (this.map) {
    this.map.remove();
  }

  // Inicijalizuj novu mapu
  this.map = L.map('mapid').setView([51.505, -0.09], 13); // Postavi poziciju i zoom nivo

  // Dodaj Tile Layer (kartu)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

  // Dodaj marker (ako je potrebno)
  L.marker([51.5, -0.09]).addTo(this.map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();
}
onImageSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedKeyPoint.imagePath = reader.result as string; 
    };
    reader.readAsDataURL(file); 
  }
}

getKeyPointById(id: number): void {
  this.keyPointService.getKeyPoints().subscribe({
    next: (keyPoints) => {
      const keyPoint = keyPoints.find(kp => kp.id === id); 
      if (keyPoint) {
        this.selectedKeyPoint = keyPoint; 
      } else {
        console.error('Ključna tačka sa ovim ID-om nije pronađena.');
        this.notificationService.notify({ message:'Key point not found.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    },
    error: (error) => {
      console.error('Greška prilikom dobavljanja ključnih tačaka:', error);
      this.notificationService.notify({ message:'Failed to load key points. Please try again.', duration: 3000, notificationType: NotificationType.ERROR });
    }
  });
}

onUpdateKeyPoint(): void {
  this.keyPointService.updateKeyPoint(this.selectedKeyPoint.id!, this.selectedKeyPoint).subscribe({
    next: (updatedKeyPoint) => {
      console.log("Ključna tačka je uspešno ažurirana:", updatedKeyPoint);
      this.notificationService.notify({ message:'Key point updated successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      
    },
    error: (error) => {
      console.error("Greška prilikom ažuriranja ključne tačke: ", error);
      this.notificationService.notify({ message:'Failed to update key point. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
    }
  });
}
onKeyPointSelected(event: { latitude: number, longitude: number }): void {
  
  this.selectedKeyPoint.latitude = event.latitude;
  this.selectedKeyPoint.longitude = event.longitude;
  
  console.log('Odabrana tačka:', this.selectedKeyPoint.latitude, this.selectedKeyPoint.longitude);
}
}

