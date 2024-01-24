import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupAnidadoBasicoComponent } from './form-group-anidado-basico.component';

describe('FormGroupAnidadoBasicoComponent', () => {
  let component: FormGroupAnidadoBasicoComponent;
  let fixture: ComponentFixture<FormGroupAnidadoBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormGroupAnidadoBasicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupAnidadoBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
