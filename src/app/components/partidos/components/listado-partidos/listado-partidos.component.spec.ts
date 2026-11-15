import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiClientService } from '../../services/apiclient.service';
import { ListadoPartidosComponent } from './listado-partidos.component';

const createPartidos = () => [{ nombre: 'Partido A', dipu: 10, imagen: 'partido-a.png' }];



describe('ListadoPartidosComponent', () => {
  let component: ListadoPartidosComponent;
  let fixture: ComponentFixture<ListadoPartidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPartidosComponent],
      providers: [{
        provide: ApiClientService,
        useValue: {
          getData: () => of(createPartidos()),
          getProcesedDataAsync: async () => createPartidos(),
          getProcesedSubscribeDataAsync: async () => createPartidos(),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoPartidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('renders partido data across promises, observables, and signals', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.listadoVisible).toHaveLength(1);
    expect(component.partidosSignal()).toHaveLength(1);
    expect(component.listadoVisibleSignals()).toHaveLength(1);
    expect(component.listadoVisiblePromesa).toHaveLength(1);
    expect(component.listadoVisiblePromesaProcesada).toHaveLength(1);
    expect(component.listadoVisibleSubscribeProcesado).toHaveLength(1);

    const rendered = fixture.nativeElement.textContent;
    expect(rendered).toContain('Partido A: 10');
    expect(fixture.nativeElement.querySelectorAll('img[alt*="Partido A"]')).not.toHaveLength(0);
    expect(rendered).not.toContain('There are no results.');
  });
});
