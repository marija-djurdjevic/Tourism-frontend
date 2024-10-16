import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogOverview } from './blog-overview/blog-overview-component';
import { MarkdownModule } from 'ngx-markdown';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlogOverview
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [
    BlogOverview
  ]
})
export class BlogModule { }
