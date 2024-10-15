import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Object } from './model/object.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http:HttpClient) { }

  getObject():Observable<PagedResults<Object>>{
    return this.http.get<PagedResults<Object>>('https://localhost:44333/api/author/object');
  }


  addObject(object:Object):Observable<Object>{
    object.category=Number(object.category)
    console.log(object)
    return this.http.post<Object>('https://localhost:44333/api/author/object',object);
  }

}
