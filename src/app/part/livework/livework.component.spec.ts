import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveworkComponent } from './livework.component';

describe('LiveworkComponent', () => {
  let component: LiveworkComponent;
  let fixture: ComponentFixture<LiveworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveworkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
