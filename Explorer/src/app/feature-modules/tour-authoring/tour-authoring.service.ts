import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clubs } from './model/clubs.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getClubs(): Observable<PagedResults<Clubs>> {
    return this.http.get<PagedResults<Clubs>>('https://localhost:44333/api/administration/club');
  }
}
