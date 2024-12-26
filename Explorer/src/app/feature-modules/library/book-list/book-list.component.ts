import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';
import { TourExecutionService } from '../../tour-execution/tour-execution.service';
import { StoryService } from '../story.service';
import { Book } from '../model/book.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublishRequest } from '../../tour-execution/model/publish-request.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
 
  wardrobeOpen = false;
  adminUsernamesMap: Map<number, string> = new Map();
  displayedEntities: Book[] = []; // Lista knjiga sa ispravnim tipom
  chunkedEntities: Book[][] = []; // Grupisane knjige
  entityId: number | null = null;
  requestId: number | null = null;
  bookId: number | null = null;
  user: User | undefined;

  constructor(private router: Router, private authService: AuthService, private imageService: ImageService, private storyService: StoryService, private route: ActivatedRoute, private service: StoryService, private snackBar: MatSnackBar, private tourService: TourExecutionService) {
    imageService.setControllerPath("administrator/image");
   
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
    this.storyService.getBooksForAuthor().subscribe({
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
        this.storyService.getUserForAdmin(adminId).subscribe({
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
  
  callStoryService(entityId: number, bookId: number): void {
    this.service.getStoryById(entityId).subscribe({
      next: (result) => {
        console.log('Fetched story:', result);
        result.bookId = bookId;
        result.status = 1;
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
                 
                  this.tourService.acceptRequestStatusStory(request).subscribe({
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
 
  openStories(id: number) {

    const entityId = this.entityId ?? 0; 
   
    this.callStoryService(entityId, id);
    this.snackBar.open('Story  successfully added to book!', 'Close', {
        duration: 2000,
        panelClass: 'success'
      });
    
     





    
    
    this.router.navigate(['/publishRequestList']);
  }
  


}
