import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTeamComponent } from './collection-team.component';

describe('CollectionTeamComponent', () => {
  let component: CollectionTeamComponent;
  let fixture: ComponentFixture<CollectionTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
