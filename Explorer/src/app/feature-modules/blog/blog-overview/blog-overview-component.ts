import { Component, OnInit } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BlogForm } from '../blog-form/blog-form.component';

@Component({
  selector: 'xp-blog-overview',
  templateUrl: './blog-overview-component.html',
  styleUrls: ['./blog-overview-component.css'],
})
export class BlogOverview implements OnInit {
  blogs: Blog[];
  filteredBlogs: Blog[];
  id: 0;
  selectedFilter: string = 'all';

  constructor(
    private blogService: BlogService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private dialog: MatDialog
  ) {}

  openNewBlogForm() {
    const dialogRef = this.dialog.open(BlogForm, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: Blog) => {
      if (result) {
        this.saveBlog(result);
      }
    });
  }

  saveBlog(blog: Blog) {
    this.blogService.addBlog(blog).subscribe({
      next: () => {
        console.log('Blog saved successfully');
        this.getBlogs();
      },
      error: (error) => {
        console.error('Error saving blog', error);
      },
    });
  }

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const jwtHelperService = new JwtHelperService();
    this.id = jwtHelperService.decodeToken(accessToken).id;
    this.getBlogs();
  }

  getBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
        this.applyFilter(this.selectedFilter);
      },
      error: () => {
        alert('Error fetching blogs!');
      },
    });
  }

  viewComments(blogId: any) {
    this.router.navigate(['/comments/' + blogId]);
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0:
        return 'Draft';
      case 1:
        return 'Published';
      case 2:
        return 'Closed';
      case 3:
        return 'Active';
      case 4:
        return 'Famous';
      default:
        return 'Unknown';
    }
  }

  applyFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.filteredBlogs = this.blogs;
    } else if (filter === 'active') {
      this.filteredBlogs = this.blogs.filter((blog) => blog.status === 3);
    } else if (filter === 'famous') {
      this.filteredBlogs = this.blogs.filter((blog) => blog.status === 4);
    }
  }
}
