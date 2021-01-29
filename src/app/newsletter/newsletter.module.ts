import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NewsletterOverviewComponent } from "./newsletter-overview/newsletter-overview.component";
import { NewsletterEditComponent } from "./newsletter-edit/newsletter-edit.component";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NewsletterDeleteDialogComponent } from './newsletter-overview/newsletter-delete-dialog/newsletter-delete-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { NewsletterViewComponent } from './newsletter-view/newsletter-view.component';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [NewsletterOverviewComponent, NewsletterEditComponent, NewsletterDeleteDialogComponent, NewsletterViewComponent],
  imports: [
    CommonModule, SharedModule, NewsletterRoutingModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatInputModule, MatSelectModule, MatRadioModule, MatCardModule, ReactiveFormsModule,
    MatDialogModule, MatExpansionModule, MatIconModule
  ]
})
export class NewsletterModule {}
