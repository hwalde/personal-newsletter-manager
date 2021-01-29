import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecipientOverviewComponent } from "./recipient-overview/recipient-overview.component";
import { RecipientEditComponent } from "./recipient-edit/recipient-edit.component";

const routes: Routes = [
  {
    path: 'recipients',
    component: RecipientOverviewComponent
  },
  {
    path: 'recipient/add',
    component: RecipientEditComponent
  },
  {
    path: 'recipient/:id',
    component: RecipientEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipientRoutingModule {}
