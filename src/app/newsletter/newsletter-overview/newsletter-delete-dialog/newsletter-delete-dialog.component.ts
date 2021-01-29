import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NewsletterOverviewItem } from "../newsletter-overview-item";
import {NewsletterService} from "../../newsletter.service";

@Component({
  selector: 'app-newsletter-delete-dialog',
  templateUrl: './newsletter-delete-dialog.component.html',
  styleUrls: ['./newsletter-delete-dialog.component.scss']
})
export class NewsletterDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewsletterDeleteDialogComponent>,
    public newsletterService: NewsletterService,
    @Inject(MAT_DIALOG_DATA) public data: NewsletterOverviewItem
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.newsletterService.removeNewsletterById(this.data.id);
    this.dialogRef.close();
  }

}

