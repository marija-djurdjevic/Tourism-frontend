import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from './model/user-profile.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { UserRating } from './model/user-rating.model';
import { Person } from 'src/app/infrastructure/auth/model/person.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

    
    getProfile(role: string): Observable<UserProfile> {
      return this.http.get<UserProfile>(`${environment.apiHost}${role}/profile/`);
    }

    updateProfile(userProfile : UserProfile,role: string): Observable<UserProfile> {
      return this.http.put<UserProfile>(`${environment.apiHost}${role}/profile/`,userProfile)
    }
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
