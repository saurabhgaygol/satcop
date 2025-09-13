import { TestBed } from '@angular/core/testing';

import { SgpsalldataService } from './sgpsalldata.service';

describe('SgpsalldataService', () => {
  let service: SgpsalldataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SgpsalldataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
