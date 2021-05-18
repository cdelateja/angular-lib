import {ComponentFactoryResolver, Directive, Input, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FieldConfig} from '../dtos/definition-class';
import {
  DynamicCheckBoxComponent,
  DynamicComboBoxComponent,
  DynamicDatePickerComponent,
  DynamicRadioButtonComponent,
  DynamicTextFieldComponent
} from '../components/wrapper/wrapper';

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective {

  @Input()
  public field: FieldConfig;
  @Input()
  public group: FormGroup;

  private componentRef: any;

  constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {
  }

  public ngOnInit(): void {
    const factory = this.resolver.resolveComponentFactory(componentMapper[this.field.type]);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }

  public getDynamicComponent(): any {
    return this.componentRef.instance;
  }

}

const componentMapper = {
  input: DynamicTextFieldComponent,
  select: DynamicComboBoxComponent,
  date: DynamicDatePickerComponent,
  radiobutton: DynamicRadioButtonComponent,
  checkbox: DynamicCheckBoxComponent
};
