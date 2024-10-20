import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './model/comment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(): Observable<PagedResults<Comment>> {
    return this.http.get<PagedResults<Comment>>(environment.apiHost + 'author/comment')
  }

  deleteComment(id: number): Observable<Comment> {
    return this.http.delete<Comment>(environment.apiHost + 'author/comment/' + id);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(environment.apiHost + 'author/comment', comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(environment.apiHost + 'author/comment/' + comment.id, comment);
  }

}
