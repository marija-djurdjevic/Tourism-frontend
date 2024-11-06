import { TestBed } from '@angular/core/testing';

import { TourShoppingService } from './tour-shopping.service';

describe('TourShoppingService', () => {
  let service: TourShoppingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TourShoppingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
