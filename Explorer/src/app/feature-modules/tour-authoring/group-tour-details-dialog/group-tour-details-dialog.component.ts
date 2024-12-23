import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TourAuthoringService } from '../tour-authoring.service';
import { GroupTourExecution } from '../../tour-shopping/model/group-tour-exectuion.model';
import { ChangeDetectorRef } from '@angular/core';
import { GroupTour } from '../model/group-tour.model';

@Component({
  selector: 'app-group-tour-details-dialog',
  templateUrl: './group-tour-details-dialog.component.html',
  styleUrls: ['./group-tour-details-dialog.component.css'],
})
export class GroupTourDetailsDialogComponent {
  
  filteredExecutions: { fullName: string; status: string }[] = [];
  groupTour: GroupTour | undefined = undefined;

  isLoading = true;
  isDialogOpen = false;

  constructor(
    private service: TourAuthoringService,
    private dialogRef: MatDialogRef<GroupTourDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupTourId: number },
    private cdr: ChangeDetectorRef
  ) {
    console.log('Konstruktor: Podaci primljeni:', this.data);
    this.dialogRef.afterOpened().subscribe(() => {
      console.log('Dijalog je otvoren');
      this.loadAndFilterExecutions(this.data.groupTourId); 
      this.loadGroupTour();
    });
  }

  loadAndFilterExecutions(groupTourId: number): void {
    this.isLoading = true;
  
    this.service.getAllGroupTourExecutions().subscribe({
      next: (result) => {
        console.log('Svi podaci iz servisa:', result.results);
  
        const filteredExecutions = result.results.filter(
          (execution) => execution.groupTourId === groupTourId && !execution.isFinished
        );
  
        console.log('Filtrirani podaci:', filteredExecutions);
  
        const profileRequests = filteredExecutions.map((execution) =>
          this.service.getUserProfileById(execution.touristId).toPromise()
        );
  
        Promise.all(profileRequests)
          .then((profiles) => {
            this.filteredExecutions = filteredExecutions.map((execution, index) => {
              const profile = profiles[index];
              return {
                fullName: profile ? `${profile.firstName} ${profile.lastName}` : 'Nepoznato ime',
                status: execution.isFinished ? 'Finished' : 'In Progress',
              };
            });
  
            console.log('Izmenjeni podaci sa imenima i prezimenima:', this.filteredExecutions);
  
            this.isLoading = false;
            this.cdr.detectChanges();
          })
          .catch((error) => {
            console.error('Greška prilikom dohvatanja korisničkih podataka:', error);
            this.isLoading = false;
          });
      },
      error: (error) => {
        console.error('Greška prilikom dohvatanja podataka o grupnim turama:', error);
        this.isLoading = false;
      },
    });
  }
  
  loadGroupTour(): void {
    this.isLoading = true;

    // Dobavi sve grupne ture i filtriraj prema groupTourId
    this.service.getAllGroupTours().subscribe({
      next: (result) => {
        this.groupTour = result.results.find(
          (tour) => tour.id === this.data.groupTourId
        );

        if (this.groupTour) {
          console.log('Grupna tura:', this.groupTour);
        } else {
          console.error('Grupna tura nije pronađena!');
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Greška prilikom dohvatanja grupnih tura:', error);
        this.isLoading = false;
      },
    });
  }

  startTour(): void {
    if (!this.groupTour) {
      console.error('Grupna tura nije učitana!');
      return;
    }

   
    const updatedTour: GroupTour = {
      ...this.groupTour,
      progress: 1, 
    };

    this.isLoading = true;

    this.service.updateGroupTour(updatedTour).subscribe({
      next: () => {
        console.log('Grupna tura uspešno ažurirana na InProgress.');
        this.groupTour!.progress = 1; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Greška prilikom ažuriranja grupne ture:', error);
        this.isLoading = false;
      },
    });
  }

  getProgressText(progress: number): string {
    switch (progress) {
      case 0:
        return 'Scheduled';
      case 1:
        return 'In Progress';
      case 2:
        return 'Finished';
      case 3:
        return 'Canceled';
      default:
        return 'Unknown';
    }
  }
  
  canStartTour(): boolean {
    if (!this.groupTour || !this.groupTour.startTime) {
      return false;
    }

    const currentTime = new Date();
    const startTime = new Date(this.groupTour.startTime);

    const fifteenMinutes = 15 * 60 * 1000;
    return (
      currentTime.getTime() >= startTime.getTime() - fifteenMinutes &&
      currentTime.getTime() <= startTime.getTime() + fifteenMinutes
    );
  }

  cancelTour(): void {
    if (!this.groupTour) {
      console.error('Group tour not loaded!');
      return;
    }
  
    const updatedTour: GroupTour = {
      ...this.groupTour,
      progress: 3, 
    };
  
    this.isLoading = true;
  
    this.service.updateGroupTour(updatedTour).subscribe({
      next: () => {
        console.log('Group tour successfully canceled.');
        this.groupTour!.progress = 3; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error canceling the group tour:', error);
        this.isLoading = false;
      },
    });
  }
  
  isTourStartable(): boolean {
    return this.filteredExecutions.length >= this.groupTour?.touristNumber!;
  }
  
  showCancelOrStart(): boolean {
    return (
      this.groupTour?.progress === 0 &&
      (!this.isTourStartable() || this.canStartTour())
    );
  }
  
  finishTour(): void {
    if (!this.groupTour) {
      console.error('Group tour not loaded!');
      return;
    }
  
    const updatedTour: GroupTour = {
      ...this.groupTour,
      progress: 2, 
    };
  
    this.isLoading = true;
  
    this.service.updateGroupTour(updatedTour).subscribe({
      next: () => {
        console.log('Group tour successfully finished.');
        this.groupTour!.progress = 2; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error finishing the group tour:', error);
        this.isLoading = false;
      },
    });
  }
  

  close(): void {
    this.dialogRef.close();
  }
}
