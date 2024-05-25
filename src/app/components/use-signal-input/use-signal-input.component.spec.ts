import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseSignalInputComponent } from './use-signal-input.component';

describe('UseSignalInputComponent', () => {
  let component: UseSignalInputComponent;
  let fixture: ComponentFixture<UseSignalInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UseSignalInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UseSignalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
