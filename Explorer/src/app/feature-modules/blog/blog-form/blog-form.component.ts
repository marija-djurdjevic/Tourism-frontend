import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Blog } from '../model/blog.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
})
export class BlogForm implements OnInit {
  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl(0, [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });

  userId: number = 0;

  constructor(
    private tokenStorage: TokenStorage,
    private dialogRef: MatDialogRef<BlogForm>
  ) {}

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const jwtHelperService = new JwtHelperService();
    this.userId = jwtHelperService.decodeToken(accessToken).id;
  }

  closeForm() {
    this.dialogRef.close();
  }

  addBlog(): void {
    const newBlog: Blog = {
      authorId: this.userId,
      votes: [],
      title: this.blogForm.value.title || '',
      description: this.blogForm.value.description || '',
      image: this.blogForm.value.image || '',
      status: Number(this.blogForm.value.status) || 0,
      creationDate: new Date(),
    };

    this.dialogRef.close(newBlog);
  }
}
