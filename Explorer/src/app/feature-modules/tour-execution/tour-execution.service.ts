import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TourPreferences } from 'src/app/shared/model/tour-preferences.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }

  getTourPreferencesByTouristId(touristId : number) : Observable<TourPreferences> {
    return this.http.get<TourPreferences>(`https://localhost:44333/api/tourist/tourPreferences/GetByTouristId?id=${touristId}`);
  }
}
