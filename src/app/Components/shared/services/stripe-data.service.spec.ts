import { TestBed } from '@angular/core/testing';

import { StripeDataService } from './stripe-data.service';

describe('StripeDataService', () => {
  let service: StripeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
