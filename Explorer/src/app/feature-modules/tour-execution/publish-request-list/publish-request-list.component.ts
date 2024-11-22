import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { PublishRequest } from '../model/publish-request.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Comment} from '../model/problem.model';
import { DatePipe, CommonModule } from '@angular/common';


@Component({
    selector: 'xp-request-list',
    templateUrl: './publish-request-list.component.html',
    styleUrls: ['./publish-request-list.component.css']

})export class PublishRequestComponent {
    entities: PublishRequest[] = [];   
    displayedEntities: PublishRequest[] = [];
  
    currentPage = 0;
    totalPages = 0;
    pageSize = 9;
  
    user: User | undefined;

    usernamesMap: Map<number, string> = new Map();

    constructor(private service: TourExecutionService, private tourService:TourAuthoringService, private router: Router, private authService: AuthService) {} 
    ngOnInit(): void {

        this.authService.user$.subscribe((user: User | undefined) => {
          this.user = user;
          console.log("User role:", this.user?.role);
          this.loadAllRequests();

      });
      }
      loadAllRequests(): void {
        if(this.user?.role=='administrator'){
          this.service.getPublishRequests().subscribe({
            next: (result: PagedResults<PublishRequest>) => {
              const filteredResults = result.results.filter(e => e.status === 0);
              this.entities = filteredResults;
              this.populateUsernamesAd(this.entities.map(e => e.authorId));
             
            },
            error: (err: any) => {
              console.log(err);
            }
          });
        }
    }

    getEnumForStatus(id: number): string {
    
        let ret: string;
    
        switch (id) {
        case 0:
          return 'Pending';
        case 1:
          return 'Accepted';
        case 2:
            return 'Reject';
        default:
          return 'Unknown'; 
        }
    }

    getEnumForType(id: number): string {
    
        let ret: string;
    
        switch (id) {
        case 0:
          return 'Object';
        case 1:
          return 'KeyPoint';
        default:
          return 'Unknown'; 
        }
    }

    populateUsernamesAd(ids: number[]): void {
        ids.forEach(id => {
            this.authService.getUsernameAd(id).subscribe(username => {
                this.usernamesMap.set(id, username);
            });
        });
    }
    acceptRequest(request: PublishRequest | undefined): void {

      if (request === undefined) {
        console.error('Request ID is undefined.');
        return;
      }

      if (!this.user || !this.user.id) {
        console.error('User is undefined or does not have an ID.');
        return;
      }

      request.status = 1;
      request.adminId = this.user.id; 

      this.service.updateRequestStatus(request).subscribe({
        next: (updatedRequest: PublishRequest) => {
          console.log('Request successfully updated:', updatedRequest);
        },
        error: (err) => {
          console.error('Error updating request:', err);
        },
      });
    
     
    }
}