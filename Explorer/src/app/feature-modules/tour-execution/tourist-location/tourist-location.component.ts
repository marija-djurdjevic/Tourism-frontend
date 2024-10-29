import { Component, EventEmitter, Output } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';

@Component({
  selector: 'xp-tourist-location',
  templateUrl: './tourist-location.component.html',
  styleUrls: ['./tourist-location.component.css']
})
export class TouristLocationComponent {
  @Output() locationSelected = new EventEmitter<{ latitude: number, longitude: number }>();
  imageId: Number;
  selectedFile: File;
  previewImage: string | null = null
  location: Location = { latitude: 0, longitude: 0 };

  constructor(private service: TourExecutionService) {
  }

  ngAfterViewInit(): void {
    this.service.getTouristLocation().subscribe({
      next: (data) => {
        this.location.latitude = data.latitude
        this.location.longitude = data.longitude
      },
      error: () => {
        alert('Došlo je do greške prilikom ucitavanja lokacije.');
      }
    });
  }

  onLocationSelected(event: { latitude: number, longitude: number }): void {
    this.location.latitude = event.latitude;
    this.location.longitude = event.longitude;

    this.service.setTouristLocation(this.location).subscribe({
      next: (data) => {
        console.log('Lokacija kreirana!');
        this.location.latitude = data.latitude
        this.location.longitude = data.longitude
        console.log(this.location.longitude + " " + this.location.latitude)
        this.locationSelected.emit({ latitude: this.location.latitude, longitude: this.location.longitude });
      },
      error: () => {
        alert('Došlo je do greške prilikom dodavanja lokacije.');
      }
    });
  }
}
