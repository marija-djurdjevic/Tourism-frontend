import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Problem } from './model/problem.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPreferences } from 'src/app/shared/model/tour-preferences.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http : HttpClient) { }
  
  reportProblem(problem : Problem): Observable<Problem>{
    return this.http.post<Problem>(' https://localhost:44333/api/tourist/problem/report', problem)
  }
  getProblems(): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/tourist/problem/all')
  }

  getTourPreferencesByTouristId(touristId : number) : Observable<TourPreferences> {
    return this.http.get<TourPreferences>(environment.apiHost + `tourist/tourPreferences/GetByTouristId?id=${touristId}`);
  }

  addTourPreferences(tourPreferences: TourPreferences) : Observable<TourPreferences> {
    return this.http.post<TourPreferences>(environment.apiHost + 'tourist/tourPreferences', tourPreferences);
  }

  updateTourPreferences(tourPreferences: TourPreferences) : Observable<TourPreferences> {
    return this.http.put<TourPreferences>(environment.apiHost + `tourist/tourPreferences/${tourPreferences.id}`, tourPreferences);
  }
}
