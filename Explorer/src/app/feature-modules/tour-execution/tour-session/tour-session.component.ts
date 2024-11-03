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
    // Dobijanje tourId iz ruta
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!;
  }

}
