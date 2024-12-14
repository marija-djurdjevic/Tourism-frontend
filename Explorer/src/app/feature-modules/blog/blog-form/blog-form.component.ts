import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Blog } from '../model/blog.model';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageService } from 'src/app/shared/image.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { BlogService } from '../blog.service';


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
    
  });

  userId: number = 0;
  selectedFile: File | null = null; // Initialize selectedFile
  imageId: number | null = null; // Initialize imageId
  isImageSelected = false; // Tracks if an image is selected

  constructor(
    private tokenStorage: TokenStorage,
    private dialogRef: MatDialogRef<BlogForm>,
    private imageService: ImageService,
    private snackBar: MatSnackBar, 
    private service: BlogService 
  ) {
    this.imageService.setControllerPath('author/image'); // Set API path for image upload
  }

  ngOnInit(): void {
    const accessToken = this.tokenStorage.getAccessToken() || '';
    const jwtHelperService = new JwtHelperService();
    const decodedToken = jwtHelperService.decodeToken(accessToken);

    if (decodedToken && decodedToken.id) {
      this.userId = decodedToken.id;
    } else {
      console.error('Invalid token: unable to retrieve user ID');
      this.snackBar.open('Unable to retrieve user information. Please login again.', 'Close', {
        duration: 3000,
        panelClass: 'error',
      });
      this.dialogRef.close();
    }
  }

  closeForm() {
    this.dialogRef.close();
  }

  addBlog(): void {
    if (!this.blogForm.valid) {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
        panelClass: 'error',
      });
      return;
    }

    const newBlog: Blog = {
      authorId: this.userId,
      votes: [],
      title: this.blogForm.value.title || '',
      description: this.blogForm.value.description || '',
      imageId: undefined,
      status: Number(this.blogForm.value.status) || 0,
      creationDate: new Date(),
    };

    if (this.selectedFile) {
      // Upload the image and then proceed to add the blog
      this.imageService.setControllerPath('author/image');
      this.imageService.uploadImage(this.selectedFile).subscribe({
        next: (imageId: number) => {
          newBlog.imageId = imageId; // Assign the uploaded image ID
          this.executeAddBlog(newBlog); // Call the separate method to add the blog
        },
        error: (err) => {
          console.error('Error uploading image:', err);
          this.snackBar.open('Image upload failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: 'error',
          });
        },
      });
    } else {
      // Proceed without an image
      this.executeAddBlog(newBlog);
    }
  }

  // Separate method to handle the final addition of the blog
  private executeAddBlog(blog: Blog): void {
    this.service.addBlog(blog).subscribe({
      next: () => {
        
        console.log('Blog added successfully');
        this.blogForm.reset();
        this.selectedFile = null;
        this.dialogRef.close(blog);
        this.snackBar.open('Blog added successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success',
        });
      },
      error: (err) => {
        console.error('Error adding blog:', err);
        this.snackBar.open('Failed to add blog. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'error',
        });
      },
    });
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.isImageSelected = !!this.selectedFile;
    console.log('Selected file:', this.selectedFile);
  }
}
