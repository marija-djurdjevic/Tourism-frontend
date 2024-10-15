import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRating } from './model/user-rating.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

  submitRating(rating : UserRating) : Observable<UserRating>{
    return this.http.post<UserRating>('https://localhost:44333/api/author/ratings', rating)
  }
}
