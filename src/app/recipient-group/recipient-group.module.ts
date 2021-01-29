import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipientGroupRoutingModule } from './recipient-group-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RecipientGroupOverviewComponent } from "./recipient-group-overview/recipient-group-overview.component";
import { RecipientGroupEditComponent } from "./recipient-group-edit/recipient-group-edit.component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipientGroupDeleteDialogComponent } from './recipient-group-overview/recipient-group-delete-dialog/recipient-group-delete-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [RecipientGroupOverviewComponent, RecipientGroupEditComponent, RecipientGroupDeleteDialogComponent],
  imports: [CommonModule, SharedModule, RecipientGroupRoutingModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatInputModule, MatSelectModule, MatRadioModule, MatCardModule, ReactiveFormsModule, MatDialogModule, NgSelectModule]
})
export class RecipientGroupModule {}
