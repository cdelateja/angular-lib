import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';
import {PhonePipe} from './phone.pipe';

@Directive({
  selector: '[formControlName][appPhonemask]'
})
export class PhonemaskDirective {

  constructor(private ngControl: NgControl, private phonePipe: PhonePipe) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(value) {
    this.onInputChange(value, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }


  onInputChange(event, backspace) {
    this.ngControl.valueAccessor.writeValue(this.phonePipe.transform(event, backspace));
  }

}
