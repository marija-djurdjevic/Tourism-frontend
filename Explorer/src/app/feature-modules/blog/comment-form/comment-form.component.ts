import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnChanges {

  @Output() commentUpdated = new EventEmitter<null>();
  @Input() comment: Comment;
  @Input() shouldEdit: boolean = false;
  @Input() blogId: number;
  @Input() username: string;
  id: 0;

  constructor(private service: CommentService,
    private tokenStorage: TokenStorage,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const jwtHelperService = new JwtHelperService();
    this.id = jwtHelperService.decodeToken(accessToken).id;
    this.username = jwtHelperService.decodeToken(accessToken).username;
  }

  ngOnChanges(): void {
    this.commentForm.reset();
    if (this.shouldEdit && this.comment) {
      const commentData = {
        ...this.comment,
      };
      this.commentForm.patchValue(commentData);
    }
  }

  commentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
  });

  addComment(): void {
    const newComment: Comment = {
      authorId: this.id,
      blogId: this.blogId,
      text: this.commentForm.value.text || '',
      creationDate: new Date(),
      editDate: new Date(),
      username: this.username,
    };
    this.service.addComment(this.blogId, newComment).subscribe({
      next: () => {
        this.commentUpdated.emit(); 
        this.notificationService.notify({ message:'Comment added successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
        this.commentForm.reset(); // Resetovanje forme nakon dodavanja komentara
      },
      error: () => {
        alert("Blog is CLOSED!");
        this.notificationService.notify({ message:'Failed to add comment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }
  
  updateComment(): void {
    const updatedComment: Comment = {
      ...this.comment,
      text: this.commentForm.value.text || '',
      editDate: new Date(),
    };
    this.service.updateComment(this.blogId, updatedComment).subscribe({
      next: () => {
        this.commentUpdated.emit();
        this.notificationService.notify({ message:'Comment updated successfully!', duration: 3000, notificationType: NotificationType.SUCCESS });
        this.commentForm.reset(); // Resetovanje forme nakon ažuriranja komentara
      },
      error: () => {
        alert("Blog is CLOSED!");
        this.notificationService.notify({ message:'Failed to update comment. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }
    });
  }
  
}
