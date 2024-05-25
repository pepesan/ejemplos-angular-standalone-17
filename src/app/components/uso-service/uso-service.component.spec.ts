import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoServiceComponent} from './uso-service.component';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";


describe('UsoService', () => {
  let component: UsoServiceComponent;
  let fixture: ComponentFixture<UsoServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UsoServiceComponent],
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
      .compileComponents();

    fixture = TestBed.createComponent(UsoServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
