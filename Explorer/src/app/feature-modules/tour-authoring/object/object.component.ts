import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Object } from '../model/object.model';
import { RouterModule } from '@angular/router';
import { ImageService } from 'src/app/shared/image.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotificationType } from 'src/app/shared/model/notificationType.enum';

@Component({
  selector: 'xp-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {

  object: Object[] = []
  image: File;
  isLoading=false;

  constructor(private service: TourAuthoringService,private notificationService: NotificationService, private imageService: ImageService, private cd: ChangeDetectorRef) {
    /*Obavezan dio za podesavanje putanje za kontoler koji cuva slike
    ODREDJUJE SE NA OSNOVU ULOGE KOJA VRSI OPERACIJU ZBOG AUTORIZACIJE*/
    imageService.setControllerPath("author/image");
   }

  ngOnInit(): void {
    this.isLoading=true;
    this.service.getObject().subscribe({
      next: (result: PagedResults<Object>) => {
        this.object = result.results
        // kod za ucitavanje slike po id
        this.isLoading=false;
        this.imageService.setControllerPath("author/image");
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
      },
      error:(err: any) => {
        console.log(err);
        this.isLoading=false;
        this.notificationService.notify({ message:'Failed to load objects. Please try again.', duration: 3000, notificationType: NotificationType.WARNING });
      }

    })
  }

}
