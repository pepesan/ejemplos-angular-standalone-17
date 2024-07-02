import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListadoComponent } from './todo-listado.component';

describe('TodoListadoComponent', () => {
  let component: TodoListadoComponent;
  let fixture: ComponentFixture<TodoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
