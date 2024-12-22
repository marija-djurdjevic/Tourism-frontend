import { Component } from '@angular/core';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from '../model/comment.model';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { Vote } from '../model/vote';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageService } from 'src/app/shared/image.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  comments: Comment[] = [];
  selectedComment: Comment;
  blog: Blog;
  shouldRenderCommentForm: boolean = false;
  shouldEdit: boolean = false;
  username: string = '';
  blogId: number;
  isCommentsOpen = false;
  hasUserRated = false;
  id: number = 0;
  votes: Vote[] = [];
  user: User;
  currentUserRating: boolean = false;
  isLoading:boolean=false;

  constructor(
    private service: CommentService,
    private blogService: BlogService,
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const jwtHelperService = new JwtHelperService();
    this.username = jwtHelperService.decodeToken(accessToken).username;
    this.id = jwtHelperService.decodeToken(accessToken).id;

    this.route.paramMap.subscribe((params) => {
      this.blogId = Number(params.get('blogId'));
    });

    this.getBlogById();
    this.getComments();
    console.log(this.comments);
  }

  getBlogById() {
    this.isLoading = true;
  
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (blog: Blog) => {
        this.blog = blog;
        this.checkHasUserRated();
        this.votes = this.blog.votes;
  
        // Fetch image separately
        if (blog.imageId) {
          this.fetchImage(blog.imageId).then((imageUrl) => {
            blog.image = imageUrl;
          }).catch((err) => {
            console.error('Error fetching image:', err);
          }).finally(() => {
            this.isLoading = false; // Always stop loading regardless of image fetch result
          });
        } else {
          this.isLoading = false; // No image to fetch
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching blog:', error);
        this.notificationService.notify({ message:'Failed to load blog. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }
  
  fetchImage(imageId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.imageService.getImage(imageId).subscribe({
        next: (blob: Blob) => {
          if (blob.type.startsWith('image')) {
            resolve(URL.createObjectURL(blob)); // Resolve with image URL
          } else {
            reject(new Error('Blob is not an image'));
          }
        },
        error: (err) => {
          reject(err); // Reject on error
        }
      });
    });
  }
  

  getUserById(userId: number) {
    this.isLoading=true;
    this.blogService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.user = user;
        this.isLoading=false;
      },
      error: (error) => {
        this.isLoading=false;
        console.error('Error fetching blog:', error);
        this.notificationService.notify({ message:'Failed to load user. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      },
    });
    return this.user.username;
  }

  checkHasUserRated() {
    if (this.blog) {
      for (const vote of this.blog.votes) {
        if (vote.authorId == this.id) {
          this.hasUserRated = true;
          if (vote.value == true) {
            this.currentUserRating = true;
          } else {
            this.currentUserRating = false;
          }
          break;
        }
      }
    }
  }

  changeRating() {
    const newVote: Vote = {
      authorId: this.id,
      creationDate: new Date(),
      value: !this.currentUserRating,
    };

    this.blogService.addVote(newVote, this.blogId).subscribe({
      next: () => {
        this.getBlogById();
        this.checkHasUserRated();
        this.currentUserRating = !this.currentUserRating;
        this.notificationService.notify({ message:'Vote added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to add vote. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  removeRating() {
    this.blogService.removeVote(this.blogId, this.id).subscribe({
      next: (blog: Blog) => {
        this.getBlogById();
        this.votes = this.blog.votes;
        this.hasUserRated = false;
        this.notificationService.notify({ message:'Rating removed successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (error) => {
        console.error('Error fetching blog:', error);
        this.notificationService.notify({ message:'Failed to remove rating. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      },
      complete: () => { },
    });
  }

  rateBlog(vote: 'like' | 'dislike') {
    const newVote: Vote = {
      authorId: this.id,
      creationDate: new Date(),
      value: vote === 'like',
    };

    this.blogService.addVote(newVote, this.blogId).subscribe({
      next: () => {
        this.getBlogById();
        this.checkHasUserRated();
        this.notificationService.notify({ message:'Vote added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to add vote. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  toggleCommentsSection() {
    this.isCommentsOpen = !this.isCommentsOpen;
  }

  deleteComment(id: any): void {
    if (this.blog.status === 2) {
      alert("Blog is CLOSED!");
      return;
    }
    this.service.deleteComment(this.blogId, id).subscribe({
      next: () => {
        this.getComments();
        this.notificationService.notify({ message:'Comment deleted successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to delete comment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  getComments(): void {
    this.service.getComments(this.blogId).subscribe({
      next: (result: Comment[]) => {
        this.comments = result;
        this.notificationService.notify({ message:'Comments loaded successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.notify({ message:'Failed to load comments. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }

  formatDate(date: Date): string {
    const serbianTime = toZonedTime(date, 'Europe/Belgrade');
    return format(serbianTime, 'dd.MM.yyyy HH:mm');
  }

  onEditClicked(comment: Comment): void {
    if (this.blog.status === 2) {
      alert("Blog is CLOSED!");
      return;
    }
    this.selectedComment = comment;
    this.shouldRenderCommentForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    if (this.blog.status === 2) {
      alert("Blog is CLOSED!");
      return;
    }
    this.shouldEdit = false;
    this.shouldRenderCommentForm = true;
  }
}
