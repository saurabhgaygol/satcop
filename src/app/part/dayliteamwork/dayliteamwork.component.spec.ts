import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayliteamworkComponent } from './dayliteamwork.component';

describe('DayliteamworkComponent', () => {
  let component: DayliteamworkComponent;
  let fixture: ComponentFixture<DayliteamworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayliteamworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayliteamworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
