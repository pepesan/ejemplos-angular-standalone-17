import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropsPageComponent } from './props-page.component';

describe('PropsPageComponent', () => {
  let component: PropsPageComponent;
  let fixture: ComponentFixture<PropsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PropsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
