import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SubRutasComponent } from './sub-rutas.component';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";

describe('SubRutasComponent', () => {
  let component: SubRutasComponent;
  let fixture: ComponentFixture<SubRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SubRutasComponent]
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
