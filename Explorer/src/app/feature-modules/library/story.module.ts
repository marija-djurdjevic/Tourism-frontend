import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
 import { BookComponent } from './book/book.component';
 import { BookListComponent } from './book-list/book-list.component';
 import { BookFormComponent } from './book-form/book-form.component';
 import { StoryFormComponent
  } from './story-form/story-form.component';
import { LibraryListComponent } from './library-list/library-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    BookComponent,
    BookListComponent,
    BookFormComponent,
    StoryFormComponent,
    LibraryListComponent,
    
  ],
  imports: [
    MatSnackBarModule,
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    BookComponent,
    BookListComponent,
    BookFormComponent,
    StoryFormComponent,
    LibraryListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoryModule { }
