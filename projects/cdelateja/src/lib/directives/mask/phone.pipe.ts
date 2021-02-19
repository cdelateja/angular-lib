import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any, backspace: boolean): string {
    let newVal = value.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 2) {
      newVal = newVal.replace(/^(\d{0,2})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,3})/, '($1) ($2)');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})/, '($1) ($2)-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})/, '($1) ($2)-$3');
    }
    return newVal;
  }

  parse(value: string): string {
    return value.substring(0, 10);
  }

}
