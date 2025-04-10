import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioTuberiasComponent } from './ejercicio-tuberias.component';

describe('EjercicioTuberiasComponent', () => {
  let component: EjercicioTuberiasComponent;
  let fixture: ComponentFixture<EjercicioTuberiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioTuberiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioTuberiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
