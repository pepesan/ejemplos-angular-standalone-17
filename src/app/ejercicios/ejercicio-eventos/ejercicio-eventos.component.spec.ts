import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioEventosComponent } from './ejercicio-eventos.component';

describe('EjercicioEventosComponent', () => {
  let component: EjercicioEventosComponent;
  let fixture: ComponentFixture<EjercicioEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
