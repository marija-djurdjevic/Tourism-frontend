import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { StoryService } from '../story.service';

@Component({
  selector: 'xp-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.css']
})
export class LibraryListComponent {
  chunkedEntities: any[] = []; // Declare chunkedEntities
  wardrobeOpen = false;
  displayedEntities = [
    { title: 'Sunset over the Mountains' },
    { title: 'City Lights at Night' },
    { title: 'Exploring Ancient Ruins' },
    { title: 'A Walk in the Park' },
    { title: 'Beachfront Paradise' },
    { title: 'Autumn Leaves in the Forest' },
    { title: 'Skydiving Adventure' },
    { title: 'Cultural Heritage Tour' },
    { title: 'Vibrant Street Art' },
    { title: 'Wildlife Safari' }
  ];

  constructor(private router: Router, private authService: AuthService, private imageService: ImageService, private storyService: StoryService) {
    imageService.setControllerPath("administrator/image");
  }

  ngOnInit(): void {
    
    this.storyService.getBooks().subscribe({
      next: (books) => {
        this.displayedEntities = books; // Ažurirajte sa dobijenim knjigama
        this.chunkBooks(); // Grupisanje knjiga za prikaz
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



  openWardrobe() {
    this.wardrobeOpen = true;

    // Dodaj klasu "open" na vrata
    const wardrobeElement = document.querySelector('.wardrobe');
    if (wardrobeElement) {
      wardrobeElement.classList.add('open');
    }
  }
  openStories() {
    console.log("Card clicked!");
    this.router.navigate(['/book']);
  }
}
