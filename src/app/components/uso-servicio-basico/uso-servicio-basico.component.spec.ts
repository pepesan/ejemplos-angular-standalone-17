import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoServicioBasicoComponent } from './uso-servicio-basico.component';

describe('UsoServicioBasicoComponent', () => {
  let component: UsoServicioBasicoComponent;
  let fixture: ComponentFixture<UsoServicioBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoServicioBasicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsoServicioBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
