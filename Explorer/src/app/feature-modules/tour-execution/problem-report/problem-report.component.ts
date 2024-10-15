import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from '../model/problem.model';

@Component({
  selector: 'xp-problem-report',
  templateUrl: './problem-report.component.html',
  styleUrls: ['./problem-report.component.css']
})
export class ProblemReportComponent implements OnInit {
  entities: Problem[] = [];                                

  constructor(private service: TourExecutionService) {} 

  ngOnInit(): void {
    this.service.getProblems().subscribe({
      next:(result: PagedResults<Problem>) => {
        this.entities = result.results;
      },
      error: (err:any) => {                                   
        console.log(err)
      }
  })
  }
}
