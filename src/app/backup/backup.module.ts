import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupComponent } from './backup.component';
import {MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {BackupRoutingModule} from "./backup-routing.module";

@NgModule({
  declarations: [BackupComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    BackupRoutingModule
  ]
})
export class BackupModule { }
