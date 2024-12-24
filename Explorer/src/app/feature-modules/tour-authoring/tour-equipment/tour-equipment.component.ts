import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TourEquipment } from '../model/tourEquipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { elementAt, Unsubscribable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';


@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent {
  tourEquipment: TourEquipment[] = [];
  allTourEquipment: TourEquipment[] = [];
  selectedTourEquipment: TourEquipment;
  tourId: number;

  constructor(private route: ActivatedRoute, private service: TourAuthoringService,private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tourId = +params['tourId'];
      this.getTourEquipment();
    });
  }

  deleteTourEquipment(id: number): void {
    this.service.deleteTourEquipment(id).subscribe({
      next: () => {
        this.getTourEquipment();
        this.notificationService.notify({ message:'Equipment deleted from tour successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error:(err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to delete equipment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    })
  }

  addTourEquipment(tourEq: TourEquipment): void {
    tourEq.tourId=this.tourId;
    this.service.addTourEquipment(tourEq).subscribe({
      next: () => {
        this.getTourEquipment()
        this.notificationService.notify({ message:'Equipment added to tour successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error:(err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to delete equipment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    })
  }

  getTourEquipment(): void {
    this.service.getTourEquipment(this.tourId).subscribe({
      next: (result: TourEquipment[]) => {
        this.tourEquipment = result;
        this.getAllTourEquipments();
      },
      error: () => {
        this.notificationService.notify({ message:'Failed to load equipments. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
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

  getAllTourEquipments(): void {
    this.service.getAllTourEquipments().subscribe({
      next: (result: TourEquipment[]) => {
        this.allTourEquipment = result;
        this.popuniSve()
      },
      error: () => {
        this.notificationService.notify({ message:'Failed to load data. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    })
  }
}
