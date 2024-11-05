import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Problem } from './model/problem.model';
import { TourReview } from '../tour-authoring/model/tour-review.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourPreferences } from 'src/app/shared/model/tour-preferences.model';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';
import { TourSession } from './model/tour-session.model';
import { Tour } from '../tour-authoring/model/tour.model';


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

  getReviews(): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>('https://localhost:44333/api/tourist/review')
  }


  addTourReview(tourReview : TourReview): Observable<PagedResults<TourReview>> {
    console.log(tourReview);
    return this.http.post<PagedResults<TourReview>>('https://localhost:44333/api/tourist/review',tourReview)
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

  getTouristLocation(): Observable<Location> {
    return this.http.get<Location>(environment.apiHost + 'user/tourist/getLocation');
  }

  setTouristLocation(location:Location): Observable<Location> {
    return this.http.post<Location>(environment.apiHost + `user/tourist/setLocation`,location);
  }


  startTour(tourId: number, latitude: number, longitude: number,touristId:number): Observable<boolean> {
    const url = `${environment.apiHost}administration/tourSession/start`;
    const params = new HttpParams()
      .set('tourId', tourId.toString())
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('touristId',touristId.toString());

    return this.http.post<boolean>(url, null, { params });

  }

  abandonTour(id: number): Observable<boolean> {
    const url = `${environment.apiHost}administration/tourSession/abandon/${id}`;
    return this.http.post<boolean>(url, {});
  }


  updateLocation(tourId: number, latitude: number, longitude: number): Observable<boolean> {
    const url =`${environment.apiHost}administration/tourSession/update-location`;
    const params = new HttpParams()
      .set('tourId', tourId.toString())
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    return this.http.post<boolean>(url,null,{params});
  }


  getAllTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${environment.apiHost}tourist/tour/all`);
  }


  updateSession(tourId: number, latitude: number, longitude: number): Observable<void> {
    const url = `${environment.apiHost}administration/tourSession/update-session`;

    const params = new HttpParams()
      .set('tourId', tourId.toString())
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    return this.http.post<void>(url, null, { params });
  }



}
