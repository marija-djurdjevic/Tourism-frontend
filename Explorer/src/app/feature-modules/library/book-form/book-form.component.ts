import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from '../story.service';
import { Book } from '../model/book.model';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { PublishRequest } from '../../tour-execution/model/publish-request.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
@Component({
  selector: 'xp-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  book: Book;
  entityId: number | null = null;
  requestId: number | null = null;
  user: User | undefined;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private service: StoryService,
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourExecutionService,
    private authService: AuthService
  ) {
    // Initialize the form with controls
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      bookColour: ['#FFFFFF', Validators.required] // Default color
    });

    // Initialize the book object
    this.book = {
      id: 0,
      adminId: 0,
      title: '',
      pageNum: 0,
      bookColour: '#43b941',
    };
  }

  ngOnInit(): void {

    this.authService.user$.subscribe((user: User | undefined) => {
      this.user = user;
      console.log("User role:", this.user?.role);
  });
    // Get entityId from the route parameters
    this.route.params.subscribe(params => {
      this.entityId = params['entityId'] ? Number(params['entityId']) : null;
      this.requestId = params['requestId']? Number(params['requestId']) : null;
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      this.snackBar.open('Please fill all fields.', 'Close', {
        duration: 3000,
        panelClass: 'error'
      });
      return;
    }

    // Set book details from the form
    this.book.title = this.bookForm.get('title')?.value || '';
    this.book.pageNum = 0;
    this.book.bookColour = this.bookForm.get('bookColour')?.value || '#FFFFFF';

    // Add the book and perform additional operations after creation
    this.addBook(this.book);
  }

  addBook(book: Book): void {
    this.service.addBook(book).subscribe({
      next: (response) => {
        console.log('Added Book', response);

        // Call the story service function after creating the book
        if (this.entityId) {
          this.callStoryService(this.entityId, response.id);
        }

        this.snackBar.open('Book added successfully!', 'Close', {
          duration: 3000,
          panelClass: 'success'
        });
        this.router.navigate(['/publishRequestList']);
        
      },
      error: () => {
        console.log('Error adding book');
        this.snackBar.open('Failed to add book. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'error'
        });
      }
    });
  }

  callStoryService(entityId: number, bookId: number): void {
    this.service.getStoryById(entityId).subscribe({
      next: (result) => {
        console.log('Fetched story:', result);
        result.bookId = bookId;
        this.service.updateStory(result).subscribe({
          next: (updateResult) => {
            console.log('Story updated successfully:', updateResult);
            const requestId = this.requestId ?? 0;
                        console.log(requestId);
                        this.tourService.getRequest(requestId).subscribe({
                          
                            next: (request) => {
                             console.log('Request ID:', this.requestId);
            
                              request.status = 1;
                              if(this.user){
                                request.adminId = this.user.id;
                              }
                             
                              this.tourService.updateRequestStatusStory(request).subscribe({
                                  next: (updatedRequest: PublishRequest) => {
                                    console.log('Request successfully updated:', updatedRequest);
                                    
                                   
                                  },
                                  error: (err) => {
                                    console.error('Error updating request:', err);
                                  }
                              });
                          
                            },
                            error: (err) => {
                              console.error('Error fetching story:', err);
                            }
                          }); 



          },
          error: (err) => {
            console.error('Error updating story:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching story:', err);
      }
    });
  }
}
