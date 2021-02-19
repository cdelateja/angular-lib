import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {CurrencyPipe} from './currency.pipe';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appCurrencyformatter]'
})
export class CurrencyDirective implements OnInit {

  private element: HTMLInputElement;
  private input: any;

  constructor(private ngControl: NgControl, private formatcurrencypipe: CurrencyPipe, elRef: ElementRef, private renderer: Renderer2) {
    this.element = elRef.nativeElement;
  }

  ngOnInit() {
    this.input = this.element.querySelector('input');
    if (this.input !== null) {
      this.renderer.listen(this.input, 'keyup', (value) => {
        this.input.value = this.input.value.replace(/\D/g, '');
      });
      this.renderer.listen(this.input, 'focus', (value) => {
        this.input.value = this.formatcurrencypipe.parse(this.input.value);
      });
      this.renderer.listen(this.input, 'blur', (value) => {
        this.input.value = this.formatcurrencypipe.transform(this.input.value);
      });
    }
  }

  @HostListener('focus', ['$event.target.value', '$event'])
  onFocus(value, event) {
    this.ngControl.valueAccessor.writeValue(this.formatcurrencypipe.parse(value));
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.ngControl.valueAccessor.writeValue(this.formatcurrencypipe.transform(value));
  }

  @HostListener('ngModelChange', ['$event'])
  onKeyDown(value) {
    if (value !== undefined && value !== null) {
      this.ngControl.valueAccessor.writeValue(value.replace(/\D/g, ''));
    }
  }

}
