import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioMisClientesComponent } from './ejercicio-mis-clientes.component';

describe('EjercicioMisClientesComponent', () => {
  let component: EjercicioMisClientesComponent;
  let fixture: ComponentFixture<EjercicioMisClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioMisClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioMisClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
