import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseSignalModelComponent } from './use-signal-model.component';

describe('UseSignalModelComponent', () => {
  let component: UseSignalModelComponent;
  let fixture: ComponentFixture<UseSignalModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UseSignalModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UseSignalModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
