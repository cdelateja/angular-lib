import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/routes/home/home.component";
import {FormComponent} from "./components/inner/form/form/form.component";
import {ChallengeComponent} from "./components/inner/challenge/challenge/challenge.component";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'form', component: FormComponent},
  {path: 'challenge', component: ChallengeComponent},
  {path: '**', pathMatch: 'full', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
