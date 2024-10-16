import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyPointService } from '../../key-point.service'; 
import { KeyPoint } from '../../model/key-point.model';

@Component({
  selector: 'xp-key-point',
  templateUrl: './key-point.component.html',
  styleUrls: ['./key-point.component.css']
})
export class KeyPointComponent implements OnInit {
  tourId: number;
  keyPoints: KeyPoint[] = [];
  newKeyPoint: KeyPoint; 

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); // Uzimanje tourId iz URL-a
    this.newKeyPoint = { tourId: this.tourId, name: '', description: '', imagePath: '', longitude:0, latitude:0 }; // Inicijalizacija newKeyPoint
    this.loadKeyPoints(); // Poziv funkcije za učitavanje ključnih tačaka
  }

  loadKeyPoints() {
    this.keyPointService.getKeyPoints().subscribe(keyPoints => {
      console.log('Vraćeni keyPoints:', keyPoints); 
      this.keyPoints = keyPoints.filter(kp => kp.tourId === this.tourId); // Filtriranje po tourId
      console.log('Filtrirane ključne tačke: ', this.keyPoints); 
    });
  }

  onAddKeyPoint() {
    this.newKeyPoint.tourId = this.tourId;
    this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
      next: (keyPoint) => {
        this.keyPoints.push(keyPoint);
        this.newKeyPoint = { tourId: this.tourId, name: '', description: '', imagePath: '', latitude: 0, longitude: 0 }; // Reset forme
      },
      error: (error) => {
        console.error("Greška prilikom dodavanja ključne tačke: ", error); // Ispiši celu grešku
        console.error("Detaljne greške: ", error.error.errors); // Ispiši validacione greške
      }
    });
  }
  
}
