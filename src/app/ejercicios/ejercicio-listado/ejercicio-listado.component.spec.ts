import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioListadoComponent } from './ejercicio-listado.component';

describe('EjercicioListadoComponent', () => {
  let component: EjercicioListadoComponent;
  let fixture: ComponentFixture<EjercicioListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
