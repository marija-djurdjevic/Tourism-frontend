import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from './model/user-profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

    
    getProfile(role: string): Observable<UserProfile> {
      return this.http.get<UserProfile>(`https://localhost:44333/api/${role}/profile/`);
    }

    updateProfile(userProfile : UserProfile,role: string): Observable<UserProfile> {
      return this.http.put<UserProfile>(`https://localhost:44333/api/${role}/profile/`,userProfile)
    }
}
