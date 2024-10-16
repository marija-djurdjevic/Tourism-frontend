import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from './model/user-profile.model';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

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
}
