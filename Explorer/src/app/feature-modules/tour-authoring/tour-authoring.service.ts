import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clubs } from './model/clubs.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getClubs(): Observable<PagedResults<Clubs>> {
    return this.http.get<PagedResults<Clubs>>('https://localhost:44333/api/administration/club');
  }

  addClub(club: Clubs): Observable<Clubs>{
    return this.http.post<Clubs>(environment.apiHost + 'administration/club', club)
  }

  deleteClub(id: number): Observable<Clubs> {
    return this.http.delete<Clubs>(environment.apiHost + 'administration/club/' + id);
  }

  updateClub(club: Clubs): Observable<Clubs> {
    return this.http.put<Clubs>(environment.apiHost + 'administration/club/' + club.id, club);
  }
}
