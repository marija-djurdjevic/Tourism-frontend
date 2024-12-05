import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnChanges {

  @Output() equimpentUpdated = new EventEmitter<null>();
  @Input() equipment: Equipment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService,private snackBar:MatSnackBar) {
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
        this.snackBar.open('Equipment added successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open('Failed to add equipment. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
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
        this.snackBar.open('Equipment updated successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err: any) => {
        console.log(err);
        this.snackBar.open('Failed to update equipment. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }
}
