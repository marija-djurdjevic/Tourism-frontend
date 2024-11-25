import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyPointService } from '../../key-point.service'; 
import { KeyPoint } from '../../model/key-point.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-key-point',
  templateUrl: './key-point.component.html',
  styleUrls: ['./key-point.component.css']
})
export class KeyPointComponent implements OnInit {
  tourId: number;
  keyPoints: KeyPoint[] = [];
  newKeyPoint: KeyPoint; 
  isLoading=false;
  isUpdate: boolean = false;  
  selectedKeyPoint: KeyPoint | null = null;

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService,private snackBar:MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); // Uzimanje tourId iz URL-a
    this.newKeyPoint = { tourIds: [this.tourId], name: '', description: '', imagePath: '', longitude:0, latitude:0, status: 1 }; // Inicijalizacija newKeyPoint
    this.loadKeyPoints(); // Poziv funkcije za učitavanje ključnih tačaka
  }

  onEdit(keyPoint: KeyPoint) {
    console.log("Navigacija ka ruti za editovanje", keyPoint.id);
    this.router.navigate(['/key-points/edit', keyPoint.id]);
  }

  /*loadKeyPoints() {
    this.isLoading=true;
    this.keyPointService.getKeyPoints().subscribe({
      next:(keyPoints) =>{
        console.log('Vraćeni keyPoints:', keyPoints); 
        this.keyPoints = keyPoints.filter(kp => kp.tourIds.includes(this.tourId)); // Filtriranje po tourId
        console.log('Filtrirane ključne tačke: ', this.keyPoints); 
        this.isLoading=false;
      },
      error:(err: any) => {
        console.log(err);
        this.isLoading=false;
        this.snackBar.open('Failed to load data. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }*/
    loadKeyPoints() {
      this.isLoading = true;
      this.keyPointService.getKeyPoints().subscribe({
        next: (keyPoints) => {
          console.log('Vraćeni keyPoints:', keyPoints);
          this.keyPoints = keyPoints.filter(kp => Array.isArray(kp.tourIds) && kp.tourIds.includes(this.tourId) && (kp.status == 1 || kp.status ==2)); // Ensure tourIds is an array
          console.log('Filtrirane ključne tačke: ', this.keyPoints);
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(err);
          this.isLoading = false;
          this.snackBar.open('Failed to load data. Please try again.', 'Close', {
            duration: 3000,
            panelClass: "succesful"
          });
        }
      });
    }
    

  onAddKeyPoint() {
    if (!this.newKeyPoint.tourIds.includes(this.tourId)) {
      this.newKeyPoint.tourIds.push(this.tourId);
    }
    this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
      next: (keyPoint) => {
        this.keyPoints.push(keyPoint);
        this.newKeyPoint = { tourIds: [this.tourId], name: '', description: '', imagePath: '', latitude: 0, longitude: 0, status: 1 }; // Reset forme
        this.snackBar.open('Key point added successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (error) => {
        console.error("Greška prilikom dodavanja ključne tačke: ", error); 
        console.error("Detaljne greške: ", error.error.errors); 
        this.snackBar.open('Failed to add key point. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }
  onDelete(keyPointId: number) {
    console.log('Deleting key point with ID:', keyPointId);
    this.keyPointService.deleteKeyPoint(keyPointId).subscribe(response => {
      console.log('Deleted key point:', response);
      this.keyPoints = this.keyPoints.filter(k => k.id !== keyPointId); 
    });
  }
    
  onUpdateKeyPoint() {
    if (this.selectedKeyPoint && this.selectedKeyPoint.id !== undefined) {
      // Pozivanje servisa sa id-jem i podacima o ključnoj tački
      this.keyPointService.updateKeyPoint(this.selectedKeyPoint.id, this.selectedKeyPoint).subscribe({
        next: (updatedKeyPoint) => {
          // Ažuriranje u lokalnoj listi
          const index = this.keyPoints.findIndex(kp => kp.id === updatedKeyPoint.id);
          if (index !== -1) {
            this.keyPoints[index] = updatedKeyPoint;
          }
          this.isUpdate = false;  // Resetovanje stanja za ažuriranje
          this.selectedKeyPoint = null;  // Resetovanje selektovane tačke
          this.snackBar.open('Key point updated successfully!', 'Close', {
            duration: 3000,
            panelClass: "succesful"
          });
        },
        error: (error) => {
          console.error("Greška prilikom ažuriranja ključne tačke: ", error);
          this.snackBar.open('Failed to update key point. Please try again.', 'Close', {
            duration: 3000,
            panelClass: "succesful"
          });
        }
      });
    } else {
      this.snackBar.open('Key point ID is missing!', 'Close', {
        duration: 3000,
        panelClass: "error"
      });
    }
  }
  
  
}
