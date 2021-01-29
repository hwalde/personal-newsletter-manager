import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterOverviewComponent } from "./newsletter-overview/newsletter-overview.component";
import { NewsletterEditComponent } from "./newsletter-edit/newsletter-edit.component";
import {NewsletterSendModule} from "./newsletter-send/newsletter-send.module";
import {NewsletterViewComponent} from "./newsletter-view/newsletter-view.component";

const routes: Routes = [
  {
    path: 'newsletters',
    component: NewsletterOverviewComponent
  },
  {
    path: 'newsletter/add',
    component: NewsletterEditComponent
  },
  {
    path: 'newsletter/edit/:id',
    component: NewsletterEditComponent
  },
  {
    path: 'newsletter/view/:id',
    component: NewsletterViewComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), NewsletterSendModule],
  exports: [RouterModule]
})
export class NewsletterRoutingModule {}
