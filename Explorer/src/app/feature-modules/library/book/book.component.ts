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
  displayBlankPage:boolean = true;
  leftPageVisible:boolean=false;
  endPage:boolean=false;
  pages: any[] = [];
  cond:boolean=false;
  flippedPages: number[] = [];
  isLoading=false;
  adminUsernamesMap: Map<number, string> = new Map();
  displayedEntities : Story[] = [];
  constructor(private router: Router,private route: ActivatedRoute, private authService: AuthService,private cd: ChangeDetectorRef, private imageService: ImageService, private service: StoryService) { imageService.setControllerPath("tourist/image");} 
  flipBack(): void {
    if (this.flippedPages.length > 0) {
      const lastFlippedIndex = this.flippedPages.pop()!;  
      this.leftPageVisible = this.flippedPages.length > 0;
      if(this.flippedPages.length % this.displayedEntities.length == 0){
        this.displayBlankPage = true;
      }
      this.endPage = false;
      console.log('Flipped Pages:', this.flippedPages);
      console.log('Left Page Visible:', this.leftPageVisible);
      console.log('End Page:', this.endPage);
    }
  }

  flipBackEnd(): void {
    if (this.flippedPages.length > 1) {
      console.log('Endddddddddddddd');
      this.endPage = false;
      this.flippedPages.pop();
      this.leftPageVisible = this.flippedPages.length > 0; 
      this.cd.detectChanges();
     
    }
  }
  
  getUsernameByBookId(bookId: number): string | undefined {
    
    if (this.adminUsernamesMap.has(bookId)) {
      return this.adminUsernamesMap.get(bookId)!; 
    }
    return undefined; 
  }
  
  flipPage(index: number): void {
    if (!this.flippedPages.includes(index)) {
      this.flippedPages.push(index);
    }
    if(index==0){
      this.displayBlankPage = false;
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
        this.service.getUser(result.adminId).subscribe({
          next: (username) => {
            this.adminUsernamesMap.set(result.id, username);
          },
          error: (err) => console.error(`Error fetching username for adminId ${result.adminId}:`, err)
        });   
      },
    });

    
    this.service.getStoriesInBook(this.bookId).subscribe({
      next: (result: any) => {
        this.displayedEntities = result;      
        this.isLoading=false;
       

        this.imageService.setControllerPath("tourist/image");
        this.displayedEntities.forEach(element => {
          this.imageService.getImage(element.imageId.valueOf()).subscribe((blob: Blob) => {
            console.log(blob);  
            if (blob.type.startsWith('image')) {
              element.image = URL.createObjectURL(blob);
              this.cd.detectChanges();
            } else {
              console.error("Blob nije slika:", blob);
            }
          });

        });
        this.pages = [
          { title: this.book.title, content: '', image: '' }, 
          ...this.displayedEntities, 
          { title: '', content: '', image: '' }
        ];
        console.log('Pages array:', this.pages);

      },
      error: (err: any) => {
        console.error('Error:', err);
      },
    });

}
}
