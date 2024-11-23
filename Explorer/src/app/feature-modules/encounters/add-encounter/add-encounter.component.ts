import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Encounter } from '../model/encounter.model';
import { Coordinates } from '../model/coordinates.model';
import { ActivatedRoute } from '@angular/router';
import { EncounterService } from '../encounter.service';

@Component({
  selector: 'xp-add-encounter',
  templateUrl: './add-encounter.component.html',
  styleUrls: ['./add-encounter.component.css']
})
export class AddEncounterComponent implements OnInit {
  keyPointId: number;
  encounterForm: FormGroup;
  selectedCategory: number = 0;
  encounter: Encounter;
  coordinates: Coordinates = { latitude: 0, longitude: 0 };

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private service: EncounterService) {
    this.encounterForm = this.fb.group({
      category: [0, Validators.required], // Podrazumevano postavljeno na 0 i dodan validator
      name: ['', Validators.required],
      description: ['', Validators.required],
      range: [null, [Validators.required, Validators.min(10)]],
      touristsNumber: [null, [Validators.required, Validators.min(2)]],
      creator: [false, []] 
    });
  }

  ngOnInit(): void {
    this.keyPointId = +this.route.snapshot.paramMap.get('id')!; 

    this.encounter = {
      id: 0,
      userId: 0, 
      keyPointId: 0,
      name: '',
      description: '', 
      xp: 0, 
      coordinates: this.coordinates,
      status: 0,
      type: 0,
      creator: 0,
    };
  }

  onCategoryChange(): void {
    this.selectedCategory = +this.encounterForm.get('category')?.value;

    // Resetovanje opcionalnih polja na osnovu kategorije
    if (this.selectedCategory === 0) {
      this.encounterForm.patchValue({ name: '', description: '', range: null, touristsNumber: null });
    } else if (this.selectedCategory === 3) {
      this.encounterForm.patchValue({ name: '', description: '' });
    } else {
      this.encounterForm.patchValue({ name: null, description: null, range: null, touristsNumber: null });
    }
  }

  onSubmit(): void {
    if (this.encounterForm.invalid) {
      this.encounterForm.markAllAsTouched(); 
      return;
    }

    this.encounter.userId = 0;
    this.encounter.keyPointId = this.keyPointId;
    this.encounter.xp = 50;
    this.encounter.status = 1;
    this.encounter.creator = 1;

    this.encounter.type = parseInt(this.encounterForm.get('category')?.value);
    this.encounter.name = this.encounterForm.get('name')?.value;
    this.encounter.description = this.encounterForm.get('description')?.value;
    this.encounter.range = parseInt(this.encounterForm.get('range')?.value);
    this.encounter.touristNumber = parseInt(this.encounterForm.get('touristsNumber')?.value);
    this.encounter.creator = this.encounterForm.get('creator')?.value ? 0 : 1;

    console.log('Payload being sent:', this.encounter);
    this.addEncounter(this.encounter);
  } 

  addEncounter(encounter : Encounter): void {
    this.service.addEncounter(encounter).subscribe({
      next: (response) => { console.log('Added Encounter', response); 

       }
    });
  }

  onCreatorChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox is now:', isChecked ? 'AuthorRequired (0)' : 'Author (1)');
  }
}
