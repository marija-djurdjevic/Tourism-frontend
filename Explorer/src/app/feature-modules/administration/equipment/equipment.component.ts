import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { Equipment } from '../model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'xp-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  equipment: Equipment[] = [];
  selectedEquipment: Equipment;
  shouldRenderEquipmentForm: boolean = false;
  shouldEdit: boolean = false;
  isLoading = false;
  
  constructor(private service: AdministrationService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.getEquipment();
  }
  
  deleteEquipment(id: number): void {
    this.service.deleteEquipment(id).subscribe({
      next: () => {
        this.getEquipment();
        this.snackBar.open('Equipment deleted successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to delete equipment. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    })
  }

  getEquipment(): void {
    this.isLoading = true;
    this.service.getEquipment().subscribe({
      next: (result: PagedResults<Equipment>) => {
        this.isLoading = false;
        this.equipment = result.results;
        // this.snackBar.open('Data loaded successfully!', 'Close', {
        //   duration: 3000,
        //   panelClass:"succesful"
        // });
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load data. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    })
  }

  onEditClicked(equipment: Equipment): void {
    this.selectedEquipment = equipment;
    this.shouldRenderEquipmentForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderEquipmentForm = true;
  }
}
