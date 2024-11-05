import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from '../model/problem.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-problems-list',
  templateUrl: './problems-list.component.html',
  styleUrls: ['./problems-list.component.css']
})
export class ProblemsListComponent {
  entities: Problem[] = [];   
  displayedEntities: Problem[] = [];
  tourMap: Map<number|undefined, string> = new Map();
  currentPage = 0;
  totalPages = 0;
  pageSize = 8;
                   

  constructor(private service: TourExecutionService, private tourService:TourAuthoringService, private router: Router) {} 

  ngOnInit(): void {
    this.loadAllProblems();
    this.fetchAndMapTours();
  }

  loadAllProblems(): void {
    this.service.getProblems().subscribe({
      next: (result: PagedResults<Problem>) => {
        this.entities = result.results;
        this.updateDisplayedEntities();
        this.totalPages = Math.ceil(this.entities.length / this.pageSize);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  updateDisplayedEntities(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedEntities = this.entities.slice(startIndex, startIndex + this.pageSize);
  }
   
  

  fetchAndMapTours(): void {
    this.tourService.getAllTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        result.results.forEach((tour) => {
          this.tourMap.set(tour.id, tour.name); 
        });
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getDate(input: string): string {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

  getTime(input: string): string {
    const time = new Date(input);
    return time.toLocaleTimeString(); 
  }

  getEnum(id: number): string {
    
    let ret: string;

    switch (id) {
    case 0:
      return 'Other';
    case 1:
      return 'Unclear Instructions';
    case 2:
      return 'Road Obstacles';
    case 3:
      return 'Unreachable Part';
    default:
      return 'Unknown'; 
    }
  }

    getById(id: number): string | undefined {
      return this.tourMap.get(id);
    }

    goToProblem(id : number|undefined, name: string|undefined):void{
      this.router.navigate(['/problem'], { queryParams: { id: id, name: name } });
    }

    goToNextPage(): void {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.updateDisplayedEntities();
      }
    }
    
    goToPreviousPage(): void {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updateDisplayedEntities();
      }
    }
}
