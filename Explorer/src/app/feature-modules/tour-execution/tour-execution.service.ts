import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable, throwError } from 'rxjs';
import { Comment } from './model/problem.model';
import { Problem } from './model/problem.model';
import { TourReview } from '../tour-authoring/model/tour-review.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourPreferences } from 'src/app/shared/model/tour-preferences.model';
import { Location } from 'src/app/feature-modules/tour-execution/model/location.model';
import { CompletedKeyPoint, TourSession } from './model/tour-session.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { catchError, map, tap } from 'rxjs/operators';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/key-point.model';
import { Encounter } from 'src/app/feature-modules/encounters/model/encounter.model';
import { EncounterExecution } from 'src/app/feature-modules/encounters/model/encounter-execution.model';
// import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/key-point.model'; 
import { PublishRequest } from './model/publish-request.model';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {


  getUserLevel(): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'user/tourist/level').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getAllEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'tourist/encounter').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getAllEncountersForTour(tourId: number): Observable<Encounter[]> {
    return this.http.get<Encounter[]>(`${environment.apiHost}tourist/encounter/${tourId}`).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  reportProblem(problem: Problem): Observable<Problem> {
    return this.http.post<Problem>(' https://localhost:44333/api/tourist/problem/create', problem).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
  getProblems(): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/administrator/problem/getAll').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getReviews(): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>('https://localhost:44333/api/tourist/review').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
  getReview(tourId: number): Observable<TourReview> {
    return this.http.get<TourReview>(`${environment.apiHost}tourist/review/${tourId}`).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addTourReview(tourReview: TourReview): Observable<PagedResults<TourReview>> {
    console.log(tourReview);
    return this.http.post<PagedResults<TourReview>>('https://localhost:44333/api/tourist/review', tourReview).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
  getTourPreferencesByTouristId(touristId: number): Observable<TourPreferences> {
    return this.http.get<TourPreferences>(environment.apiHost + `tourist/tourPreferences/GetByTouristId?id=${touristId}`).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addTourPreferences(tourPreferences: TourPreferences): Observable<TourPreferences> {
    return this.http.post<TourPreferences>(environment.apiHost + 'tourist/tourPreferences', tourPreferences).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  updateTourPreferences(tourPreferences: TourPreferences): Observable<TourPreferences> {
    return this.http.put<TourPreferences>(environment.apiHost + `tourist/tourPreferences/${tourPreferences.id}`, tourPreferences).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getTouristLocation(): Observable<Location> {
    return this.http.get<Location>(environment.apiHost + 'user/tourist/getLocation').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  setTouristLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(environment.apiHost + `user/tourist/setLocation`, location).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getById(id: string): Observable<Problem> {
    return this.http.get<Problem>('https://localhost:44333/api/administrator/problem/byId', {
      params: {
        id: id.toString()
      }
    }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  touristGById(id: string): Observable<Problem> {
    return this.http.get<Problem>('https://localhost:44333/api/tourist/problem/byId', {
      params: {
        id: id.toString()
      }
    }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addComment(tourProblemId: number, comment: Comment): Observable<Problem> {
    const url = environment.apiHost + 'administrator/problem/addComment';

    const params = new HttpParams().set('tourProblemId', tourProblemId.toString());

    return this.http.post<Problem>(url, comment, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  closeTourProblem(tourProblem: Problem): Observable<Problem> {

    return this.http.put<Problem>(environment.apiHost + `administrator/problem/${tourProblem.id}`, tourProblem).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  changeStatus(tourProblemId: number, problemStatus: number): Observable<Problem> {
    const url = environment.apiHost + `tourist/problem/changeStatus`;

    const params = new HttpParams()
      .set('tourProblemId', tourProblemId.toString())
      .set('problemStatus', problemStatus.toString());

    return this.http.put<Problem>(url, null, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
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

    return this.http.post<boolean>(url, body).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  abandonTour(id: number): Observable<boolean> {
    const url = `${environment.apiHost}administration/tourSession/abandon/${id}`;
    return this.http.post<boolean>(url, {}).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  updateLocation(tourId: number, latitude: number, longitude: number): Observable<boolean> {
    const url = `${environment.apiHost}administration/tourSession/update-location`;
    const params = new HttpParams()
      .set('tourId', tourId.toString())
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    return this.http.post<boolean>(url, null, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  // getAllTours(): Observable<Tour[]> {
  //   return this.http.get<Tour[]>(`${environment.apiHost}tourist/tour/all`);
  // }

  getAllTours(): Observable<Tour[]> {
    return this.http.get<{ results: Tour[], totalCount: number }>(`${environment.apiHost}tourist/tour/all`)
      .pipe(
        map(response => response.results) // Extract only the results array
      ).pipe(
        tap((response) => {
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
          return throwError(() => error);
        })
      );

    //return this.http.get<Tour[]>(`${environment.apiHost}tourist/tour/allTours`);

  }

  getAllPublishedTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.apiHost + 'tourist/tour').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  updateSession(tourId: number, latitude: number, longitude: number): Observable<void> {
    const url = `${environment.apiHost}administration/tourSession/update-session`;

    const params = new HttpParams()
      .set('tourId', tourId.toString())
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    return this.http.post<void>(url, null, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getTouristProblems(): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/tourist/problem/getByTouristId').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  touristAddComment(tourProblemId: number, comment: Comment): Observable<Problem> {
    const url = environment.apiHost + 'tourist/problem/addComment';

    const params = new HttpParams().set('tourProblemId', tourProblemId.toString());

    return this.http.post<Problem>(url, comment, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  authorGetProblems(): Observable<PagedResults<Problem>> {
    return this.http.get<PagedResults<Problem>>('https://localhost:44333/api/author/problem/getByAuthorId').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  authorAddComment(tourProblemId: number, comment: Comment): Observable<Problem> {
    const url = environment.apiHost + 'author/problem/addComment';

    const params = new HttpParams().set('tourProblemId', tourProblemId.toString());

    return this.http.post<Problem>(url, comment, { params }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  authorgetById(id: string): Observable<Problem> {
    return this.http.get<Problem>('https://localhost:44333/api/author/problem/byId', {
      params: {
        id: id.toString()
      }
    }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  setDeadline(problemId: number, time: Date): Observable<Problem> {
    return this.http.post<Problem>(environment.apiHost + 'administrator/problem/setDeadline', null, {
      params: {
        problemId: problemId.toString(),
        time: time.toISOString()
      }
    }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }


  updateLastActivity(tourId: number): Observable<boolean> {
    return this.http.post<boolean>(environment.apiHost + `administration/tourSession/updateLastActivity/${tourId}`, {}).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getCompletedKeyPoints(tourId: number): Observable<CompletedKeyPoint[]> {
    const url = `${environment.apiHost}administration/tourSession/getCompletedCheckpoints/${tourId}`;
    return this.http.get<CompletedKeyPoint[]>(url).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addCompletedKeyPoint(tourId: number, id: number | undefined): Observable<boolean> {
    const url = `${environment.apiHost}administration/tourSession/addCompleteKeyPoint/${tourId}/${id}`;
    return this.http.post<boolean>(url, {}).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getKeyPoints(tourId: number): Observable<KeyPoint[]> {
    const url = `${environment.apiHost}administration/tourSession/getKeyPointsByTourId/${tourId}`
    return this.http.get<KeyPoint[]>(url).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
    //return this.http.get<{ results: KeyPoint[] }>(url).pipe(
    //  map(response => response.results)
    //);
  }

  getTour(tourId: number): Observable<Tour> {
    return this.http.get<Tour>(`${environment.apiHost}administrator/tour/getTour`, {
      params: {
        tourId: tourId.toString()
      }
    }).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  closeTour(tourDto: Tour): Observable<Tour> {
    return this.http.post<Tour>(`${environment.apiHost}administrator/tour/close-tour`, tourDto).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  getPublishRequests(): Observable<PagedResults<PublishRequest>> {
    return this.http.get<PagedResults<PublishRequest>>(`${environment.apiHost}administrator/publishRequest/getAll`).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
  createEncounterExecution(EncounterExecution: EncounterExecution): Observable<EncounterExecution> {
    return this.http.post<EncounterExecution>(' https://localhost:44333/api/tourist/encounterExecution/create', EncounterExecution).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  updateRequestStatus(requestDto: PublishRequest): Observable<PublishRequest> {
    const url = `${environment.apiHost}administrator/keyPoint/${requestDto.id}`;
    return this.http.put<PublishRequest>(url, requestDto).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  acceptRequestStatusStory(requestDto: PublishRequest): Observable<PublishRequest> {
    const url = `${environment.apiHost}administrator/stories/status/${requestDto.id}`;
    return this.http.put<PublishRequest>(url, requestDto);
  }

  declineRequestStatusStory(requestDto: PublishRequest): Observable<PublishRequest> {
    const url = `${environment.apiHost}administrator/stories/status/${requestDto.id}`;
    return this.http.put<PublishRequest>(url, requestDto);
  }
  updateRequestStatusObject(requestDto: PublishRequest): Observable<PublishRequest> {
    const url = `${environment.apiHost}administrator/object/${requestDto.id}`;
    return this.http.put<PublishRequest>(url, requestDto).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }
  updateRequestStatusStory(requestDto: PublishRequest): Observable<PublishRequest> {
    const url = `${environment.apiHost}administrator/publishRequest/${requestDto.id}`;
    return this.http.put<PublishRequest>(url, requestDto);
  }
  updateEncounterExecution(EncounterExecution: EncounterExecution): Observable<EncounterExecution> {
    return this.http.post<EncounterExecution>(' https://localhost:44333/api/tourist/encounterExecution/update', EncounterExecution).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  unlockStory(storyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiHost}tourist/stories/unlockStory`, {
      params: {
        storyId: storyId.toString()
      }
    });
  }
  getRequest(id: number): Observable<PublishRequest> {
    const url = `${environment.apiHost}administrator/publishRequest/getById`;
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<PublishRequest>(url, { params });
  }
  
}