import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioServiciosComponent } from './ejercicio-servicios.component';

describe('EjercicioServiciosComponent', () => {
  let component: EjercicioServiciosComponent;
  let fixture: ComponentFixture<EjercicioServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
