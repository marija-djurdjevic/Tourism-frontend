import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { Blog } from "./model/blog.model";
import { environment } from "src/env/environment";

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
}