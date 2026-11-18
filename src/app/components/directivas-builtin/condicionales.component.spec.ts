import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { CondicionalesComponent } from './condicionales.component';

describe('CondicionalesComponent', () => {
  let component: CondicionalesComponent;
  let fixture: ComponentFixture<CondicionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondicionalesComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CondicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('avisa de que es código obsoleto desde v20', () => {
    const aviso = fixture.nativeElement.querySelector('.legacy-aviso');
    expect(aviso.textContent).toContain('obsoleto desde Angular v20');
  });

  it('renderiza *ngIf, *ngFor y *ngSwitch', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('El booleano es true');
    expect(el.textContent).not.toContain('El booleano es false');
    expect(el.querySelectorAll('li').length).toBe(4);
    expect(el.textContent).toContain('Stin');
  });
});
