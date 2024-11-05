import { Component } from '@angular/core';
import { TourSearch } from '../model/tour-search.model';
import { MarketplaceService } from '../marketplace.service';
import { KeyPoint } from '../../tour-authoring/model/key-point.model';

@Component({
  selector: 'xp-tour-search',
  templateUrl: './tour-search.component.html',
  styleUrls: ['./tour-search.component.css']
})
export class TourSearchComponent {

  //distance: number;
  tourSearch: TourSearch[] = [];
  //selectedKeyPoint: KeyPoint; 

  constructor(private service: MarketplaceService) { }

  // onKeyPointSelected(event: { latitude: number, longitude: number }): void {
  //   // Pristup prosleđenim parametrima (latitude i longitude)
  //   this.selectedKeyPoint.latitude = event.latitude;
  //   this.selectedKeyPoint.longitude = event.longitude;
    
  //   // Sada možeš raditi nešto sa prosleđenim koordinatama
  //   console.log('Odabrana tačka:', this.selectedKeyPoint.latitude, this.selectedKeyPoint.longitude);
  // }

  // getSearchedTours(): void {
  //   this.service.searchTours().subscribe() 
  // }

}
