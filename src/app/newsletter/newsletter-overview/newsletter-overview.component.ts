import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { NewsletterOverviewDataSource } from './newsletter-overview-datasource';
import { NewsletterService } from "../newsletter.service";
import { Subscription } from "rxjs";
import { NewsletterOverviewItem } from "./newsletter-overview-item";
import { MatDialog } from "@angular/material/dialog";
import { NewsletterDeleteDialogComponent } from "./newsletter-delete-dialog/newsletter-delete-dialog.component";

@Component({
  selector: 'newsletter-overview',
  templateUrl: './newsletter-overview.component.html',
  styleUrls: ['./newsletter-overview.component.scss']
})
export class NewsletterOverviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<NewsletterOverviewItem>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'internalTitle', 'action'];

  private newsletterListSubscription:Subscription;

  constructor(
    private newsletterService: NewsletterService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    this.newsletterListSubscription = this.newsletterService
      .getNewsletterList()
      .subscribe(newsletterList => {
        this.table.dataSource = new NewsletterOverviewDataSource();
        this.table.dataSource['data'] = newsletterList.map(newsletter => {
          return {
            id: newsletter.id,
            internalTitle: newsletter.internalTitle
          } as NewsletterOverviewItem;
        });
        this.table.dataSource['sort'] = this.sort;
        this.table.dataSource['paginator'] = this.paginator;
      });
  }

  ngOnDestroy(): void {
    if(this.newsletterListSubscription) {
      this.newsletterListSubscription.unsubscribe();
    }
  }

  openDeleteDialog(row) {
    const dialogRef = this.dialog.open(NewsletterDeleteDialogComponent, {
      width: '300px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      window.setTimeout(() => this.changeDetectorRefs.detectChanges(), 1000);
    });
  }
}
