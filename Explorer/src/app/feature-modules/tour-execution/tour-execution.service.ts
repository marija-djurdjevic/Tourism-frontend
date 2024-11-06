import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Comment } from './model/problem.model';
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
    return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/administrator/problem/getAll')
  }

  getReviews(): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>('https://localhost:44333/api/tourist/review')
  }
  getReview(tourId:number): Observable<TourReview> {
    return this.http.get<TourReview>(`${environment.apiHost}tourist/review/${tourId}`);
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

  getById(id: string): Observable<Problem> {
    return this.http.get<Problem>('https://localhost:44333/api/administrator/problem/byId',{
      params: {
        id: id.toString()
      }
    })
  }

  touristGById(id: string): Observable<Problem> {
    return this.http.get<Problem>('https://localhost:44333/api/tourist/problem/byId',{
      params: {
        id: id.toString()
      }
    })
  }

  addComment(tourProblemId: number, comment: Comment): Observable<Problem> {
    const url = environment.apiHost + 'administrator/problem/addComment';
  
    const params = new HttpParams().set('tourProblemId', tourProblemId.toString());
  
    return this.http.post<Problem>(url, comment, { params });
  }

  closeTourProblem(tourProblem: Problem): Observable<Problem>{

    return this.http.put<Problem>(environment.apiHost + `administrator/problem/${tourProblem.id}`, tourProblem);
  }
  
  changeStatus(tourProblemId: number, problemStatus: number): Observable<Problem> {
    const url = environment.apiHost + `tourist/problem/changeStatus`;

    const params = new HttpParams()
        .set('tourProblemId', tourProblemId.toString())
        .set('problemStatus', problemStatus.toString());

    return this.http.put<Problem>(url, null, { params });

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

getTouristProblems(): Observable<PagedResults<Problem>> {
  return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/tourist/problem/getAll')
}
  

touristAddComment(tourProblemId: number, comment: Comment): Observable<Problem> {
  const url = environment.apiHost + 'tourist/problem/addComment';

  const params = new HttpParams().set('tourProblemId', tourProblemId.toString());

  return this.http.post<Problem>(url, comment, { params });
}


authorGetProblems(): Observable<PagedResults<Problem>> {
  return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/author/problem/getAll')
}


authorAddComment(tourProblemId: number, comment: Comment): Observable<Problem> {
  const url = environment.apiHost + 'author/problem/addComment';

  const params = new HttpParams().set('tourProblemId', tourProblemId.toString());

  return this.http.post<Problem>(url, comment, { params });
}


authorgetById(id: string): Observable<Problem> {
  return this.http.get<Problem>('https://localhost:44333/api/author/problem/byId',{
    params: {
      id: id.toString()
    }
  })
}

setDeadline(problemId: number, time: Date): Observable<Problem> {
  return this.http.post<Problem>(environment.apiHost + 'administrator/problem/setDeadline', null, {
    params: {
      problemId: problemId.toString(),
      time: time.toISOString()
    }
  });
}

}