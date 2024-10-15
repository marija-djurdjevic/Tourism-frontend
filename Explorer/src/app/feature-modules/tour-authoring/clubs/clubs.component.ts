import { Component, OnInit } from '@angular/core';
import { Clubs } from '../model/clubs.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {
  clubs: Clubs[] = [];

  constructor(private service: TourAuthoringService) {}

  ngOnInit(): void {
      this.service.getClubs().subscribe({
        next: (result: PagedResults<Clubs>) => {
          console.log(result)
          this.clubs = result.results
        },
    error: (err: any) => {
      console.log(err)
    }
    })
  }
  //clubs: Clubs[] = [{id:0, name: "prvi", description: "najbolji"}, {id:1, name: "prvi nismo", description: "ne i najbolji"} ]
}
