import { Component } from '@angular/core';

@Component({
  selector: 'xp-tour-review',
  templateUrl: './tour-review.component.html',
  styleUrls: ['./tour-review.component.css']
})
export class TourReviewComponent {
  entities = [ {id: 1, comment: 'Very interesting!', grade: 5, reviewDate: Date.now, visitDate: Date.now}, {id: 2, comment: 'Interesting but little bit short!', grade: 4, reviewDate: Date.now, viewDate: Date.now} ];
}
