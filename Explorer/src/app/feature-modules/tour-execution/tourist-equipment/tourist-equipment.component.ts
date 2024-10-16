import { Component, OnInit } from '@angular/core';
import { TouristEquipment } from '../model/tourist-equipment.model';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResult } from 'src/app/shared/shared.module';


@Component({
  selector: 'xp-tourist-equipment',
  templateUrl: './tourist-equipment.component.html',
  styleUrls: ['./tourist-equipment.component.css']
})
export class TouristEquipmentComponent implements OnInit {

  touristEquipment: TouristEquipment[] = [];

  constructor(private service: TourExecutionService) { }

    

    ngOnInit(): void {
      this.service.getTouristEquipment().subscribe({
        next: (result: PagedResult<TouristEquipment>) => {
          this.touristEquipment = result.results;
          console.log(this.touristEquipment);
        },
        error: (err: any) =>{
          console.log(err)
        }
      })
    }


    
}
