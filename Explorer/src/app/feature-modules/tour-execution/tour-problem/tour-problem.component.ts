import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourExecutionService } from '../tour-execution.service';
import { Problem } from '../model/problem.model';
import { Comment} from '../model/problem.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-tour-problem',
  templateUrl: './tour-problem.component.html',
  styleUrls: ['./tour-problem.component.css'],
  providers: [DatePipe] 
})
export class TourProblemComponent {

  id: string;
  deadline: Date;
  status: 0;
  comm : Comment = {content: '',
  type: 0,
  senderId: 0,
  sentTime: ''};
  user: User | undefined;
  touristComments: Comment[] =[]
  authorComments: Comment[] =[]
  adminComments: Comment[] =[]
  allComments: Comment[] =[]
  tourMap: Map<number|undefined, string> = new Map();

  closeProblemFlag: string;
  closeTourFlag: string;
  hadDeadlinePassed : string;
  username : string;
  constructor(private route: ActivatedRoute,private snackBar:MatSnackBar, private service: TourExecutionService,private authService: AuthService, private datePipe: DatePipe, private router : Router, private tourService : TourAuthoringService) {}
  
  problem: Problem= {
    status: 0,
    touristId:0,
    tourId:0,
    deadline: new Date(),
    details: {
      problemPriority: 0,
      category: 0,
      time: '',
      explanation: '',
    },
    comments: [],
    notifications: []
  };
  
  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id') as string;
    this.authService.user$.subscribe((user: User | undefined) => {
        this.user = user;
    });
    if(this.user?.role=='administrator'){
      
      this.service.getById(this.id).subscribe((problem: Problem) => {
        this.problem = problem as Problem;    
        this.allComments = this.problem.comments;
        this.authService.getUsernameAd(this.problem.touristId).subscribe((username: string) => {
          this.username = username;
      });
        this.setComments();
        if (this.problem.deadline) {
          this.hadDeadlinePassed = new Date(this.problem.deadline) < new Date() ? 'true' : 'false';
        } else {
          
          this.hadDeadlinePassed = 'false'; 
        }
        this.fetchAndMapTours();
        this.closeProblemFlag = (this.problem.status == 1 && this.hadDeadlinePassed == 'true') || this.problem.status == 1 ? '' : 'disabled';
        this.closeTourFlag = (this.problem.status == 0 && this.hadDeadlinePassed == 'true') || (this.problem.status == 3 && this.hadDeadlinePassed == 'true')  ? '' : 'disabled';
        });
    }
    if(this.user?.role=='tourist'){
      this.service.touristGById(this.id).subscribe((problem: Problem) => {
        this.problem = problem as Problem;    
        this.allComments = this.problem.comments;
        this.authService.getUsernameT(this.problem.touristId).subscribe((username: string) => {
          this.username = username;
      });
        this.setComments();

        if (this.problem.deadline) {
          this.hadDeadlinePassed = new Date(this.problem.deadline) < new Date() ? 'true' : 'false';
        } else {
          
          this.hadDeadlinePassed = 'false'; 
        }
        this.fetchAndMapTours();
        this.closeProblemFlag = (this.problem.status == 1 && this.hadDeadlinePassed == 'true') ? '' : 'disabled';
        this.closeTourFlag = (this.problem.status == 0 && this.hadDeadlinePassed == 'true') || (this.problem.status == 3 && this.hadDeadlinePassed == 'true')  ? '' : 'disabled';
        });
    }

    if(this.user?.role=='author'){
      this.service.authorgetById(this.id).subscribe((problem: Problem) => {
        this.problem = problem as Problem;    
        this.allComments = this.problem.comments;
        this.setComments();
        this.authService.getUsernameAu(this.problem.touristId).subscribe((username: string) => {
          this.username = username;
      });
        if (this.problem.deadline) {
          this.hadDeadlinePassed = new Date(this.problem.deadline) < new Date() ? 'true' : 'false';
        } else {
          
          this.hadDeadlinePassed = 'false'; 
        }
        this.fetchAndMapTours();
        this.closeProblemFlag = (this.problem.status == 1 && this.hadDeadlinePassed == 'true') || this.problem.status == 1 ? '' : 'disabled';
        this.closeTourFlag = (this.problem.status == 0 && this.hadDeadlinePassed == 'true') || (this.problem.status == 3 && this.hadDeadlinePassed == 'true')  ? '' : 'disabled';
        });
    }

    
  }

  setComments(){
    for (let comment of this.allComments) {
      if (comment.type == 0)  this.touristComments.push(comment); 
      if (comment.type == 1)  this.authorComments.push(comment); 
      if (comment.type == 2)  this.adminComments.push(comment); 
      }
  }
  
  comments: string[] = [
    "ja sam rekao",
    "ja sam administrator znam bolje",
    "aj ne lupajte ja sam autor valjda znam"
  ];
  
  getDate(input: string): string {
    const date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

hasDeadLinePassed(input: Date): string {
  return new Date(input) < new Date() ? 'true' : 'false';
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

  getStatusEnum(id: number): string {
    
    let ret: string;

    switch (id) {
    case 0:
      return 'Pending';
    case 1:
      return 'Solved';
    case 2:
      return 'Closed';
    case 3:
      return 'Expired';
    default:
      return 'Unknown'; 
    }
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
  getById(id: number): string | undefined {
    return this.tourMap.get(id);
  }


  closeTourProblem():void{
    if(this.user?.role == 'administrator')
    {
      this.service.closeTourProblem(this.problem).subscribe({
        next: () => {
          console.log('Tour problem closed');
          this.router.navigate(['/problems']);
          this.snackBar.open('Problem closed successfully!', 'Close', {
            duration: 3000,
            panelClass:"succesful"
          });
        },
        error: (err) => {
          console.error('Tour problem not closed:', err);
          this.snackBar.open('Failed to close problem. Please try again.', 'Close', {
            duration: 3000,
            panelClass:"succesful"
          });
        }
      });
    }
}

closeTour(): void {
  if (this.user?.role === 'administrator') {
    this.service.getTour(this.problem.tourId).subscribe({
      next: (tour) => {
        this.service.closeTour(tour).subscribe({
          next: () => {
            console.log('Tour closed successfully');
            this.snackBar.open('Tour closed successfully!', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
            // Call closeTourProblem after closeTour completes
            this.closeTourProblem();
          },
          error: (err) => {
            console.error('Failed to close the tour:', err);
            this.snackBar.open('Failed to close tour. Please try again.', 'Close', {
              duration: 3000,
              panelClass:"succesful"
            });
          }
        });
      },
      error: (err) => {
        console.error('Failed to retrieve tour:', err);
        this.snackBar.open('Failed to retrieve tour. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });
  }
}

  makeComment():void{
    if(this.user?.role == 'administrator'){
    const now = new Date();
    const formattedDate = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.adminComments.push(this.comm); 
    this.comm.type=2;
    this.comm.senderId=this.user.id;
    this.comm.sentTime = formattedDate as string;
    this.service.addComment(this.problem.id as number, this.comm).subscribe({
      next: () => {
        console.log('Comment added successfully');
        this.snackBar.open('Comment added successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.snackBar.open('Failed to add comment. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });

    this.comm  = {content: '',
      type: 0,
      senderId: 0,
      sentTime: ''};
    }

  if(this.user?.role == 'tourist'){
    this.touristComments.push(this.comm); 
    const now = new Date();
    const formattedDate = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.comm.type=0;
    this.comm.senderId=this.user.id;
    this.comm.sentTime = formattedDate as string;
    this.service.touristAddComment(this.problem.id as number, this.comm).subscribe({
      next: () => {
        console.log('Comment added successfully');
        this.snackBar.open('Comment added successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.snackBar.open('Failed to add comment. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });

    this.comm  = {content: '',
      type: 0,
      senderId: 0,
      sentTime: ''};
    }
  
  if(this.user?.role == 'author'){
    this.authorComments.push(this.comm);
    const now = new Date();
    const formattedDate = this.datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss');
    this.comm.type=1;
    this.comm.senderId=this.user.id;
    this.comm.sentTime = formattedDate as string;
    this.service.authorAddComment(this.problem.id as number, this.comm).subscribe({
      next: () => {
        console.log('Comment added successfully');
        this.snackBar.open('Comment added successfully!', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.snackBar.open('Failed to add comment. Please try again.', 'Close', {
          duration: 3000,
          panelClass:"succesful"
        });
      }
    });

    this.comm  = {content: '',
      type: 0,
      senderId: 0,
      sentTime: ''};
    }
  }

}
