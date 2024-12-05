import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Problem, Details } from '../model/problem.model';

@Component({
  selector: 'xp-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent implements OnInit {
  tourId: number;
  tourProblem: Problem;
  problemDetails: Details;  
  problemDetailsForm: FormGroup;

  constructor(private service: TourExecutionService, private route: ActivatedRoute, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.problemDetailsForm = this.fb.group({
      category: ['', Validators.required],
      problemPriority: [null, [Validators.required, Validators.min(0), Validators.max(3)]],
      explanation: ['', Validators.required],
    });
  }
  feedbackMessage: string | null = null;

  
  ngOnInit(): void {
    this.tourId = +this.route.snapshot.paramMap.get('tourId')!; 

    this.problemDetails = {
      category: 0,
      problemPriority: 0,
      explanation: '',
      time: new Date().toISOString()
    };
  }

  onSubmit(): void {
    if (this.problemDetailsForm.invalid) {
      this.problemDetailsForm.markAllAsTouched(); 
      this.openSnackbar('Please fill in the required fields.');
      return; 
    }

    this.problemDetails.category = parseInt(this.problemDetailsForm.get('category')?.value);
    this.problemDetails.problemPriority = this.problemDetailsForm.get('problemPriority')?.value;
    this.problemDetails.explanation = this.problemDetailsForm.get('explanation')?.value;
    this.problemDetails.time = new Date().toISOString();

    this.tourProblem = {
      touristId: 0,
      tourId: this.tourId,
      details: this.problemDetails,
      comments: [],
      status: 0
    };
  
    this.reportProblem(this.tourProblem);
    console.log('Payload being sent:', this.tourProblem);  
  }

  reportProblem(tourProblem : Problem): void {
    this.service.reportProblem(tourProblem).subscribe({
      next: (response) => { console.log('Added Tour report', response); 
        this.openSnackbar('Problem reported successfully.');
       }
    });
  }

  openSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
