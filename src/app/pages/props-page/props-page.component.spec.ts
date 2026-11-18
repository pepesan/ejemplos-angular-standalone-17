import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PropsPageComponent } from './props-page.component';

describe('PropsPageComponent', () => {
  let component: PropsPageComponent;
  let fixture: ComponentFixture<PropsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropsPageComponent],
      providers: [provideRouter([])]
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
