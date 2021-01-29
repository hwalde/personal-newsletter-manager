import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RecipientGroupOverviewDataSource } from './recipient-group-overview-datasource';
import { RecipientGroupService } from "../recipient-group.service";
import { Subscription } from "rxjs";
import { RecipientGroupOverviewItem } from "./recipient-group-overview-item";
import { MatDialog } from "@angular/material/dialog";
import { RecipientGroupDeleteDialogComponent } from "./recipient-group-delete-dialog/recipient-group-delete-dialog.component";

@Component({
  selector: 'recipient-group-overview',
  templateUrl: './recipient-group-overview.component.html',
  styleUrls: ['./recipient-group-overview.component.scss']
})
export class RecipientGroupOverviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<RecipientGroupOverviewItem>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'title', 'action'];

  private recipientGroupListSubscription:Subscription;

  constructor(
    private recipientGroupService: RecipientGroupService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.recipientGroupListSubscription = this.recipientGroupService
      .getRecipientGroupList()
      .subscribe(recipientGroupList => {
        this.table.dataSource = new RecipientGroupOverviewDataSource();
        this.table.dataSource['data'] = recipientGroupList.map(recipientGroup=> {
          return {
            id: recipientGroup.id,
            title: recipientGroup.title
          } as RecipientGroupOverviewItem;
        });
        this.table.dataSource['sort'] = this.sort;
        this.table.dataSource['paginator'] = this.paginator;
      });
  }

  ngOnDestroy(): void {
    if(this.recipientGroupListSubscription) {
      this.recipientGroupListSubscription.unsubscribe();
    }
  }

  openDeleteDialog(row) {
    const dialogRef = this.dialog.open(RecipientGroupDeleteDialogComponent, {
      width: '300px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      window.setTimeout(() => this.changeDetectorRefs.detectChanges(), 1000);
    });
  }
}
