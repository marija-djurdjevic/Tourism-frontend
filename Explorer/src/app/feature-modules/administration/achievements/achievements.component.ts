import { Component } from '@angular/core';
import { Achievement } from '../model/achievement.model';
import { EncounterService } from '../../encounters/encounter.service';
import { AdministrationService } from '../administration.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.css']
})
export class AchievementsComponent {
  hoverAchievement: any = null;
  achievements: Achievement[];


  constructor(private administrationService: AdministrationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.administrationService.getAchievements().subscribe({
      next: (result: Achievement[]) => {
        this.achievements = result;
      },
      error: () => {
        this.snackBar.open('Unable to load achievements', 'Close', { duration: 3000 });
      }
    });
  }

  getAchievementType(type: number): string {
    switch (type) {
      case 0:
        return 'Review Created';
      case 1:
        return 'Photos in Review';
      case 2:
        return 'Social Encounters';
      case 3:
        return 'Secret Places Found';
      case 4:
        return 'Challenges Completed';
      case 5:
        return 'Tour Completed';
      case 6:
        return 'Encounters Created';
      case 7:
        return 'Points Earned';
      default:
        return 'Unknown';
    }
  }
}
