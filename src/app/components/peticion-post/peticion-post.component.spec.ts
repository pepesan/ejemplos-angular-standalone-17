import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticionPostComponent } from './peticion-post.component';

describe('PeticionPostComponent', () => {
  let component: PeticionPostComponent;
  let fixture: ComponentFixture<PeticionPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeticionPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeticionPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
