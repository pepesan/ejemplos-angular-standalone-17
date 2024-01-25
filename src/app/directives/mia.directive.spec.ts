import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiaDirective } from './mia.directive';
import {ElementRef} from "@angular/core";
const mockElementRef = jasmine.createSpyObj('ElementRef', ['nativeElement']);
describe('MiaDirective', () => {
  let directive: MiaDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiaDirective],
      providers: [{ provide: ElementRef, useValue: mockElementRef }]
    }).compileComponents();
  });
  it('should create an instance', () => {
    const directive = new MiaDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});

