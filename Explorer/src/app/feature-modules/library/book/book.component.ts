import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { StoryService } from '../story.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Story } from '../model/story.model';
import { Book } from '../model/book.model';

@Component({
  selector: 'xp-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  bookId:number;
  book:Book;
  leftPageVisible:boolean=false;
  endPage:boolean=false;
  pages: any[] = [];
  cond:boolean=false;
  flippedPages: number[] = [];
  isLoading=false;
  displayedEntities : Story[] = [];
  constructor(private router: Router,private route: ActivatedRoute, private authService: AuthService,private cd: ChangeDetectorRef, private imageService: ImageService, private service: StoryService) { imageService.setControllerPath("tourist/image");} 
  flipBack(): void {
    if (this.flippedPages.length > 0) {
      // Remove the last flipped page
      const lastFlippedIndex = this.flippedPages.pop()!;
      
      // Update `leftPageVisible`
      this.leftPageVisible = this.flippedPages.length > 0;
  
      // Update `endPage`
      this.endPage = false;
      
      // Debugging state
      console.log('Flipped Pages:', this.flippedPages);
      console.log('Left Page Visible:', this.leftPageVisible);
      console.log('End Page:', this.endPage);
    }
  }

  flipBackEnd(): void {
    if (this.flippedPages.length > 1) {
      // Temporarily hide the back page to ensure smooth transition
      console.log('Endddddddddddddd');
      this.endPage = false;
      // Remove the last two flipped pages
      this.flippedPages.pop(); // Remove last page
    // Remove second-to-last page
      this.leftPageVisible = this.flippedPages.length > 0;
     
      // Force Angular to update the DOM
      this.cd.detectChanges();
  
      // Update `leftPageVisible` after ensuring the DOM reflects the changes
     
    }
  }
  
  
  
  flipPage(index: number): void {
    if (!this.flippedPages.includes(index)) {
      this.flippedPages.push(index);
    }
    if(index + 1>0 && index<=this.displayedEntities.length ){
      this.leftPageVisible = true;
    }else{
      this.leftPageVisible = false;
    }
    if(index== this.displayedEntities.length+1){
      this.endPage = true;
    }else{
      this.endPage= false;
    }
  }
  ngOnInit(): void {
    this.bookId = +this.route.snapshot.paramMap.get('id')!;
    this.service.getBookById(this.bookId).subscribe({
      next: (result: any) => {
        this.book = result;      
      },
    });
    this.service.getStoriesInBook(this.bookId).subscribe({
      next: (result: any) => {
        this.displayedEntities = result;      
        this.isLoading=false;
       

        this.imageService.setControllerPath("tourist/image");
        this.displayedEntities.forEach(element => {
          this.imageService.getImage(element.imageId.valueOf()).subscribe((blob: Blob) => {
            console.log(blob);  // Proveri sadržaj Blob-a
            if (blob.type.startsWith('image')) {
              element.image = URL.createObjectURL(blob);
              this.cd.detectChanges();
            } else {
              console.error("Blob nije slika:", blob);
            }
          });

        });
        this.pages = [
          { title: this.book.title, content: '', image: '' }, // Front cover
          ...this.displayedEntities, // Pages from backend
          { title: '', content: '', image: '' } // Back cover (empty)
        ];
        console.log('Pages array:', this.pages);

      },
      error: (err: any) => {
        console.error('Error:', err);
      },
    });
  
  // Flip a page
  
}
}
