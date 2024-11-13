import { Component, EventEmitter, Output,AfterViewInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';
import { Location as routerLocation } from '@angular/common';


@Component({
  selector: 'xp-tourist-location',
  templateUrl: './tourist-location.component.html',
  styleUrls: ['./tourist-location.component.css']
})
export class TouristLocationComponent implements AfterViewInit {
  @Output() locationSelected = new EventEmitter<{ latitude: number, longitude: number }>();
  imageId: Number;
  selectedFile: File;
  previewImage: string | null = null
  location: Location = { latitude: 0, longitude: 0 };
  

  constructor(private service: TourExecutionService,private routerLocation: routerLocation) {
  }

  ngAfterViewInit(): void {
    this.service.getTouristLocation().subscribe({
      next: (data) => {
        this.location.latitude = data.latitude
        this.location.longitude = data.longitude
        this.locationSelected.emit({ latitude: this.location.latitude, longitude: this.location.longitude });
      },
      error: () => {
        alert('Došlo je do greške prilikom ucitavanja lokacije.');
      }
    });
  }

  goBack(): void {
    this.routerLocation.back();
  }

  onLocationSelected(event: { latitude: number, longitude: number }): void {
    this.location.latitude = event.latitude;
    this.location.longitude = event.longitude;
    this.locationSelected.emit({ latitude: this.location.latitude, longitude: this.location.longitude });

    this.service.setTouristLocation(this.location).subscribe({
      next: (data) => {
        console.log('Lokacija kreirana!');
        this.location.latitude = data.latitude
        this.location.longitude = data.longitude
        console.log(this.location.longitude + " " + this.location.latitude)
      },
      error: () => {
        alert('Došlo je do greške prilikom dodavanja lokacije.');
      }
    });
  }
}
