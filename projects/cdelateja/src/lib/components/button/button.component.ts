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

  ngOnInit() {
  }

  public getElement(): HTMLInputElement {
    return this.element;
  }

}

export class ButtonType {
  public DEFAULT = 'btn-secondary';
  public PRIMARY = 'btn-primary';
  public SUCCESS = 'btn-success';
  public DANGER = 'btn-danger';
  public WARNING = 'btn-warning';
  public INFO = 'btn-info';
  public DEFAULT_BLOCK = this.DEFAULT + ' btn-block';
  public PRIMARY_BLOCK = this.PRIMARY + ' btn-block';
  public SUCCESS_BLOCK = this.SUCCESS + ' btn-block';
  public DANGER_BLOCK = this.DANGER + ' btn-block';
  public WARNING_BLOCK = this.WARNING + ' btn-block';
  public INFO_BLOCK = this.INFO + ' btn-block';
}
