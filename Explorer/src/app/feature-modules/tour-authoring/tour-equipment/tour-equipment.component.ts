import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TourEquipment } from '../model/tourEquipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { elementAt, Unsubscribable } from 'rxjs';

@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent {
  tourEquipment: TourEquipment[] = [];
  allTourEquipment: TourEquipment[] = [];
  selectedTourEquipment: TourEquipment;
  prikaz: boolean = true;
  @Input() tourId: number;

  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.getTourEquipment();
  }

  deleteTourEquipment(id: number): void {
    this.service.deleteTourEquipment(id).subscribe({
      next: () => {
        this.getTourEquipment();
      },
    })
  }

  addTourEquipment(tourEq: TourEquipment): void {
    tourEq.tourId=this.tourId;
    this.service.addTourEquipment(tourEq).subscribe({
      next: () => {
        this.getTourEquipment()
      },
    })
  }

  getTourEquipment(): void {
    this.service.getTourEquipment(this.tourId).subscribe({
      next: (result: TourEquipment[]) => {
        this.tourEquipment = result;
        this.getAllTourEquipments();
      },
      error: () => {
      }
    })
  }

  popuniSve():void{
    this.allTourEquipment.forEach(element => {
      var existingEquipment = this.tourEquipment.find(item => item.equipment.id == element.equipmentId);
      if (existingEquipment) {
        element.tourId = existingEquipment.tourId;
        element.id=existingEquipment.id;
      }
    });
  }

  onAddEquipmentClicked(): void {
    this.popuniSve();
    this.prikaz = false;
  }

  onSaveEquipmentClicked(): void {
    this.prikaz = true;
  }

  getAllTourEquipments(): void {
    this.service.getAllTourEquipments().subscribe({
      next: (result: TourEquipment[]) => {
        this.allTourEquipment = result;
        this.popuniSve()
      },
      error: () => {
      }
    })
  }
}
