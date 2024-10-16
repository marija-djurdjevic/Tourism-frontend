import { Component, OnInit } from "@angular/core";
import { Blog } from "../model/blog.model";
import { BlogService } from "../blog.service";
import { Router } from "@angular/router";
import { PagedResults } from "src/app/shared/model/paged-results.model";
@Component({
    selector: 'xp-blog-overview',
    templateUrl: "./blog-overview-component.html",
    styleUrls: ['./blog-overview-component.css']
})
export class BlogOverview implements OnInit {

    blogs: Blog[] | undefined = []

    constructor(private service: BlogService, private router: Router) {}

    ngOnInit(): void {
        this.getBlogs()
    }

    getBlogs(): void {
        this.service.getBlogs().subscribe({
            next: (result: PagedResults<Blog>) => {
                this.blogs = result.results

                this.blogs.push({
                    title: 'Markdown Blog Example',
                    description: "# Welcome to the Markdown Blog!\nThis is a **bold text**.\n\n- Bullet Point 1\n- Bullet Point 2\n\n[Click Here](https://example.com)",
                    authorId: 99,
                    creationDate: new Date(),
                    status: 1,
                    image: 'assets/markdown-blog.jpg'
                });
            },
            error: () => {
                alert("Error fetching blogs!")
            }
        })
    }

    getStatusLabel(status: number): string {
        switch (status) {
          case 0:
            return 'Draft';
          case 1:
            return 'Published';
          case 2: 
            return 'Closed';
          default:
            return 'Unknown';
        }
    }
}