import { Component, OnInit } from "@angular/core";
import { Blog } from "../model/blog.model";
import { BlogService } from "../blog.service";
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
    id: 0;

    constructor(
      private blogService: BlogService,
      private commentService: CommentService, 
      private tokenStorage: TokenStorage) {
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
          },
          error: () => {
              alert("Error fetching blogs!")
          }
      })
    }

    addComment(blogId: any) {
      console.log('Adding comment to blog with ID:', blogId);
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