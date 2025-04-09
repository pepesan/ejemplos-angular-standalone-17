import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioCondicionalesComponent } from './ejercicio-condicionales.component';

describe('EjercicioCondicionalesComponent', () => {
  let component: EjercicioCondicionalesComponent;
  let fixture: ComponentFixture<EjercicioCondicionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjercicioCondicionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercicioCondicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
