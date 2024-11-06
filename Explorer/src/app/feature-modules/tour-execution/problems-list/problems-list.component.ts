import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from '../model/problem.model';
import { TourAuthoringService } from 'src/app/feature-modules/tour-authoring/tour-authoring.service';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Comment} from '../model/problem.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'xp-problems-list',
  templateUrl: './problems-list.component.html',
  styleUrls: ['./problems-list.component.css'],
  providers: [DatePipe] 
})
export class ProblemsListComponent {
  entities: Problem[] = [];   
  displayedEntities: Problem[] = [];
  tourMap: Map<number|undefined, string> = new Map();
  currentPage = 0;
  totalPages = 0;
  pageSize = 9;
  selectedDate : Date;
  flag: Boolean = false;
  flag2: Boolean = false;
  flag3: Boolean = false;
  flag4: Boolean = false;
  user: User | undefined;
  selectedId: number;
  probName : string;
  comm : Comment = {content: '',
    type: 0,
    senderId: 0,
    sentTime: ''};
    selectedItem : Problem;
    times:string[] =[];
  selectedTime:string;
                   

  constructor(private service: TourExecutionService,  private cdr: ChangeDetectorRef,private tourService:TourAuthoringService, private router: Router,private authService: AuthService,  private datePipe: DatePipe) {} 

  ngOnInit(): void {
    
 
    this.authService.user$.subscribe((user: User | undefined) => {
      this.user = user;
      console.log("User role:", this.user?.role);
      this.loadAllProblems();
      this.fetchAndMapTours();
      this.generateTimeOptions();

  });
  }
  generateTimeOptions() {
    const startHour = 0; 
    const endHour = 23;  
    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour % 12 || 12; 
      const ampm = hour < 12 ? 'AM' : 'PM';
      this.times.push(`${formattedHour}:00 ${ampm}`);
      this.times.push(`${formattedHour}:30 ${ampm}`);
    }
  }
  combineDateAndTime(date: Date, time: string): Date {
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;

    const matches = time.match(timeRegex);
  
    if (!matches) {
      throw new Error('Invalid time value: ' + time);
    }
  
    let hours = parseInt(matches[1], 10) + 1;
    const minutes = parseInt(matches[2], 10);
    const ampm = matches[3];
  
      if (ampm.toUpperCase() === 'PM' && hours<13) {
        hours += 12; 
      }else if(hours == 13 && ampm.toUpperCase() === 'AM'){
        hours +=12;
      }

    const seconds = 0;
  
    const year = date.getFullYear();
    const month = date.getMonth(); 
    const day = date.getDate();
  
    return new Date(year, month, day, hours, minutes, seconds);
  }
  

  deadlineSet() :void{
    console.log("TIME:" + this.selectedTime);
    let datetime = this.combineDateAndTime(this.selectedDate, this.selectedTime);
    console.log("TIME:" + this.selectedTime);
    this.service.setDeadline(this.selectedId, datetime).subscribe({
      
      error: (err: any) => {
        console.log(err);
      }
    });
    this.flag3=false;
    this.flag4=false;
  }
  loadAllProblems(): void {
    if(this.user?.role=='administrator'){
      this.service.getProblems().subscribe({
        next: (result: PagedResults<Problem>) => {
          this.entities = result.results;
          this.updateDisplayedEntities();
          this.totalPages = Math.ceil(this.entities.length / this.pageSize);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
    if(this.user?.role=='author'){
      this.service.authorGetProblems().subscribe({
        next: (result: PagedResults<Problem>) => {
          this.entities = result.results;
          this.updateDisplayedEntities();
          this.totalPages = Math.ceil(this.entities.length / this.pageSize);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
    if(this.user?.role=='tourist'){
      this.service.getTouristProblems().subscribe({
        next: (result: PagedResults<Problem>) => {
          this.entities = result.results;
          this.updateDisplayedEntities();
          this.totalPages = Math.ceil(this.entities.length / this.pageSize);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  updateDisplayedEntities(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedEntities = this.entities.slice(startIndex, startIndex + this.pageSize);
  }
   deadline(){
    this.flag4=true;
    this.flag3=false;
   }
  solve() {
    this.flag = false;
    this.flag2 = true;
    console.log('Solve clicked. flag:', this.flag, 'flag2:', this.flag2); 
    this.cdr.detectChanges();  
}
  fetchAndMapTours(): void {
    if(this.user?.role=='administrator'){
      this.tourService.getAllTours().subscribe({
        next: (result: PagedResults<Tour>) => {
          result.results.forEach((tour) => {
            this.tourMap.set(tour.id, tour.name); 
          });
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    }
    if(this.user?.role=='tourist'){
      this.tourService.getTouristTours().subscribe({
        next: (result: PagedResults<Tour>) => {
          result.results.forEach((tour) => {
            this.tourMap.set(tour.id, tour.name); 
          });
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    }

    if(this.user?.role=='author'){
      this.tourService.getTours().subscribe({
        next: (result: PagedResults<Tour>) => {
          result.results.forEach((tour) => {
            this.tourMap.set(tour.id, tour.name); 
          
          });
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    }
  }

  getDate(input: string): string {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

  getTime(input: string): string {
    const time = new Date(input);
    return time.toLocaleTimeString(); 
  }

  getEnum(id: number): string {
    
    let ret: string;

    switch (id) {
    case 0:
      return 'Other';
    case 1:
      return 'Unclear Instructions';
    case 2:
      return 'Road Obstacles';
    case 3:
      return 'Unreachable Part';
    default:
      return 'Unknown'; 
    }
  }

    getById(id: number): string | undefined {
      return this.tourMap.get(id);
    }

    goToProblem(id : number|undefined, name: string|undefined, item:Problem):void{
      this.flag=false;
      if(this.user?.role == 'tourist'){
        this.flag=true;
        this.selectedId=id as number;
        this.probName = name as string;
        this.selectedItem = item;
      }else  if(this.user?.role == 'administrator'){
        this.flag3=true;
        this.selectedId=id as number;
        this.probName = name as string;
        this.selectedItem = item;
      }else {
      this.router.navigate(['/problem'], { queryParams: { id: id } });
    }
    }

    seeProb():void{
      this.flag=false;
      this.router.navigate(['/problem'], { queryParams: { id: this.selectedId, name: this.probName } });
    }

    finalSolve():void{     
       this.service.changeStatus(this.selectedId, 1).subscribe({
        next: (response) => {
            console.log('Status changed successfully:', response);
        },
        error: (error) => {
            console.error('Error changing status:', error);
        }
    });
      this.flag2=false;
      if(this.comm.content!=''){
        this.makeComment()
      }
      this.cdr.detectChanges();  
    }

    goToNextPage(): void {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
        this.updateDisplayedEntities();
      }
    }
    
    goToPreviousPage(): void {
      
      if (this.currentPage > 0) {
        this.currentPage--;
        this.updateDisplayedEntities();
      }
    }

    makeComment():void{
  
    if(this.user?.role == 'tourist'){
      const now = new Date();
      const formattedDate = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
      this.comm.type=0;
      this.comm.senderId=this.user.id;
      this.comm.sentTime = formattedDate as string;
      this.service.touristAddComment(this.selectedItem.id as number, this.comm).subscribe({
        next: () => {
          console.log('Comment added successfully');
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        }
      });
  
      this.comm  = {content: '',
        type: 0,
        senderId: 0,
        sentTime: ''};
      }
    }

    close(){
      this.flag=false;
      this.flag2=false;
      this.flag3=false;
      this.flag4=false;
      this.cdr.detectChanges();  
    }
    
   
}
