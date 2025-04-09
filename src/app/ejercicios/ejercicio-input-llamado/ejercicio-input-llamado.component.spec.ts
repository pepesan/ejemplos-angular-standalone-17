import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioInputLlamadoComponent } from './ejercicio-input-llamado.component';

describe('EjercicioInputLlamadoComponent', () => {
  let component: EjercicioInputLlamadoComponent;
  let fixture: ComponentFixture<EjercicioInputLlamadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioInputLlamadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioInputLlamadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
