import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from '../model/problem.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-problem-report',
  templateUrl: './problem-report.component.html',
  styleUrls: ['./problem-report.component.css']
})
export class ProblemReportComponent implements OnInit {
  entities: Problem[] = [];

  constructor(private service: TourExecutionService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.service.getProblems().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.entities = result.results;

      },
      error: (err: any) => {
        console.log(err)
        this.notificationService.notify({ message: 'Error loading problems', notificationType: NotificationType.WARNING, duration: 3000 });
      }
    })
  }
}
