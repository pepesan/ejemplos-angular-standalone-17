import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('assigns a unique id when adding a todo', () => {
    component.todo.text = 'Preparar la merienda';
    component.addTodo();

    const ids = component.todos.map((todo) => todo.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
