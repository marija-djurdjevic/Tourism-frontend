import { Component, OnInit } from "@angular/core";
import { Blog } from "../model/blog.model";
import { BlogService } from "../blog.service";
import { Router } from "@angular/router";
import { PagedResults } from "src/app/shared/model/paged-results.model";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { CommentService } from "../comment.service";


@Component({
    selector: 'xp-blog-overview',
    templateUrl: "./blog-overview-component.html",
    styleUrls: ['./blog-overview-component.css']
})
export class BlogOverview implements OnInit {

    blogs: Blog[] | undefined = []
    blogForm: FormGroup;
    id: 0;

    constructor(private blogService: BlogService, private commentService: CommentService, private fb: FormBuilder, private tokenStorage: TokenStorage) {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            status: [0, Validators.required],
            image: ['', Validators.required]  
        });
    }

    ngOnInit(): void {
        const accessToken = this.tokenStorage.getAccessToken() || "";
        const jwtHelperService = new JwtHelperService();
        this.id = jwtHelperService.decodeToken(accessToken).id;
        this.getBlogs()
    }

    getBlogs(): void {
        this.blogService.getBlogs().subscribe({
            next: (result: PagedResults<Blog>) => {
                this.blogs = result.results
                    
                //provera markup jezika
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

    addComment(blogId: any) {
      console.log('Adding comment to blog with ID:', blogId);
    }

    onSubmit(): void {
        if (this.blogForm.valid) {
          const newBlog: Blog = this.blogForm.value;
          newBlog.authorId = this.id
          newBlog.creationDate = new Date()

          this.blogService.addBlog(newBlog).subscribe({
            next: (result) => {
              this.getBlogs();
              alert('Blog added successfully!');
            },
            error: () => {
              alert('Error adding blog!');
            }
          });
        } else {
          alert('Please fill all required fields!');
        }
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