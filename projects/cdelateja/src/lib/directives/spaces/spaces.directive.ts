import {Directive, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[formControlName][appSpaces]'
})
export class SpacesDirective {

  constructor(private ngControl: NgControl) {
  }

  @HostListener('ngModelChange', ['$event'])
  onKeyDown(value) {
    this.ngControl.valueAccessor.writeValue(value.split(' ').join(''));
  }

}
