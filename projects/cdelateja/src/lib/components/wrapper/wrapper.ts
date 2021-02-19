import {Component, OnInit, ViewChild} from "@angular/core";
import {FieldConfig} from "../../dtos/definition-class";
import {FormGroup} from "@angular/forms";
import {AbstractComponent} from "../definition.components";

@Component({
  selector: "ct-dynamic-textfield",
  template: `
    <span [formGroup]="group">
        <ct-textfield [label]="field.label" [placeHolder]="field.placeHolder"
                      [formControlName]="field.formControlName"></ct-textfield>
    </span>
  `
})
export class DynamicTextFieldComponent implements OnInit {

  @ViewChild(AbstractComponent, {static: false})
  public abstractField: AbstractComponent;

  public field: FieldConfig;
  public group: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: "ct-dynamic-combo-box",
  template: `
    <span [formGroup]="group">
        <ct-combo-box [label]="field.label" [placeHolder]="field.placeHolder"
                      [values]="field.collections"
                      [itemCaption]="field.itemCaption"
                      [eqVal]="field.eqVal"
                      [formControlName]="field.formControlName"></ct-combo-box>
    </span>
  `
})
export class DynamicComboBoxComponent implements OnInit {

  @ViewChild(AbstractComponent, {static: false})
  public abstractField: AbstractComponent;

  public field: FieldConfig;
  public group: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: "ct-dynamic-date-picker",
  template: `
    <span [formGroup]="group">
        <ct-date-picker [label]="field.label" [placeHolder]="field.placeHolder"
                        [formControlName]="field.formControlName"></ct-date-picker>
    </span>
  `
})
export class DynamicDatePickerComponent implements OnInit {

  @ViewChild(AbstractComponent, {static: false})
  public abstractField: AbstractComponent;

  public field: FieldConfig;
  public group: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: "ct-dynamic-radio-button",
  template: `
    <span [formGroup]="group">
        <ct-radio-button [label]="field.label" [placeHolder]="field.placeHolder"
                         [values]="field.collections"
                         [itemCaption]="field.itemCaption"
                         [formControlName]="field.formControlName"></ct-radio-button>
    </span>
  `
})
export class DynamicRadioButtonComponent implements OnInit {

  @ViewChild(AbstractComponent, {static: false})
  public abstractField: AbstractComponent;

  public field: FieldConfig;
  public group: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }
}

@Component({
  selector: "ct-dynamic-check-box",
  template: `
    <span [formGroup]="group">
        <ct-check-box [label]="field.label" [placeHolder]="field.placeHolder"
                      [formControlName]="field.formControlName"></ct-check-box>
    </span>
  `
})
export class DynamicCheckBoxComponent implements OnInit {

  @ViewChild(AbstractComponent, {static: false})
  public abstractField: AbstractComponent;

  public field: FieldConfig;
  public group: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }
}
