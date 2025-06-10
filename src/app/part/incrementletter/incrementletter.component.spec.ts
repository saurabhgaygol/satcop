import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementletterComponent } from './incrementletter.component';

describe('IncrementletterComponent', () => {
  let component: IncrementletterComponent;
  let fixture: ComponentFixture<IncrementletterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncrementletterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncrementletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
