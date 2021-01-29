import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecipientGroupOverviewComponent } from "./recipient-group-overview/recipient-group-overview.component";
import { RecipientGroupEditComponent } from "./recipient-group-edit/recipient-group-edit.component";

const routes: Routes = [
  {
    path: 'recipient-groups',
    component: RecipientGroupOverviewComponent
  },
  {
    path: 'recipient-group/add',
    component: RecipientGroupEditComponent
  },
  {
    path: 'recipient-group/:id',
    component: RecipientGroupEditComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipientGroupRoutingModule {}
