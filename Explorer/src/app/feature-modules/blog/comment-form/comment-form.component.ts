import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'xp-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnChanges {

  @Output() commentUpdated = new EventEmitter<null>();
  @Input() comment: Comment;
  @Input() shouldEdit: boolean = false;
  id: 0;

  constructor(private service: CommentService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const jwtHelperService = new JwtHelperService();
    this.id = jwtHelperService.decodeToken(accessToken).id;
  }

  ngOnChanges(): void {
    this.commentForm.reset();
    if (this.shouldEdit && this.comment) {
      const commentData = {
        ...this.comment,
        authorId: this.id,
        blogId: this.comment.blogId.toString(),
      };
      this.commentForm.patchValue(commentData);
    }
  }

  commentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    blogId: new FormControl('', [Validators.required]),
  });

  addComment(): void {
    const newComment: Comment = {
      authorId: this.id,
      blogId: Number(this.commentForm.value.blogId),
      text: this.commentForm.value.text || '',
      creationDate: new Date(),
      editDate: new Date(),
    };
    console.log(newComment);
    this.service.addComment(newComment).subscribe({
      next: () => { this.commentUpdated.emit(); }
    });
  }

  updateComment(): void {
    const updatedComment: Comment = {
      ...this.comment,
      text: this.commentForm.value.text || '',
      editDate: new Date(),
    };
    this.service.updateComment(updatedComment).subscribe({
      next: () => { this.commentUpdated.emit(); }
    });
  }
}
