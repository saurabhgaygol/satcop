import { TestBed } from '@angular/core/testing';

import { DayliteamworkservicesService } from './dayliteamworkservices.service';

describe('DayliteamworkservicesService', () => {
  let service: DayliteamworkservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayliteamworkservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
