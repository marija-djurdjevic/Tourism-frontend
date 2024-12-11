import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'xp-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  displayedEntities = [
    { title: 'Sunset over the Mountains', content: 'A breathtaking view of the sun setting over the peaks.' },
    { title: 'City Lights at Night', content: 'The vibrant glow of the city as it comes alive at night.' },
    { title: 'Exploring Ancient Ruins', content: 'Discover the mysteries of ancient civilizations through their ruins.' },
    { title: 'A Walk in the Park', content: 'A peaceful stroll through the lush greenery of the park.' },
    { title: 'Beachfront Paradise', content: 'Relax by the ocean, with soft sand and warm sunsets.' },
    { title: 'Autumn Leaves in the Forest', content: 'The vibrant colors of fall foliage create a stunning landscape.' },
    { title: 'Skydiving Adventure', content: 'Feel the thrill of free-falling through the sky.' },
    { title: 'Cultural Heritage Tour', content: 'Explore the rich history and culture of ancient cities.' },
    { title: 'Vibrant Street Art', content: 'Street art that brings life and creativity to the urban landscape.' },
    { title: 'Wildlife Safari', content: 'Get up close to nature and witness wildlife in its natural habitat.' }
  ];
  constructor(private router: Router, private authService: AuthService, private imageService: ImageService) { imageService.setControllerPath("administrator/image");} 
  ngOnInit(): void {
}
}
