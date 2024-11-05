import { Component, OnInit } from '@angular/core';
import { SearchByDistance } from '../model/search-by-distance.model';
import { MarketplaceService } from '../marketplace.service';
import { KeyPoint } from '../../tour-authoring/model/key-point.model';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent {

  searchedTours: Tour[] = [];
  searchCriteria: SearchByDistance = {
    distance: 0,
    location: { latitude: 0, longitude: 0 }
  };
  selectedKeyPoint: KeyPoint; 

  constructor(private service: MarketplaceService) { }

  searchTours(): void {
    this.service.searchTours(this.searchCriteria).subscribe((response) => {
      this.searchedTours = response;
    });
  }

  onKeyPointSelected(event: { latitude: number, longitude: number }): void {
    this.searchCriteria.location = {
      latitude: event.latitude,
      longitude: event.longitude
    };

    console.log('Odabrana tačka za pretragu:', this.searchCriteria.location.latitude, this.searchCriteria.location.longitude);
  }

}
