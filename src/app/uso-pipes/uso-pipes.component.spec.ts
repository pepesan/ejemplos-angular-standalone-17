import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoPipesComponent } from './uso-pipes.component';

describe('UsoPipesComponent', () => {
  let component: UsoPipesComponent;
  let fixture: ComponentFixture<UsoPipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoPipesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsoPipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
