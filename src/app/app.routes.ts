import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { ViewComponent } from './view/view.component';
import { LandingPageComponent } from './landing-page/landing-page.component';


export const routes: Routes = [

  {
    path: 'task-details/:id',
    component: ViewComponent
  },
  {
    path: 'welcome',
    component: LandingPageComponent
  },
  {
    path: '**',
    redirectTo:'welcome',
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
