import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalInputHijoComponent } from './signal-input-hijo.component';

describe('SignalInputHijoComponent', () => {
  let component: SignalInputHijoComponent;
  let fixture: ComponentFixture<SignalInputHijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalInputHijoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignalInputHijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
