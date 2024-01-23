import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoServiceComponent } from './uso-service.component';

describe('UsoServiceComponent', () => {
  let component: UsoServiceComponent;
  let fixture: ComponentFixture<UsoServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsoServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
