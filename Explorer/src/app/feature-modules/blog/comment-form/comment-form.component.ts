import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../model/comment.model';
import { CommentService } from '../comment.service';

@Component({
  selector: 'xp-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent implements OnChanges {

  @Output() commentUpdated = new EventEmitter<null>();
  @Input() comment: Comment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: CommentService) {}

  ngOnChanges(): void {
    this.commentForm.reset();
    if (this.shouldEdit && this.comment) {
      const commentData = {
        ...this.comment,
        authorId: this.comment.authorId.toString(),
        blogId: this.comment.blogId.toString(),
      };
      this.commentForm.patchValue(commentData);
    }
  }

  commentForm = new FormGroup({
    text: new FormControl('', [Validators.required]),
    authorId: new FormControl('', [Validators.required]),
    blogId: new FormControl('', [Validators.required]),
  });

  addComment(): void {
    const newComment: Comment = {
      ...this.comment,
      authorId: Number(this.commentForm.value.authorId),
      blogId: Number(this.commentForm.value.blogId),
      text: this.commentForm.value.text || ''
    };
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
