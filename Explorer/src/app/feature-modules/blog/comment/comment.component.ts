import { Component } from '@angular/core';
import { CommentService } from '../comment.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Comment } from '../model/comment.model';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'xp-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  comments: Comment[] = [];
  selectedComment: Comment;
  shouldRenderCommentForm: boolean = false;
  shouldEdit: boolean = false;
  username: '';

  constructor(private service: CommentService,
  
    private tokenStorage: TokenStorage) { }

  ngOnInit(): void {
    this.getComments();
    
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const jwtHelperService = new JwtHelperService();
    this.username = jwtHelperService.decodeToken(accessToken).username;
  }

  deleteComment(id: number): void {
    this.service.deleteComment(id).subscribe({
      next: () => {
        this.getComments();
      },
    });
  }

  getComments(): void {
    this.service.getComments().subscribe({
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
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderCommentForm = true;
  }
}
