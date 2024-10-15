import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyPointService } from '../key-point.service'; 
import { KeyPoint } from '../model/key-point.model';

@Component({
  selector: 'xp-key-point-form',
  templateUrl: './key-point-form.component.html',
  styleUrls: ['./key-point-form.component.css']
})
export class KeyPointFormComponent implements OnInit {
  tourId: number;
  newKeyPoint: KeyPoint; 

  imagePath: string | ArrayBuffer | null;

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePath = reader.result; // Ovo je URL slike
        this.newKeyPoint.imagePath = this.imagePath as string; // Postavi URL za newKeyPoint
      };
      reader.readAsDataURL(file); // Čitaj kao Data URL
    }
  }

  constructor(private route: ActivatedRoute, private keyPointService: KeyPointService, private router: Router) { }

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('tourId')); // Uzimanje tourId iz URL-a
    this.resetForm(); // Inicijalizacija newKeyPoint
  }

  resetForm() {
    this.newKeyPoint = { tourId: this.tourId, name: '', description: '', imagePath: '', longitude: 0, latitude: 0 }; // Reset forme
  }

  onAddKeyPoint() {
    this.keyPointService.addKeyPoint(this.newKeyPoint).subscribe({
      next: (keyPoint) => {
        alert('Uspješno dodata ključna tačka!'); // Prikaz poruke o uspehu
        this.resetForm(); // Resetuj formu nakon uspešnog dodavanja
      },
      error: (error) => {
        console.error("Greška prilikom dodavanja ključne tačke: ", error);
        console.error("Detaljne greške: ", error.error.errors);
      }
    });
  }
}
