import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Object } from '../model/object.model';
import { RouterModule } from '@angular/router';
import { ImageService } from 'src/app/shared/image.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {

  object: Object[] = []
  image: File;

  constructor(private service: TourAuthoringService, private imageService: ImageService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.getObject().subscribe({
      next: (result: PagedResults<Object>) => {
        this.object = result.results
        // kod za ucitavanje slike po id
        this.object.forEach(element => {
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
      }

    })
  }

}
