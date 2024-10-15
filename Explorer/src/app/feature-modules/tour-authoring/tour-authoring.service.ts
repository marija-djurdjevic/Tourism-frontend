import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tour } from './model/tour.model'
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'administration/tour')
  }

  addTour(tour: Tour): Observable<Tour> {
    console.log('Sending tour data to API:', tour); // Dodaj ovu liniju
    return this.http.post<Tour>(environment.apiHost + 'administration/tour', tour);
  }
}
