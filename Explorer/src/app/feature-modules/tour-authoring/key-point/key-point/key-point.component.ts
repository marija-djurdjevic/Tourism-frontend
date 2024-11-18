import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyPointService } from '../../key-point.service'; 
import { KeyPoint } from '../../model/key-point.model';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService,private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); // Uzimanje tourId iz URL-a
    this.newKeyPoint = { tourId: this.tourId, name: '', description: '', imagePath: '', longitude:0, latitude:0 }; // Inicijalizacija newKeyPoint
    this.loadKeyPoints(); // Poziv funkcije za učitavanje ključnih tačaka
  }

  loadKeyPoints() {
    this.isLoading=true;
    this.keyPointService.getKeyPoints().subscribe({
      next:(keyPoints) =>{
        console.log('Vraćeni keyPoints:', keyPoints); 
        this.keyPoints = keyPoints.filter(kp => kp.tourId === this.tourId); // Filtriranje po tourId
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
  }

  onAddKeyPoint() {
    this.newKeyPoint.tourId = this.tourId;
    this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
      next: (keyPoint) => {
        this.keyPoints.push(keyPoint);
        this.newKeyPoint = { tourId: this.tourId, name: '', description: '', imagePath: '', latitude: 0, longitude: 0 }; // Reset forme
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
  
}
