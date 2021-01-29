import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BackupComponent } from "./backup.component";

const routes: Routes = [
  {
    path: 'backup',
    component: BackupComponent
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackupRoutingModule {}
