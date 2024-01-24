import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appMia]'
})
export class MiaDirective {

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltarTexto(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltarTexto(false);
  }

  private resaltarTexto(resaltar: boolean) {
    if (resaltar) {
      this.el.nativeElement.style.backgroundColor = 'red';
    } else {
      this.el.nativeElement.style.backgroundColor = '';
    }
  }

}
