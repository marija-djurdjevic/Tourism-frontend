import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { BlogOverview } from './blog-overview/blog-overview-component';
import { BlogForm } from './blog-form/blog-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    CommentComponent,
    CommentFormComponent,
    BlogOverview,
    BlogForm
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule
  ],
  exports: [
    CommentComponent,
    BlogOverview
  ]
})
export class BlogModule { }
