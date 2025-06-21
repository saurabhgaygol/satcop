import { TestBed } from '@angular/core/testing';

import { ExclefileserviceService } from './exclefileservice.service';

describe('ExclefileserviceService', () => {
  let service: ExclefileserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExclefileserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
