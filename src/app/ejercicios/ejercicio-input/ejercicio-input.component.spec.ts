import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioInputComponent } from './ejercicio-input.component';

describe('EjercicioInputComponent', () => {
  let component: EjercicioInputComponent;
  let fixture: ComponentFixture<EjercicioInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
