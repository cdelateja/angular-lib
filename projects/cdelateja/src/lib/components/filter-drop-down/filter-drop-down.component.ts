import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf
} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AbstractComponent} from "../definition.components";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'ct-filter-drop-down',
  templateUrl: './filter-drop-down.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FilterDropDownComponent),
    multi: true
  }]
})
export class FilterDropDownComponent extends AbstractComponent implements OnInit {

  @Input()
  public foundedItems: any[] = [];

  @Input()
  public itemCaption: string;

  @Output()
  public onTyping = new EventEmitter();

  @Output()
  public onSelect = new EventEmitter();

  public hide = true;
  public selectedItem: any;

  constructor(elRef: ElementRef, protected translate: TranslateService,
              @Optional() @Host() @SkipSelf()
              protected controlContainer: ControlContainer) {
    super(elRef, translate, controlContainer);
  }

  ngOnInit() {
    super.init();
  }

  public onSelected(item: any) {
    this.selectedItem = item;
    this.value = item[this.itemCaption];
    this.onSelect.emit(item);
    this.hide = true;
  }

  public onTypingWord(word: string) {
    this.hide = false;
    this.onTyping.emit(word);
  }

  public show() {
    if (this.foundedItems.length > 0) {
      this.hide = false;
    }
  }

}
