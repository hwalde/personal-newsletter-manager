import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterSendComponent } from "./newsletter-send.component";

const routes: Routes = [
  {
    path: 'newsletter/send/:id',
    component: NewsletterSendComponent
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterSendRoutingModule {}
