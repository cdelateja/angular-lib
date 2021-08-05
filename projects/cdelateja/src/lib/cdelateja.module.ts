import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe} from './directives/currency/currency.pipe';
import {CurrencyDirective} from './directives/currency/currencydirective.directive';
import {PhonemaskDirective} from './directives/mask/phonemask.directive';
import {SpacesDirective} from './directives/spaces/spaces.directive';
import {PhonePipe} from './directives/mask/phone.pipe';
import {TextfieldComponent} from './components/textfield/textfield.component';
import {RadioButtonComponent} from './components/radio-button/radio-button.component';
import {ComboBoxComponent} from './components/combo-box/combo-box.component';
import {PasswordComponent} from './components/password/password.component';
import {CheckBoxComponent} from './components/check-box/check-box.component';
import {ModalComponent} from './components/modal/modal.component';
import {LabelComponent} from './components/label/label.component';
import {TabComponent} from './components/tab/tab.component';
import {TablePaginationComponent} from './components/table/table-pagination/table-pagination.component';
import {TextareaComponent} from './components/textarea/textarea.component';
import {ButtonComponent} from './components/button/button.component';
import {TableComponent} from './components/table/table.component';
import {BodyTabComponent} from './components/tab/body-tab/body-tab.component';
import {SelectTwinComponent} from './components/select-twin/select-twin.component';
import {CollapseComponent} from './components/collapse/collapse.component';
import {BodyCollapseComponent} from './components/collapse/body-collapse/body-collapse.component';
import {AlertComponent} from './components/alert/alert.component';
import {TableColumnComponent} from './components/table/table-column/table-column.component';
import {SwitchComponent} from './components/switch/switch.component';
import {UploadComponent} from './components/upload/upload.component';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {ClientService} from './services/client.service';
import {ModalService} from './components/services/modal.service';
import {NotificationPop} from './components/services/notification.service';
import {ConfirmationDialog} from './components/services/confirmation-dialog.service';
import {OauthService} from './services/oauth.service';
import {ConfigService, loadConfig} from './services/config.service';
import {FilterDropDownComponent} from './components/filter-drop-down/filter-drop-down.component';
import {IdleService} from './services/idle.service';
import {DynamicFieldDirective} from './directives/dynamic-field.directive';
import {
  DynamicCheckBoxComponent,
  DynamicComboBoxComponent,
  DynamicDatePickerComponent,
  DynamicRadioButtonComponent,
  DynamicTextFieldComponent
} from './components/wrapper/wrapper';
import {AbstractComponent} from './components/definition.components';
import {LoginComponent} from './components/login/login.component';
import {LoginService} from './services/login.service';
import {CookieService} from 'ngx-cookie-service';
import {WebSocketService} from './services/web-socket.service';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsFormPluginModule} from '@ngxs/form-plugin';
import {AbstractValidator} from './bindings/abstractvalidator';
import {DynamicAbstractValidator} from './bindings/dynamicabstractvalidator';
import {Operations} from './bindings/operations';
import {Query} from './bindings/query';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NavbarItemComponent} from './components/navbar/navbar-item/navbar-item.component';
import {NavbarBrandComponent} from './components/navbar/navbar-brand/navbar-brand.component';
import {NavbarDropdownComponent} from './components/navbar/navbar-dropdown/navbar-dropdown.component';
import {NavbarBodyComponent} from './components/navbar/navbar-body/navbar-body.component';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AuthorizedDirective} from './directives/authorized.directive';
import {AuthGuard} from './services/app-auth-guard.guard';
import {NumberFieldComponent} from './components/number-field/number-field.component';
import {CatalogComponent} from './components/catalog/catalog.component';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {A11yModule} from '@angular/cdk/a11y';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {BaseComponent} from './common/base.component';

@NgModule({
  declarations: [
    CurrencyPipe,
    CurrencyDirective,
    PhonemaskDirective,
    SpacesDirective,
    PhonePipe,
    AbstractComponent,
    TextfieldComponent,
    PasswordComponent,
    ComboBoxComponent,
    CheckBoxComponent,
    RadioButtonComponent,
    ModalComponent,
    LabelComponent,
    TabComponent,
    BodyTabComponent,
    TableComponent,
    TablePaginationComponent,
    ButtonComponent,
    TextareaComponent,
    SelectTwinComponent,
    CollapseComponent,
    BodyCollapseComponent,
    AlertComponent,
    TableColumnComponent,
    SwitchComponent,
    UploadComponent,
    DatePickerComponent,
    FilterDropDownComponent,
    DynamicFieldDirective,
    DynamicTextFieldComponent,
    DynamicComboBoxComponent,
    DynamicDatePickerComponent,
    DynamicRadioButtonComponent,
    DynamicCheckBoxComponent,
    LoginComponent,
    AbstractValidator,
    DynamicAbstractValidator,
    Operations,
    Query,
    NavbarComponent,
    NavbarItemComponent,
    NavbarBrandComponent,
    NavbarDropdownComponent,
    NavbarBodyComponent,
    AuthorizedDirective,
    NumberFieldComponent,
    CatalogComponent,
    BaseComponent
  ],
  entryComponents: [
    DynamicTextFieldComponent,
    DynamicComboBoxComponent,
    DynamicDatePickerComponent,
    DynamicRadioButtonComponent,
    DynamicCheckBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    A11yModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatSliderModule,
    MatSlideToggleModule,
    NgxsModule.forRoot([LoginService]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot()
  ],
  providers: [
    CurrencyPipe,
    PhonePipe,
    ClientService,
    OauthService,
    ConfigService,
    ModalService,
    NotificationPop,
    ConfirmationDialog,
    IdleService,
    LoginService,
    CookieService,
    WebSocketService,
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true
    }
  ],
  exports: [
    CurrencyPipe,
    CurrencyDirective,
    PhonemaskDirective,
    SpacesDirective,
    AuthorizedDirective,
    PhonePipe,
    AbstractComponent,
    DynamicFieldDirective,
    TextfieldComponent,
    PasswordComponent,
    ComboBoxComponent,
    CheckBoxComponent,
    RadioButtonComponent,
    ModalComponent,
    LabelComponent,
    TabComponent,
    BodyTabComponent,
    TableComponent,
    TablePaginationComponent,
    ButtonComponent,
    TextareaComponent,
    SelectTwinComponent,
    CollapseComponent,
    BodyCollapseComponent,
    AlertComponent,
    TableColumnComponent,
    SwitchComponent,
    UploadComponent,
    DatePickerComponent,
    CommonModule,
    FilterDropDownComponent,
    LoginComponent,
    NavbarComponent,
    NavbarItemComponent,
    NavbarBrandComponent,
    NavbarDropdownComponent,
    NavbarBodyComponent,
    NumberFieldComponent,
    CatalogComponent,
    BaseComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CTModule {
}
