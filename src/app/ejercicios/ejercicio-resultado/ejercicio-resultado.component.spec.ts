import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioResultadoComponent } from './ejercicio-resultado.component';

describe('EjercicioResultadoComponent', () => {
  let component: EjercicioResultadoComponent;
  let fixture: ComponentFixture<EjercicioResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
