import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnChanges {

  @Output() equimpentUpdated = new EventEmitter<null>();
  @Input() equipment: Equipment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService,
    private notificationService: NotificationService
  ) {
  }

  ngOnChanges(): void {
    this.equipmentForm.reset();
    if(this.shouldEdit) {
      this.equipmentForm.patchValue(this.equipment);
    }
  }

  equipmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  addEquipment(): void {
    const equipment: Equipment = {
      name: this.equipmentForm.value.name || "",
      description: this.equipmentForm.value.description || "",
    };
    this.service.addEquipment(equipment).subscribe({
      next: () => { 
        this.equimpentUpdated.emit() 
        this.notificationService.notify({ message:'Equipment added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to add equipment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  updateEquipment(): void {
    const equipment: Equipment = {
      name: this.equipmentForm.value.name || "",
      description: this.equipmentForm.value.description || "",
    };
    equipment.id = this.equipment.id;
    this.service.updateEquipment(equipment).subscribe({
      next: () => { this.equimpentUpdated.emit();
        this.notificationService.notify({ message:'Equipment updated successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to update equipment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }
}
