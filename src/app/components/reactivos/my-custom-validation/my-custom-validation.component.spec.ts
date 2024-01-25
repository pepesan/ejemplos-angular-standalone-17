import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomValidationComponent } from './my-custom-validation.component';
import {ReactiveFormsModule} from "@angular/forms";

describe('MyCustomValidationComponent', () => {
  let component: MyCustomValidationComponent;
  let fixture: ComponentFixture<MyCustomValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MyCustomValidationComponent, ReactiveFormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCustomValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
