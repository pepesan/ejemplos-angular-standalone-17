import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BasicoService } from '../../services/basico.service';
import { UsoServicioBasicoComponent } from './uso-servicio-basico.component';

describe('UsoServicioBasicoComponent', () => {
  let component: UsoServicioBasicoComponent;
  let fixture: ComponentFixture<UsoServicioBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoServicioBasicoComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsoServicioBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra la propiedad y el valor del método del servicio inyectado con inject()', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent;
    expect(texto).toContain('Valor');
    expect(texto).toContain('Dato básico');
  });

  it('usa el servicio singleton de la raíz, no una instancia propia del componente', () => {
    const raiz = TestBed.inject(BasicoService);
    expect((component as unknown as { miServicio: BasicoService }).miServicio).toBe(raiz);
  });
});
