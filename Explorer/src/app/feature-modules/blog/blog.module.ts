import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment/comment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { BlogOverview } from './blog-overview/blog-overview-component';



@NgModule({
  declarations: [
    CommentComponent,
    CommentFormComponent,
    BlogOverview
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommentComponent,
    BlogOverview
  ]
})
export class BlogModule { }
