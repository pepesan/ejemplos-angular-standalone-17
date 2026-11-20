import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalsComponent } from './signals.component';

describe('SignalsComponent', () => {
  let component: SignalsComponent;
  let fixture: ComponentFixture<SignalsComponent>;
  let el: HTMLElement;

  /** Texto visible del componente con los espacios colapsados, para comparar sin depender del formato. */
  const texto = (): string => (el.textContent ?? '').replace(/\s+/g, ' ');

  /** Botón por su etiqueta (`value`). */
  const boton = (etiqueta: string): HTMLInputElement => {
    const encontrado = Array.from(el.querySelectorAll<HTMLInputElement>('input[type="button"]'))
      .find((b: HTMLInputElement) => b.value === etiqueta);
    if (!encontrado) { throw new Error(`No existe el botón "${etiqueta}"`); }
    return encontrado;
  };

  /** Elementos `<li>` de cada una de las dos listas. */
  const listas = (): string[][] =>
    Array.from(el.querySelectorAll('ul')).map((ul: HTMLUListElement) =>
      Array.from(ul.querySelectorAll('li')).map((li: HTMLLIElement) => (li.textContent ?? '').trim()));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignalsComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('datos presentados al iniciar', () => {
    it('muestra los valores iniciales de las señales simples y del objeto', () => {
      const t: string = texto();
      expect(t).toContain('Numero: 0');
      expect(t).toContain('Cadena: "Valor"');
      expect(t).toContain('"texto": "hola"');
    });

    it('muestra countSignal tras ngOnInit (2 + 1) y su doble calculado', () => {
      const t: string = texto();
      expect(t).toContain('countSignal: 3');
      expect(t).toContain('DoubleCount: 6');
    });

    it('muestra count y linkedCount a 0', () => {
      const t: string = texto();
      expect(t).toContain('count: 0');
      expect(t).toContain('linkedCount: 0');
    });

    it('lista las tres cadenas en las dos listas', () => {
      expect(listas()).toEqual([['uno', 'dos', 'tres'], ['uno', 'dos', 'tres']]);
    });

    it('muestra el mensaje de vacío cuando no hay cadenas', () => {
      component.cadenasSignal.set([]);
      fixture.detectChanges();
      expect(listas()).toEqual([[], ['There are no items.']]);
    });

    it('muestra el aviso de disponibilidad de la API', () => {
      expect(el.querySelector('app-aviso-api')).not.toBeNull();
    });
  });

  describe('botones', () => {
    it('"Suma 1 a countSignal" incrementa countSignal y actualiza el doble', () => {
      boton('Suma 1 a countSignal').click();
      fixture.detectChanges();
      expect(component.countSignal()).toBe(4);
      expect(texto()).toContain('countSignal: 4');
      expect(texto()).toContain('DoubleCount: 8');
    });

    it('"Suma 1 a count" incrementa count y arrastra a linkedCount', () => {
      boton('Suma 1 a count').click();
      fixture.detectChanges();
      expect(texto()).toContain('count: 1');
      expect(texto()).toContain('linkedCount: 1');
    });

    it('"Cambia Valor de Linked" fija linkedCount a 2 sin tocar count', () => {
      boton('Cambia Valor de Linked').click();
      fixture.detectChanges();
      expect(texto()).toContain('linkedCount: 2');
      expect(texto()).toContain('count: 0');
      expect(component.count()).toBe(0);
    });

    it('linkedCount se vuelve a sincronizar cuando cambia count tras editarlo a mano', () => {
      boton('Cambia Valor de Linked').click();
      boton('Suma 1 a count').click();
      fixture.detectChanges();
      expect(texto()).toContain('linkedCount: 1');
    });

    it('pulsar varias veces acumula los incrementos', () => {
      const b: HTMLInputElement = boton('Suma 1 a countSignal');
      b.click(); b.click(); b.click();
      fixture.detectChanges();
      expect(texto()).toContain('countSignal: 6');
      expect(texto()).toContain('DoubleCount: 12');
    });
  });
});
