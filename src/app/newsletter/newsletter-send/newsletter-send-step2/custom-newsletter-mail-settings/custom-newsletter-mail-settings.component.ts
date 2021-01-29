import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Recipient} from "../../../../recipient/recipient";
import {NewsletterSendData} from "../../newsletter-send-data";
import {FormBuilder, Validators} from "@angular/forms";
import {RecipientService} from "../../../../recipient/recipient.service";
import {NewsletterSendDataService} from "../../newsletter-send-data.service";
import {Newsletter} from "../../../newsletter";
import {NewsletterService} from "../../../newsletter.service";

@Component({
  selector: 'app-custom-newsletter-mail-settings',
  templateUrl: './custom-newsletter-mail-settings.component.html',
  styleUrls: ['./custom-newsletter-mail-settings.component.scss']
})
export class CustomNewsletterMailSettingsComponent implements OnInit, OnDestroy {

  public customizationForm = this.formBuilder.group({
    personalMessage: [null/*, Validators.required*/],
  });

  recipient: Recipient | undefined = undefined;
  private recipientSubscription: Subscription;

  newsletter: Newsletter | undefined = undefined;
  private newsletterSubscription: Subscription;

  newsletterSendData: NewsletterSendData | undefined = undefined;
  private newsletterSendDataSubscription: Subscription;

  @Input() newsletterId: number;
  @Input() recipientId: number;
  @Input() askForPersonalMessage: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private recipientService: RecipientService,
    private newsletterService: NewsletterService,
    private newsletterSendDataService: NewsletterSendDataService,
  ) {}

  ngOnInit() {
    this.recipientSubscription = this.recipientService
      .getRecipientById(this.recipientId)
      .subscribe(recipient => this.recipient = recipient);
    this.newsletterSubscription = this.newsletterService
      .getNewsletterById(this.newsletterId)
      .subscribe(newsletter => this.newsletter = newsletter);

    this.newsletterSendDataSubscription = this.newsletterSendDataService
      .getNewsletterSendDataByNewsletterId(this.newsletterId)
      .subscribe(newsletterSendData => {
        this.newsletterSendData = newsletterSendData;
        const recipientData = this.newsletterSendData.recipientDataList.find(recipientData => recipientData.recipientId == this.recipientId);
        if(recipientData === undefined) {
          return; // happens when recipient gets removed
        }
        if(this.askForPersonalMessage) {
          this.customizationForm.get("personalMessage").setValue(recipientData.data["personalMessage"] ?? "");
        }
      });
  }

  ngOnDestroy(): void {
    if(this.recipientSubscription) {
      this.recipientSubscription.unsubscribe();
    }
    if(this.newsletterSubscription) {
      this.newsletterSubscription.unsubscribe();
    }
    if(this.newsletterSendDataSubscription) {
      this.newsletterSendDataSubscription.unsubscribe();
    }
  }

  onChange() {
    this.newsletterSendData.recipientDataList = this.newsletterSendData.recipientDataList.map(recipient => {
      if(recipient.recipientId == this.recipientId) {
        if(this.askForPersonalMessage) {
          recipient.data["personalMessage"] = this.customizationForm.get("personalMessage").value;
        }
      }
      return recipient;
    });
    this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
  }

}
