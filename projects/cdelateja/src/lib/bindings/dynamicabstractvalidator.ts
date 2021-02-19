import {TranslateService} from '@ngx-translate/core';
import {createDynamicFormValidator} from '../directives/directives.validator';
import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FieldConfig} from "../dtos/definition-class";
import {AbstractValidator} from "./abstractvalidator";
import {DynamicFieldDirective} from "../directives/dynamic-field.directive";

/**
 *
 */
@Component({
  selector: 'ct-dynamic-component',
  template: `
    <span>
        Not a real component, this class is meant to be used as the definition form components
    </span>
  `
})
export class DynamicAbstractValidator extends AbstractValidator implements OnInit, AfterViewInit {

  @ViewChildren(DynamicFieldDirective)
  private dynamicFieldsComponents: QueryList<DynamicFieldDirective>;


  /**
   * Inicialize observables of fields
   */
  constructor(protected translate: TranslateService) {
    super(translate);
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    this.init();
  }


  /**
   *
   * @param fieldsConfig
   */
  protected initDynamicFormBinder(fieldsConfig: FieldConfig[]) {
    this.formId = this.getUuId();
    createDynamicFormValidator(fieldsConfig, <AbstractValidator><unknown>this)
  }

  protected fieldComponentsAsMap() {
    this.dynamicFieldsComponents.forEach(f => {
      const dynamicComponent: any = f.getDynamicComponent();
      if (!this.fieldsMap.has(dynamicComponent.abstractField.formControlName)) {
        this.fieldsMap.set(dynamicComponent.abstractField.formControlName, dynamicComponent.abstractField);
      }
    });
  }
}


