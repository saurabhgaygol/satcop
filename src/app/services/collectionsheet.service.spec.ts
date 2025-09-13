import { TestBed } from '@angular/core/testing';

import { CollectionsheetService } from './collectionsheet.service';

describe('CollectionsheetService', () => {
  let service: CollectionsheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
