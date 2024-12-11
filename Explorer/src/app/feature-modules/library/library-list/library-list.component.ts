import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'xp-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.css']
})
export class LibraryListComponent {
  displayedEntities = [
    { title: 'Sunset over the Mountains' },
    { title: 'City Lights at Night' },
    { title: 'Exploring Ancient Ruins' },
    { title: 'A Walk in the Park' },
    { title: 'Beachfront Paradise' },
    { title: 'Autumn Leaves in the Forest' },
    { title: 'Skydiving Adventure' },
    { title: 'Cultural Heritage Tour' },
    { title: 'Vibrant Street Art' },
    { title: 'Wildlife Safari' }
  ];
  constructor(private router: Router, private authService: AuthService, private imageService: ImageService) { imageService.setControllerPath("administrator/image");} 
    ngOnInit(): void {
}
  openStories(){
    console.log("Card clicked!");
    this.router.navigate(['/book']);
  }
}