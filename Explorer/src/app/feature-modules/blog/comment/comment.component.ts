import { Component, EventEmitter, Output } from '@angular/core';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from '../model/comment.model';
import { toZonedTime } from 'date-fns-tz';
import { format, RoundToNearestMinutesOptions } from 'date-fns';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';
import { Vote } from '../model/Vote';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
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
  votes: Vote[] = []
  user: User;
  currentUserRating: boolean = false

  constructor(private service: CommentService,
    private blogService: BlogService,
    private tokenStorage: TokenStorage,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const jwtHelperService = new JwtHelperService();
    this.username = jwtHelperService.decodeToken(accessToken).username;
    this.id = jwtHelperService.decodeToken(accessToken).id;
    
    this.route.paramMap.subscribe(params => {
      this.blogId = Number(params.get('blogId'));
    });

    this.getBlogById();
    this.getComments();
  }
  
  getBlogById() {
    this.blogService.getBlogById(this.blogId).subscribe({
      next: (blog: Blog) => {
          this.blog = blog;
          this.checkHasUserRated();
          this.votes = this.blog.votes
      },
      error: (error) => {
          console.error("Error fetching blog:", error);
      },
      complete: () => {
      }
    });
  }

  getUserById(userId: number) {
    this.blogService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.user = user
      },
      error: (error) => {
          console.error("Error fetching blog:", error);
      }
    });
    return this.user.username
  }

  checkHasUserRated() {
    if (this.blog) {
      for (const vote of this.blog.votes) {
        if (vote.authorId == this.id) {
          this.hasUserRated = true;
          if (vote.value == true) {
            this.currentUserRating = true
          } else {
            this.currentUserRating = false
          }
          break;
        }
      }
      console.log(this.hasUserRated)
    }
  }

  changeRating() {
    const newVote: Vote = {
      authorId: this.id, 
      creationDate: new Date(),
      value: !this.currentUserRating 
    };

    this.blogService.addVote(newVote, this.blogId).subscribe({
      next: () => {
        this.getBlogById()
        this.checkHasUserRated()
        this.currentUserRating = !this.currentUserRating 
      },
    });
  }

  removeRating() {
    this.blogService.removeVote(this.blogId, this.id).subscribe({
      next: (blog: Blog) => {
        this.getBlogById()
        this.votes = this.blog.votes
        this.hasUserRated = false
      },
      error: (error) => {
          console.error("Error fetching blog:", error);
      },
      complete: () => {
      }
    });
  }

  rateBlog(vote: 'like' | 'dislike') {
    const newVote: Vote = {
      authorId: this.id, 
      creationDate: new Date(),
      value: vote === 'like' 
    };

    this.blogService.addVote(newVote, this.blogId).subscribe({
      next: () => {
        this.getBlogById()
        this.checkHasUserRated()
      },
    });
  }

  toggleCommentsSection() {
    this.isCommentsOpen = !this.isCommentsOpen;
  }

  deleteComment(id: any): void {
    this.service.deleteComment(this.blogId,id).subscribe({
      next: () => {
        this.getComments();
      },
    });
  }

  getComments(): void {
    this.service.getComments(this.blogId).subscribe({
      next: (result: PagedResults<Comment>) => {
        this.comments = result.results;
      },
      error: () => {
      }
    })
  }

  formatDate(date: Date): string {
    const serbianTime = toZonedTime(date, 'Europe/Belgrade');
    return format(serbianTime, 'dd.MM.yyyy HH:mm');
  }

  onEditClicked(comment: Comment): void {
    this.selectedComment = comment;
    this.shouldRenderCommentForm = true;
    this.shouldEdit = true;
    console.log("Username: ", this.username)
    console.log('author id: ' + comment.authorId + ' & id: ' + this.id)
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderCommentForm = true;
  }
}
