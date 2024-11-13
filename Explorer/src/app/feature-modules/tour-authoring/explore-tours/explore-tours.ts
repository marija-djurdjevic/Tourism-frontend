import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
    selector: 'xp-tour',
    templateUrl: './explore-tours.html',
    styleUrls: ['./explore-tours.css']
})
export class ExploreToursComponent implements OnInit {

    tours: Tour[] = [];

    constructor(private service: TourAuthoringService, private router: Router) { }

    ngOnInit(): void {
        this.getTours();
    }

    getTours(): void {
        this.service.getTours().subscribe({
            next: (result: PagedResults<Tour>) => {  // Assuming PagedResults<Tour> is used
                this.tours = result.results;
                console.log(this.tours);
            },
            error: () => { /* Handle error */ }
        });
    }

    getDifficultyLabel(difficulty: number): string {
        switch (difficulty) {
            case 0:
                return 'Easy';
            case 1:
                return 'Medium';
            case 2:
                return 'Hard';
            default:
                return 'Unknown';
        }
    }

    getStatusLabel(status: number): string {
        switch (status) {
            case 0:
                return 'Draft';
            case 1:
                return 'Published';
            default:
                return 'Unknown';
        }
    }
}
