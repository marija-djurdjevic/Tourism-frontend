import { Component, OnInit } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BlogForm } from '../blog-form/blog-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from 'src/app/shared/image.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';
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
  isLoading = false;

  constructor(
    private blogService: BlogService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private imageService: ImageService
  ) {}

  openNewBlogForm() {
    const dialogRef = this.dialog.open(BlogForm, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result: Blog) => {
      if (result) {
        this.getBlogs();
      }
    });
  }

  // saveBlog(blog: Blog) {
  //   this.blogService.addBlog(blog).subscribe({
  //     next: () => {
  //       console.log('Blog saved successfully');
  //       this.getBlogs();
  //       this.notificationService.notify({ message:'Blog saved successfully!', 'Close', {
  //         duration: 3000,
  //         panelClass:"succesful"
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error saving blog', error);
  //       this.notificationService.notify({ message:'Failed to load data. Please try again.', 'Close', {
  //         duration: 3000,
  //         panelClass:"succesful"
  //       });
  //     },
  //   });
  // }

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const jwtHelperService = new JwtHelperService();
    this.id = jwtHelperService.decodeToken(accessToken).id;
    this.getBlogs();
  }

  getBlogs(): void {
    this.isLoading = true;
    this.blogService.getBlogs().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
        this.applyFilter(this.selectedFilter);
        this.blogs.forEach(element => {
          this.imageService.setControllerPath("author/image")
          if (element.imageId) {
            this.imageService.getImage(element.imageId).subscribe((blob: Blob) => {
              console.log(blob);  // Proveri sadržaj Blob-a
              if (blob.type.startsWith('image')) {
                element.image = URL.createObjectURL(blob);
                
              } else {
                console.error("Blob nije slika:", blob);
              }
            });
          }
        });
        this.isLoading = false;
        // this.notificationService.notify({ message:'Data loaded successfully!', 'Close', {
        //   duration: 3000,
        //   panelClass:"succesful"
        // });
      },
      error: () => {
        console.log('Error fetching blogs!');
        this.isLoading = false;
        this.notificationService.notify({ message:'Failed to load blogs. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
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
