import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ct-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent implements OnInit {

  protected readonly element: HTMLInputElement;

  @Input()
  public toolTip: string;

  @Input()
  public label: string;

  @Input()
  public disabled =  false;

  @Input()
  public type: string = new ButtonType().DEFAULT;

  constructor(elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  public ngOnInit(): void {
  }

  public getElement(): HTMLInputElement {
    return this.element;
  }

}

export class ButtonType {
  public DEFAULT = 'btn-secondary';
  public PRIMARY = 'primary';
  public SUCCESS = 'success';
  public DANGER = 'warn';
  public WARNING = 'accent';
  public INFO = 'info';
}
