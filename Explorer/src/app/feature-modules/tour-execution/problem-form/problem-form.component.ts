import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourExecutionService } from '../tour-execution.service';
import { Problem } from '../model/problem.model';

@Component({
  selector: 'xp-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent {

  constructor(private service: TourExecutionService) {}
  feedbackMessage: string | null = null;

  problemForm = new FormGroup({
    tourId: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    problemPriority: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  addProblem(): void {
   
    console.log(this.problemForm.value);

    /*const problem : Problem ={
      tourId: Number(this.problemForm.value.tourId) || 0,
      category: Number(this.problemForm.value.category) || 0,
      problemPriority: Number(this.problemForm.value.problemPriority) || 0,
      description: this.problemForm.value.description || "",
    }

  this.service.reportProblem(problem).subscribe({
    next: () => {
      this.feedbackMessage = 'Problem reported successfully!'; 
      this.problemForm.reset(); 
    },
    error: (err) => {
      this.feedbackMessage = 'Not succesfull';
    }
  });//*/
  }
}
