import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoryService } from '../story.service';
import { Book } from '../model/book.model';

@Component({
  selector: 'xp-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {
  bookForm: FormGroup;
  book: Book;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private service: StoryService
  ) {
    // Inicijalizacija forme sa kontrolama
    this.bookForm = this.fb.group({
      title: ['', Validators.required], 
      
      bookColour: ['#FFFFFF', Validators.required] // Dodata boja sa podrazumevanom vrednošću
    });

    // Inicijalizacija knjige
    this.book = {
      id: 0,
      adminId: 0,
      title: '',
      pageNum: 0,
      bookColour: '#43b941',
    };
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched(); 
      this.snackBar.open('Please fill all fields.', 'Close', {
        duration: 3000,
        panelClass: "error"
      });
      return; 
    }

    // Postavljanje vrednosti iz forme
    this.book.title = this.bookForm.get('title')?.value || '';
    this.book.pageNum =  0;
    this.book.bookColour = this.bookForm.get('bookColour')?.value || '#FFFFFF';

    this.addBook(this.book);
  }

  addBook(book: Book): void {
    this.service.addBook(book).subscribe({
      next: (response) => {
        console.log('Added Book', response);
        this.snackBar.open('Book added successfully!', 'Close', {
          duration: 3000,
          panelClass: "success"
        });
      },
      error: () => {
        console.log('Error adding book');
        this.snackBar.open('Failed to add book. Please try again.', 'Close', {
          duration: 3000,
          panelClass: "error"
        });
      }
    });
  }

  updateColorPreview(): void {
    const selectedColor = this.bookForm.get('bookColour')?.value;
    console.log('Selected Color:', selectedColor); 
  }
  
}
