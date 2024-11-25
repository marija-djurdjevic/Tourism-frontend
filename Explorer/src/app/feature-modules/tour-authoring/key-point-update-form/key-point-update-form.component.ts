import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyPointService } from '../key-point.service';
import { KeyPoint } from '../model/key-point.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-key-point-update-form',
  templateUrl: './key-point-update-form.component.html',
  styleUrls: ['./key-point-update-form.component.css']
})
export class KeyPointUpdateFormComponent implements OnInit {
  selectedKeyPoint: KeyPoint = {
    tourIds: [],
    name: '',
    description: '',
    imagePath: '',
    latitude: 0,
    longitude: 0,
    status: 1
};
constructor(
  private route: ActivatedRoute,
  private keyPointService: KeyPointService,
  private snackBar: MatSnackBar,
  private router: Router
) {}

ngOnInit(): void {
  const keyPointId = Number(this.route.snapshot.paramMap.get('id'));
  if (keyPointId) {
    this.getKeyPointById(keyPointId);
  }
}

onImageSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedKeyPoint.imagePath = reader.result as string; 
    };
    reader.readAsDataURL(file); 
  }
}

getKeyPointById(id: number): void {
  this.keyPointService.getKeyPoints().subscribe({
    next: (keyPoints) => {
      const keyPoint = keyPoints.find(kp => kp.id === id); 
      if (keyPoint) {
        this.selectedKeyPoint = keyPoint; 
      } else {
        console.error('Ključna tačka sa ovim ID-om nije pronađena.');
        this.snackBar.open('Key point not found.', 'Close', {
          duration: 3000,
          panelClass: 'error'
        });
      }
    },
    error: (error) => {
      console.error('Greška prilikom dobavljanja ključnih tačaka:', error);
      this.snackBar.open('Failed to load key points. Please try again.', 'Close', {
        duration: 3000,
        panelClass: 'error'
      });
    }
  });
}

onUpdateKeyPoint(): void {
  this.keyPointService.updateKeyPoint(this.selectedKeyPoint.id!, this.selectedKeyPoint).subscribe({
    next: (updatedKeyPoint) => {
      console.log("Ključna tačka je uspešno ažurirana:", updatedKeyPoint);
      this.snackBar.open('Key point updated successfully!', 'Close', {
        duration: 3000,
        panelClass: "succesful"
      });
      
    },
    error: (error) => {
      console.error("Greška prilikom ažuriranja ključne tačke: ", error);
      this.snackBar.open('Failed to update key point. Please try again.', 'Close', {
        duration: 3000,
        panelClass: "error"
      });
    }
  });
}
onKeyPointSelected(event: { latitude: number, longitude: number }): void {
  
  this.selectedKeyPoint.latitude = event.latitude;
  this.selectedKeyPoint.longitude = event.longitude;
  
  console.log('Odabrana tačka:', this.selectedKeyPoint.latitude, this.selectedKeyPoint.longitude);
}
}

