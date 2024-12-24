import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Blog } from "./model/blog.model";
import { environment } from "src/env/environment";
import { Vote } from "./model/vote";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

    getBlogs(): Observable<PagedResults<Blog>> {
        return this.http.get<PagedResults<Blog>>(environment.apiHost + 'author/blog').pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    addBlog(blog: Blog): Observable<Blog> {
        console.log(blog)
        return this.http.post<Blog>(environment.apiHost + 'author/blog', blog).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    getBlogById(id: number): Observable<Blog> {
        return this.http.get<Blog>(environment.apiHost + 'author/blog/' + id).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(environment.apiHost + 'author/blog/user/' + id).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    addVote(vote: Vote, blogId: number): Observable<Blog> {
        return this.http.post<Blog>(`${environment.apiHost}author/blog/${blogId}/vote`, vote).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    getVotes(blogId: number): Observable<Blog> {
        return this.http.get<Blog>(`${environment.apiHost}author/blog/${blogId}/votes`).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    removeVote(blogId: number, authorId: number): Observable<Blog> {
        return this.http.delete<Blog>(`${environment.apiHost}author/blog/${blogId}/${authorId}/votes`).pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }

    getTopBlogs(): Observable<Blog[]> {
        return this.http.get<Blog[]>(environment.apiHost + 'author/blog/top3').pipe(
            tap((response) => {
            }),
            catchError((error: HttpErrorResponse) => {
                this.errorHandler.handleHttpError(error); // Delegiranje grešaka ErrorHandlerService-u
                return throwError(() => error);
            })
        );
    }
}