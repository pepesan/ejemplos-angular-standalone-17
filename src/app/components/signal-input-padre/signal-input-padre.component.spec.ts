import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalInputPadreComponent } from './signal-input-padre.component';

describe('SignalInputPadreComponent', () => {
  let component: SignalInputPadreComponent;
  let fixture: ComponentFixture<SignalInputPadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalInputPadreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignalInputPadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra el valor inicial en el componente hijo', () => {
    const titulo = fixture.nativeElement.querySelector('h1') as HTMLElement;
    expect(titulo.textContent).toContain('Counter value: 10');
  });

  it('actualiza el input signal del hijo al pulsar Increment', () => {
    const boton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const titulo = fixture.nativeElement.querySelector('h1') as HTMLElement;

    boton.click();
    fixture.detectChanges();
    expect(titulo.textContent).toContain('Counter value: 11');

    boton.click();
    fixture.detectChanges();
    expect(titulo.textContent).toContain('Counter value: 12');
  });
});
