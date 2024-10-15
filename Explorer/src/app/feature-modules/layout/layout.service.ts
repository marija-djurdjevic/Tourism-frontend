import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRating } from './model/user-rating.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Person } from 'src/app/infrastructure/auth/model/person.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

  submitRating(rating : UserRating, role: string) : Observable<UserRating>{
    return this.http.post<UserRating>(environment.apiHost + role + "/ratings", rating)
  }

  getRatings() : Observable<Array<UserRating>>{
    return this.http.get<Array<UserRating>>(environment.apiHost + 'administrator/ratings')
  }

  getPersonByUserId(userId: string) : Observable<Person>{
    return this.http.get<Person>(environment.apiHost + `administrator/users/${userId}/person`)
  }
}
