import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {RecipientService} from "../../recipient/recipient.service";
import {NewsletterSendDataService} from "./newsletter-send-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NewsletterSendData} from "./newsletter-send-data";
import {SendMailService} from "../send-mail.service";

@Component({
  selector: 'app-newsletter-send',
  templateUrl: './newsletter-send.component.html',
  styleUrls: ['./newsletter-send.component.scss']
})
export class NewsletterSendComponent implements OnInit, OnDestroy {

  newsletterSendData: NewsletterSendData | undefined = undefined;
  private newsletterSendDataSubscription: Subscription;

  constructor(
    private recipientService: RecipientService,
    private sendMailService: SendMailService,
    private newsletterSendDataService: NewsletterSendDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const exists = this.route.snapshot.paramMap.has('id');

    if(exists) {
      const newsletterId = +this.route.snapshot.paramMap.get('id');

      this.newsletterSendDataSubscription = this.newsletterSendDataService
        .getNewsletterSendDataByNewsletterId(newsletterId)
        .subscribe(newsletterSendData => {
          this.newsletterSendData = newsletterSendData;
        });
    }
  }

  ngOnDestroy(): void {
    if(this.newsletterSendDataSubscription) {
      this.newsletterSendDataSubscription.unsubscribe();
    }
  }

}
