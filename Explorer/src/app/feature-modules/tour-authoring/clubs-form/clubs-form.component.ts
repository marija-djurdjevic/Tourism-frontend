import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';
import { Clubs } from '../model/clubs.model';

@Component({
  selector: 'xp-clubs-form',
  templateUrl: './clubs-form.component.html',
  styleUrls: ['./clubs-form.component.css']
})
export class ClubsFormComponent {
  @Output() clubsUpdated = new EventEmitter<null>();
  @Input() club: Clubs;
  @Input() shouldEdit: boolean = false;

  constructor(private service: TourAuthoringService) { }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  })

  ngOnChanges(): void {
    this.clubForm.reset();
    if(this.shouldEdit) {
      this.clubForm.patchValue(this.club);
    }
  }

  addClub(): void{
    const club: Clubs = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      image: this.clubForm.value.image || ""

    }
    this.service.addClub(club).subscribe({
      next: (_) => {
        console.log("uspesno")
        this.clubsUpdated.emit();
      }
    });
  }

  updateClub(): void {
    const club: Clubs = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      image: this.clubForm.value.image || "",
    };
    club.id = this.club.id;
    this.service.updateClub(club).subscribe({
      next: () => { this.clubsUpdated.emit();}
    });
  }
}
