import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioSignalsComponent } from './ejercicio-signals.component';

describe('EjercicioSignalsComponent', () => {
  let component: EjercicioSignalsComponent;
  let fixture: ComponentFixture<EjercicioSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioSignalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
