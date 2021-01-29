import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Recipient} from "../../../recipient/recipient";
import {NewsletterSendData} from "../newsletter-send-data";
import {FormBuilder} from "@angular/forms";
import {RecipientService} from "../../../recipient/recipient.service";
import {SendMailService} from "../../send-mail.service";
import {NewsletterSendDataService} from "../newsletter-send-data.service";
import {NgOption} from "@ng-select/ng-select/lib/ng-select.types";
import {map} from "rxjs/operators";
import {RecipientGroupSelectionDialogComponent} from "./recipient-group-selection-dialog/recipient-group-selection-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-newsletter-send-step1',
  templateUrl: './newsletter-send-step1.component.html',
  styleUrls: ['./newsletter-send-step1.component.scss']
})
export class NewsletterSendStep1Component implements OnInit, OnDestroy {

  recipientList$: Observable<Recipient[]>;
  selectedRecipientList: Recipient[] = [];
  private recipientSubscription: Subscription;

  newsletterSendData: NewsletterSendData | undefined = undefined;
  private newsletterSendDataSubscription: Subscription;

  @Input() newsletterId: number;

  constructor(
    private formBuilder: FormBuilder,
    private recipientService: RecipientService,
    private sendMailService: SendMailService,
    private newsletterSendDataService: NewsletterSendDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.recipientList$ = this.recipientService.getRecipientList();

    this.newsletterSendDataSubscription = this.newsletterSendDataService
      .getNewsletterSendDataByNewsletterId(this.newsletterId)
      .subscribe(newsletterSendData => {
        this.newsletterSendData = newsletterSendData;
        if(this.recipientSubscription) {
          this.recipientSubscription.unsubscribe();
        }
        this.recipientSubscription = this.recipientService.getRecipientListByIdList(
          newsletterSendData.recipientDataList.map(recipientData => recipientData.recipientId)
        ).subscribe(recipientList => this.selectedRecipientList = recipientList);
      });
  }

  ngOnDestroy(): void {
    if(this.newsletterSendDataSubscription) {
      this.newsletterSendDataSubscription.unsubscribe();
    }
    if(this.recipientSubscription) {
      this.recipientSubscription.unsubscribe();
    }
  }

  onAddRecipient(recipient: Recipient) {
    this.newsletterSendData.recipientDataList.push({
      data: [],
      recipientId: recipient.id,
      progress: 0,
      sendError: undefined,
      status: "prepare"
    });
    this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
  }

  onRemoveRecipient($event: NgOption) {
    const recipient = $event.value as Recipient;
    this.newsletterSendData.recipientDataList = this.newsletterSendData.recipientDataList.filter(recipientData => recipientData.recipientId != recipient.id);
    this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
  }

  onClear() {
    this.newsletterSendData.recipientDataList = [];
    this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
  }

  customSearchFn(term: string, recipient: Recipient) {
    term = term.toLowerCase();
    return recipient.firstName.toLowerCase().indexOf(term) > -1
      || recipient.lastName.toLowerCase().indexOf(term) > -1
      || recipient.callingName.toLowerCase().indexOf(term) > -1
      || (recipient.firstName + " " + recipient.lastName).toLowerCase().indexOf(term) > -1
      || recipient.emailAddress.toLowerCase().indexOf(term) > -1
  }

  isInUse$(recipientId:number): Observable<boolean> {
    return this.sendMailService.getSendMailListByRecipientId(recipientId).pipe(
      map(sendMailList => sendMailList.length > 0)
    )
  }

  getInUseString$(recipientId:number): Observable<string> {
    return this.sendMailService.getSendMailListByRecipientId(recipientId).pipe(
      map(sendMailList => sendMailList.map(sendMail => new Date(sendMail.sendDate)?.toDateString()).join(" and "))
    )
  }

  deleteRecipient(recipient: Recipient) {
    this.newsletterSendData.recipientDataList = this.newsletterSendData.recipientDataList.filter(recipientData => recipientData.recipientId != recipient.id);
    this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
  }

  openRecipientGroupSectionDialog() {
    let dialogRef = this.dialog.open(RecipientGroupSelectionDialogComponent, {
      width: '300px',
      height: '400px',
      data: {newsletterId:this.newsletterId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
