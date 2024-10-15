import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Object } from './model/object.model';
import { Tour } from './model/tour.model'
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http:HttpClient) { }

  getObject():Observable<PagedResults<Object>>{
    return this.http.get<PagedResults<Object>>('https://localhost:44333/api/author/object');
  }


  addObject(object:Object):Observable<Object>{
    object.category=Number(object.category)
    console.log(object)
    return this.http.post<Object>('https://localhost:44333/api/author/object',object);
  }


  getTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'administration/tour')
  }

  addTour(tour: Tour): Observable<Tour> {
    console.log('Sending tour data to API:', tour); // Dodaj ovu liniju
    return this.http.post<Tour>(environment.apiHost + 'administration/tour', tour);
  }

}
