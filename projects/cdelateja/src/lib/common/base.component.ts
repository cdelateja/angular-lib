import {AbstractControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {
  createDynamicFormValidator,
  createFormValidator,
  FormBinder,
  generateValidators,
  Validator
} from '../directives/directives.validator';
import {ButtonType} from '../components/button/button.component';
import {AlertType} from '../components/alert/alert.component';
import {AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FieldConfig} from '../dtos/definition-class';
import {AbstractComponent} from '../components/definition.components';
import {Observable, Subject, Subscription} from 'rxjs';

/**
 *
 */
@Component({
  selector: 'ct-base-component',
  template: `
    <span>
        Not a real component, this class is meant to be used as the base class
    </span>
  `
})
export class BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  public static readonly drawer = {};
  public static readonly buttonType: ButtonType = new ButtonType();
  public static readonly alertType: AlertType = new AlertType();
  protected subscriptions: Subscription[] = [];

  constructor() {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public ngAfterViewInit(): void {
  }

  public pushSubscription(s: Subscription): void {
    this.subscriptions.push(s);
  }

  public get ButtonType(): ButtonType {
    return BaseComponent.buttonType;
  }

  public get AlertType(): AlertType {
    return BaseComponent.alertType;
  }

  /**
   * Function to save global values or properties in components
   * @param property
   */
  public getDrawerProperty(property: string): any {
    return BaseComponent.drawer[property];
  }

  /**
   * Function for recovering global values or properties in components
   * @param obj
   * @param property
   */
  public setDrawerProperty(obj: any, property: string): void {
    BaseComponent.drawer[property] = obj;
  }
}
