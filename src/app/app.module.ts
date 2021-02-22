import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {MultiTranslateHttpLoader} from "ngx-translate-multi-http-loader";
import {ChartsModule} from "ng2-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CTModule} from "cdelateja";
import { HomeComponent } from './components/routes/home/home.component';
import { FormComponent } from './components/inner/form/form/form.component';
import { FooterComponent } from './components/structure/footer/footer.component';
import { MenuComponent } from './components/structure/menu/menu.component';
import { ChallengeComponent } from './components/inner/challenge/challenge/challenge.component';
import { NewPageComponent } from './components/inner/challenge/challenge/new-page/new-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormComponent,
    FooterComponent,
    MenuComponent,
    ChallengeComponent,
    NewPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    CTModule,
    ReactiveFormsModule,
    ChartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    {prefix: './assets/i18n/core/', suffix: '.json'},
    {prefix: './assets/i18n/cdelateja/', suffix: '.json'}
  ]);
}
