import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipientRoutingModule } from './recipient-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RecipientOverviewComponent } from "./recipient-overview/recipient-overview.component";
import { RecipientEditComponent } from "./recipient-edit/recipient-edit.component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipientDeleteDialogComponent } from './recipient-overview/recipient-delete-dialog/recipient-delete-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [RecipientOverviewComponent, RecipientEditComponent, RecipientDeleteDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RecipientRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class RecipientModule {}
