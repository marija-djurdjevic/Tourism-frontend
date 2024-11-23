import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-add-encounter',
  templateUrl: './add-encounter.component.html',
  styleUrls: ['./add-encounter.component.css']
})
export class AddEncounterComponent {
  problemForm: FormGroup;
  selectedCategory: number = 0;

  constructor(private fb: FormBuilder) {
    this.problemForm = this.fb.group({
      category: [0, Validators.required], // Podrazumevano postavljeno na 0 i dodan validator
      problemPriority: [null, [Validators.required, Validators.min(0), Validators.max(3)]],
      explanation: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      range: [null, [Validators.min(0)]],
      touristsNumber: [null, [Validators.min(1)]],
    });
  }

  onCategoryChange(): void {
    this.selectedCategory = +this.problemForm.get('category')?.value;

    // Resetovanje opcionalnih polja na osnovu kategorije
    if (this.selectedCategory === 0) {
      this.problemForm.patchValue({ name: '', description: '', range: null, touristsNumber: null });
    } else if (this.selectedCategory === 3) {
      this.problemForm.patchValue({ name: '', description: '' });
    } else {
      this.problemForm.patchValue({ name: null, description: null, range: null, touristsNumber: null });
    }
  }

  onSubmit(): void {
    if (this.problemForm.invalid) {
      this.problemForm.markAllAsTouched();
      console.error('Form is invalid', this.problemForm.errors);
      return;
    }
    console.log(this.problemForm.value);
  }
}
