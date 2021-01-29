import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RecipientOverviewItem } from "../recipient-overview-item";
import {RecipientService} from "../../recipient.service";

@Component({
  selector: 'app-recipient-delete-dialog',
  templateUrl: './recipient-delete-dialog.component.html',
  styleUrls: ['./recipient-delete-dialog.component.scss']
})
export class RecipientDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RecipientDeleteDialogComponent>,
    public recipientService: RecipientService,
    @Inject(MAT_DIALOG_DATA) public data: RecipientOverviewItem
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.recipientService.removeRecipientById(this.data.id);
    this.dialogRef.close();
  }

}

