import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubRutasComponent } from './sub-rutas.component';

describe('SubRutasComponent', () => {
  let component: SubRutasComponent;
  let fixture: ComponentFixture<SubRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubRutasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
