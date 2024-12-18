import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { StoryService } from '../story.service';
import { Book } from '../model/book.model';

@Component({
  selector: 'xp-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.css']
})
export class LibraryListComponent {
 
  wardrobeOpen = false;
  adminUsernamesMap: Map<number, string> = new Map();
  displayedEntities: Book[] = []; // Lista knjiga sa ispravnim tipom
  chunkedEntities: Book[][] = []; // Grupisane knjige

  constructor(private router: Router, private authService: AuthService, private imageService: ImageService, private storyService: StoryService) {
    imageService.setControllerPath("administrator/image");
  }

  ngOnInit(): void {
    
    this.storyService.getBooks().subscribe({
      next: (books) => {
        this.displayedEntities = books; // Ažurirajte sa dobijenim knjigama
        this.chunkBooks(); // Grupisanje knjiga za prikaz
        this.populateAdminUsernames();
      },
      error: (err) => console.error('Error fetching books:', err)
    });
  }

  // Grupisanje knjiga po redovima (maksimalno 6 u jednom redu)
  private chunkBooks(): void {
    const chunkSize = 6;
    this.chunkedEntities = []; // Resetujte postojeće grupe
    for (let i = 0; i < this.displayedEntities.length; i += chunkSize) {
      this.chunkedEntities.push(this.displayedEntities.slice(i, i + chunkSize));
    }
  }

  private populateAdminUsernames(): void {
    this.displayedEntities.forEach((book) => {
      const adminId = book.adminId; // Pretpostavljamo da svaka knjiga ima adminId
      const bookId = book.id; // ID knjige za mapu
  
      if (adminId !== undefined && bookId !== undefined) { // Provera da adminId i bookId nisu undefined
        this.storyService.getUser(adminId).subscribe({
          next: (username) => {
            this.adminUsernamesMap.set(bookId, username); // Popunjavanje mape
          },
          error: (err) => console.error(`Error fetching username for adminId ${adminId}:`, err)
        });
      }
    });
  }
  
  getUsernameByBookId(bookId: number): string | undefined {
    
    if (this.adminUsernamesMap.has(bookId)) {
      return this.adminUsernamesMap.get(bookId)!; 
    }
    return undefined; 
  }
  
  openWardrobe() {
    this.wardrobeOpen = true;

    // Dodaj klasu "open" na vrata
    const wardrobeElement = document.querySelector('.wardrobe');
    if (wardrobeElement) {
      wardrobeElement.classList.add('open');
    }
  }
  openStories(id:number) {
    console.log("Card clicked!");
    this.router.navigate(['/book',id]);
  }
}
