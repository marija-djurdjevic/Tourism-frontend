import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogOverview } from './blog-overview/blog-overview-component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    BlogOverview
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot()
  ],
  exports: [
    BlogOverview
  ]
})
export class BlogModule { }
