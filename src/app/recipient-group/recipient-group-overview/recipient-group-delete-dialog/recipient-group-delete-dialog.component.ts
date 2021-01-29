import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RecipientGroupOverviewItem } from "../recipient-group-overview-item";
import { RecipientGroupService } from "../../recipient-group.service";

@Component({
  selector: 'app-recipient-group-delete-dialog',
  templateUrl: './recipient-group-delete-dialog.component.html',
  styleUrls: ['./recipient-group-delete-dialog.component.scss']
})
export class RecipientGroupDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RecipientGroupDeleteDialogComponent>,
    public recipientGroupService: RecipientGroupService,
    @Inject(MAT_DIALOG_DATA) public data: RecipientGroupOverviewItem
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.recipientGroupService.removeRecipientGroupById(this.data.id);
    this.dialogRef.close();
  }

}

