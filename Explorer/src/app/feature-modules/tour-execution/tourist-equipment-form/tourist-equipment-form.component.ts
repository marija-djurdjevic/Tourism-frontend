import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { Equipment } from '../../administration/model/equipment.model';
import { PagedResult } from 'src/app/shared/shared.module';
import { TouristEquipment } from '../../tour-execution/model/tourist-equipment.model';


@Component({
  selector: 'xp-tourist-equipment-form',
  templateUrl: './tourist-equipment-form.component.html',
  styleUrls: ['./tourist-equipment-form.component.css']
})
export class TouristEquipmentFormComponent implements OnInit{

  equipment: Equipment[] = [];

  @Output() equipmentUpdated = new EventEmitter<null>();

  constructor(private service: TourExecutionService) { }

    length: number;

    ngOnInit(): void {
      this.service.getEquipment().subscribe({
        next: (result: PagedResult<Equipment>) => {
          this.equipment = result.results;
          console.log(this.equipment);
          this.length=result.results.length;
        },
        error: (err: any) =>{
          console.log(err)
        }
      })
    }

    add(equipment: Equipment): void {
      var touristEquipment: TouristEquipment={
        id: equipment.id || 0,
        name: equipment.name || "",
        description: equipment.description || "",
        touristId: 1
      } 

      this.service.add(touristEquipment).subscribe({
        next: (result: TouristEquipment) => {
          touristEquipment = result;
          this.equipmentUpdated.emit()
        },
        error: (err: any) =>{
          console.log(err)
        }
      })
    }

}
