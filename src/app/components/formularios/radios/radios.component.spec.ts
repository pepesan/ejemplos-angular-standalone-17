import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiosComponent } from './radios.component';
import {FormsModule} from "@angular/forms";

describe('RadiosComponent', () => {
  let component: RadiosComponent;
  let fixture: ComponentFixture<RadiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RadiosComponent, FormsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
