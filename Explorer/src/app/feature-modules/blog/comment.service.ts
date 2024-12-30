import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './model/comment.model';
import { environment } from 'src/env/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ErrorHandlerService } from 'src/app/shared/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getComments(blogId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(environment.apiHost + 'author/blog/' + blogId + '/comments').pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  deleteComment(blogId: number, id: number): Observable<Comment> {
    return this.http.delete<Comment>(environment.apiHost + 'author/blog/' + blogId + '/comments/' + id).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  addComment(blogId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(environment.apiHost + 'author/blog/' + blogId + '/comments', comment).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

  updateComment(blogId: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(environment.apiHost + 'author/blog/' + blogId + '/comments/' + comment.id, comment).pipe(
      tap((response) => {
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
        return throwError(() => error);
      })
    );
  }

}
