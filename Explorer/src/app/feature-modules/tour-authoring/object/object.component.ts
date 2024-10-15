import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Object } from '../model/object.model';


@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {

  object:Object[]=[]

  constructor(private service:TourAuthoringService) { }

  ngOnInit(): void {

   

    this.service.getObject().subscribe({
      next:(result:PagedResults<Object>)=>{
        this.object=result.results
      }

    })
  }

}
