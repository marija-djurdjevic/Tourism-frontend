import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Blog } from "./model/blog.model";
import { environment } from "src/env/environment";
import { Vote } from "./model/Vote";
import { User } from "src/app/infrastructure/auth/model/user.model";

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(private http: HttpClient) {}

    getBlogs(): Observable<PagedResults<Blog>> {
        return this.http.get<PagedResults<Blog>>(environment.apiHost + 'author/blog')
    }

    addBlog(blog: Blog): Observable<Blog> {
        console.log(blog)
        return this.http.post<Blog>(environment.apiHost + 'author/blog', blog)
    }

    getBlogById(id: number): Observable<Blog> {
        return this.http.get<Blog>(environment.apiHost + 'author/blog/' + id)
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(environment.apiHost + 'author/blog/user/' + id)
    }

    addVote(vote: Vote, blogId: number): Observable<Blog> {
        return this.http.post<Blog>(`${environment.apiHost}author/blog/${blogId}/vote`, vote)
    }

    getVotes(blogId: number): Observable<Blog> {
        return this.http.get<Blog>(`${environment.apiHost}author/blog/${blogId}/votes`)
    }

    removeVote(blogId: number, authorId: number): Observable<Blog> {
        return this.http.delete<Blog>(`${environment.apiHost}author/blog/${blogId}/${authorId}/votes`)
    }
}