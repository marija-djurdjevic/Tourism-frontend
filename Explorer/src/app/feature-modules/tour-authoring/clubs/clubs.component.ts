import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Clubs } from '../model/clubs.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'xp-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {
  clubs: Clubs[] = [];
  selectedClub: Clubs;
  shouldRenderClubForm: boolean = false;
  shouldEdit: boolean = false;
  image: File;

  constructor(private service: TourAuthoringService, private imageService: ImageService, private cd: ChangeDetectorRef) {
    imageService.setControllerPath("tourist/image");
  }

  ngOnInit(): void {
      this.getClubs();

  }
  getClubs(): void {
    this.service.getClubs().subscribe({
      next: (result: PagedResults<Clubs>) => {
        console.log(result)
        this.clubs = result.results
        // kod za ucitavanje slike po id
        this.clubs.forEach(element => {
          this.imageService.getImage(element.imageId.valueOf()).subscribe((blob: Blob) => {
            console.log(blob);  // Proveri sadržaj Blob-a
            if (blob.type.startsWith('image')) {
              element.image = URL.createObjectURL(blob);
              this.cd.detectChanges();
            } else {
              console.error("Blob nije slika:", blob);
            }
          });

        });
        //kraj
      },
  error: (err: any) => {
    console.log(err)
  }
  })
  }

  deleteClub(id: number): void {
    this.service.deleteClub(id).subscribe({
      next: () => {
        this.getClubs();
      },
    })
  }

  onEditClicked(club: Clubs): void {
    this.selectedClub = club;
    this.shouldRenderClubForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderClubForm = true;
  }
  //clubs: Clubs[] = [{id:0, name: "prvi", description: "najbolji"}, {id:1, name: "prvi nismo", description: "ne i najbolji"} ]
}
