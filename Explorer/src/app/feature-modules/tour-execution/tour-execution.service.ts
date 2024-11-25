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
import { CompletedKeyPoint, TourSession } from './model/tour-session.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { map } from 'rxjs/operators';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/key-point.model';
import { Encounter } from 'src/app/feature-modules/encounters/model/encounter.model';
import { EncounterExecution } from 'src/app/feature-modules/encounters/model/encounter-execution.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http : HttpClient) { }
  
  getAllEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'tourist/encounter');
  }

  getAllEncountersForTour(tourId: number): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${environment.apiHost}tourist/encounter/${tourId}`);
  }

  reportProblem(problem : Problem): Observable<Problem>{
    return this.http.post<Problem>(' https://localhost:44333/api/tourist/problem/create', problem)
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
  }

  // startTour(tourId: number, latitude: number, longitude: number,touristId:number): Observable<boolean> {
  //   const url = `${environment.apiHost}administration/tourSession/start`;
  //   const params = new HttpParams()
  //     .set('tourId', tourId.toString())
  //     .set('latitude', latitude.toString())
  //     .set('longitude', longitude.toString())
  //     .set('touristId',touristId.toString());

  //   return this.http.post<boolean>(url, null, { params });

  // }

  startTour(tourId: number, latitude: number, longitude: number, touristId: number): Observable<boolean> {
    const url = `${environment.apiHost}administration/tourSession/start`;
    const body = { tourId, latitude, longitude, touristId };
  
    return this.http.post<boolean>(url, body);
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


  // getAllTours(): Observable<Tour[]> {
  //   return this.http.get<Tour[]>(`${environment.apiHost}tourist/tour/all`);
  // }

  getAllTours(): Observable<Tour[]> {
    return this.http.get<{ results: Tour[], totalCount: number }>(`${environment.apiHost}tourist/tour/all`)
      .pipe(
        map(response => response.results) // Extract only the results array
      );

    //return this.http.get<Tour[]>(`${environment.apiHost}tourist/tour/allTours`);

  }

  updateSession(tourId: number, latitude: number, longitude: number): Observable<void> {
    const url = `${environment.apiHost}administration/tourSession/update-session`;

    const params = new HttpParams()
      .set('tourId', tourId.toString())
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    return this.http.post<void>(url, null, { params });
  }

getTouristProblems(): Observable<PagedResults<Problem>> {
  return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/tourist/problem/getByTouristId')
}
  

touristAddComment(tourProblemId: number, comment: Comment): Observable<Problem> {
  const url = environment.apiHost + 'tourist/problem/addComment';

  const params = new HttpParams().set('tourProblemId', tourProblemId.toString());

  return this.http.post<Problem>(url, comment, { params });
}


authorGetProblems(): Observable<PagedResults<Problem>> {
  return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/author/problem/getByAuthorId')
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


updateLastActivity(tourId: number): Observable<boolean> {
  return this.http.post<boolean>(environment.apiHost + `administration/tourSession/updateLastActivity/${tourId}`, {});
}

getCompletedKeyPoints(tourId: number): Observable<CompletedKeyPoint[]> {
  const url = `${environment.apiHost}administration/tourSession/getCompletedCheckpoints/${tourId}`;
  return this.http.get<CompletedKeyPoint[]>(url);
}

addCompletedKeyPoint(tourId: number, id: number | undefined): Observable<boolean> {
  const url = `${environment.apiHost}administration/tourSession/addCompleteKeyPoint/${tourId}/${id}`;
  return this.http.post<boolean>(url, {})
}

getKeyPoints(tourId: number): Observable<KeyPoint[]> {
  const url = `${environment.apiHost}administration/tourSession/getKeyPointsByTourId/${tourId}`
  return this.http.get<KeyPoint[]>(url);
  //return this.http.get<{ results: KeyPoint[] }>(url).pipe(
  //  map(response => response.results)
  //);
}

getTour(tourId: number): Observable<Tour> {
  return this.http.get<Tour>(`${environment.apiHost}administrator/tour/getTour`, {
    params: {
      tourId: tourId.toString() 
    }
  });
}

closeTour(tourDto: Tour): Observable<Tour> {
  return this.http.post<Tour>(`${environment.apiHost}administrator/tour/close-tour`, tourDto);
}

createEncounterExecution(EncounterExecution : EncounterExecution): Observable<EncounterExecution>{
  return this.http.post<EncounterExecution>(' https://localhost:44333/api/tourist/encounterExecution/create', EncounterExecution)
}

updateEncounterExecution(EncounterExecution : EncounterExecution): Observable<EncounterExecution>{
  return this.http.post<EncounterExecution>(' https://localhost:44333/api/tourist/encounterExecution/update', EncounterExecution)
}
}