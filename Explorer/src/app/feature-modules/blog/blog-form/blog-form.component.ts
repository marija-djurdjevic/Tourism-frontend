import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Blog } from '../model/blog.model';
import { BlogService } from '../blog.service';

@Component({
  selector: 'xp-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogForm implements OnChanges {

  @Output() blogCreated = new EventEmitter<null>();
  @Input() blog: Blog;
  userId: 0;

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl(0, [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });

  constructor(private service: BlogService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const jwtHelperService = new JwtHelperService();
    this.userId = jwtHelperService.decodeToken(accessToken).id;
  }

  ngOnChanges(): void {
    this.blogForm.reset();
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
    console.log(newBlog);
    this.service.addBlog(newBlog).subscribe({
      next: () => { this.blogCreated.emit(); }
    });
  }
}
