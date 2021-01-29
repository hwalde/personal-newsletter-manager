import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RecipientOverviewDataSource } from './recipient-overview-datasource';
import { RecipientService } from "../recipient.service";
import { Subscription } from "rxjs";
import { RecipientOverviewItem } from "./recipient-overview-item";
import { MatDialog } from "@angular/material/dialog";
import { RecipientDeleteDialogComponent } from "./recipient-delete-dialog/recipient-delete-dialog.component";

@Component({
  selector: 'recipient-overview',
  templateUrl: './recipient-overview.component.html',
  styleUrls: ['./recipient-overview.component.scss']
})
export class RecipientOverviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<RecipientOverviewItem>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'lastName', 'action'];

  private recipientListSubscription:Subscription;

  constructor(
    private recipientService: RecipientService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.recipientListSubscription = this.recipientService
      .getRecipientList()
      .subscribe(recipientList => {
        this.table.dataSource = new RecipientOverviewDataSource();
        this.table.dataSource['data'] = recipientList.map(recipient => {
          return {
            id: recipient.id,
            firstName: recipient.firstName,
            lastName: recipient.lastName
          } as RecipientOverviewItem;
        });
        this.table.dataSource['sort'] = this.sort;
        this.table.dataSource['paginator'] = this.paginator;
      });
  }

  ngOnDestroy(): void {
    if(this.recipientListSubscription) {
      this.recipientListSubscription.unsubscribe();
    }
  }

  openDeleteDialog(row) {
    const dialogRef = this.dialog.open(RecipientDeleteDialogComponent, {
      width: '300px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      window.setTimeout(() => this.changeDetectorRefs.detectChanges(), 1000);
    });
  }
}
