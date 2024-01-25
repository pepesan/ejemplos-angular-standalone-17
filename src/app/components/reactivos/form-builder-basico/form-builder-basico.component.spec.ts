import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderBasicoComponent } from './form-builder-basico.component';
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

describe('FormBuilderBasicoComponent', () => {
  let component: FormBuilderBasicoComponent;
  let fixture: ComponentFixture<FormBuilderBasicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
      CommonModule,
      ReactiveFormsModule
      ],
      providers: [
       HttpClient
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBuilderBasicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
