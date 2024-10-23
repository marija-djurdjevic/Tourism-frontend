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

  getComments(blogId: number): Observable<PagedResults<Comment>> {
    return this.http.get<PagedResults<Comment>>(environment.apiHost + 'author/blog/' + blogId + '/comment')
  }

  deleteComment(blogId: number, id: number): Observable<Comment> {
    return this.http.delete<Comment>(environment.apiHost + 'author/blog/' + blogId + '/comment/' + id);
  }

  addComment(blogId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(environment.apiHost + 'author/blog/' + blogId + '/comment', comment);
  }

  updateComment(blogId: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(environment.apiHost + 'author/blog/' + blogId + '/comment/' + comment.id, comment);
  }

}
