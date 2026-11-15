import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetalleComponent } from './todo-detalle.component';

describe('TodoDetalleComponent', () => {
  let component: TodoDetalleComponent;
  let fixture: ComponentFixture<TodoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetalleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoDetalleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dato', { id: 1, name: 'Preparar la merienda' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
