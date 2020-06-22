import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRed]'
})
export class RedDirective {

  constructor(private element: ElementRef) {
    element.nativeElement.style.color = '#E35E6B';
  }

}
