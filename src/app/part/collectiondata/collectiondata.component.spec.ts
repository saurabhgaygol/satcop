import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectiondataComponent } from './collectiondata.component';

describe('CollectiondataComponent', () => {
  let component: CollectiondataComponent;
  let fixture: ComponentFixture<CollectiondataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectiondataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectiondataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
