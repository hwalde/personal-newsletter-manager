import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RecipientGroupService} from "../../../../recipient-group/recipient-group.service";
import {NewsletterSendDataService} from "../../newsletter-send-data.service";
import {Observable, Subscription} from "rxjs";
import {RecipientGroup} from "../../../../recipient-group/recipient-group";

@Component({
  selector: 'app-recipient-group-selection-dialog',
  templateUrl: './recipient-group-selection-dialog.component.html',
  styleUrls: ['./recipient-group-selection-dialog.component.scss']
})
export class RecipientGroupSelectionDialogComponent implements OnInit , OnDestroy {

  recipientGroupList$: Observable<RecipientGroup[]>;
  selectedRecipientGroupList: RecipientGroup[] = [];

  newsletterSendDataSubscription: Subscription;

  constructor(
    private dialogRef: MatDialogRef<RecipientGroupSelectionDialogComponent>,
    private recipientGroupService: RecipientGroupService,
    private newsletterSendDataService: NewsletterSendDataService,
    @Inject(MAT_DIALOG_DATA) public data: {newsletterId:number}
  ) {}

  ngOnInit(): void {
    this.recipientGroupList$ = this.recipientGroupService.getRecipientGroupList();
  }

  ngOnDestroy(): void {
    if(this.newsletterSendDataSubscription) {
      this.newsletterSendDataSubscription.unsubscribe();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addGroups() {
    if(this.newsletterSendDataSubscription) {
      throw new Error("Add Groups button is only allowed to be clicked once at the same time");
    }

    this.newsletterSendDataSubscription = this.newsletterSendDataService.getNewsletterSendDataByNewsletterId(this.data.newsletterId).subscribe(newsletterSendData => {

      let changed = false;
      const usedRecipientIdList = newsletterSendData.recipientDataList.map(recipientData => recipientData.recipientId);

      this.selectedRecipientGroupList.forEach(recipientGroup => {
        recipientGroup.recipientIdList.forEach(recipientId => {
          const isRecipientInUse = usedRecipientIdList.find(usedRecipientId => usedRecipientId == recipientId) != undefined;
          console.log(isRecipientInUse);
          if(!isRecipientInUse) {
            newsletterSendData.recipientDataList.push({
              data: [],
              recipientId: recipientId,
              progress: 0,
              sendError: undefined,
              status: "prepare"
            });
            changed = true;
            usedRecipientIdList.push(recipientId);
          }
        });
      });

      if(changed) {
        this.newsletterSendDataService.updateNewsletterSendData(newsletterSendData);
      }

      this.dialogRef.close();
    });

  }

}
