import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CTModule} from 'cdelateja';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {HomeComponent} from './components/routes/home/home.component';
import {ObservableService} from './services/observable.service';
import {ChartsModule} from 'ng2-charts';
import {BasicFormComponent} from './components/inner/form/basic-form/basic-form.component';
import {DynamicFormComponent} from './components/inner/form/dynamic-form/dynamic-form.component';
import {CustomComponentComponent} from './components/inner/form/basic-form/custom-component/custom-component.component';
import {LoginFormComponent} from './components/inner/form/login-form/login-form.component';
import {PetitionsComponent} from './components/inner/http/petitions/petitions.component';
import {HelloComponent} from './components/routes/hello/hello.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {A11yModule} from '@angular/cdk/a11y';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BasicFormComponent,
    DynamicFormComponent,
    CustomComponentComponent,
    LoginFormComponent,
    PetitionsComponent,
    HelloComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    CTModule,
    ReactiveFormsModule,
    ChartsModule,
    BrowserAnimationsModule,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ObservableService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/core/', suffix: '.json'},
    {prefix: './assets/i18n/cdelateja/', suffix: '.json'}
  ]);
}
