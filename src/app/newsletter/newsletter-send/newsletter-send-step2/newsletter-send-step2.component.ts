import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NewsletterSendData} from "../newsletter-send-data";
import {FormBuilder} from "@angular/forms";
import {NewsletterSendDataService} from "../newsletter-send-data.service";
import {Newsletter} from "../../newsletter";
import {NewsletterService} from "../../newsletter.service";
import {TextWithPlaceholders} from "../../text-with-placeholders";

@Component({
  selector: 'app-newsletter-send-step2',
  templateUrl: './newsletter-send-step2.component.html',
  styleUrls: ['./newsletter-send-step2.component.scss']
})
export class NewsletterSendStep2Component implements OnInit, OnDestroy {

  newsletter$: Observable<Newsletter>;

  newsletterSendData: NewsletterSendData | undefined = undefined;
  private newsletterSendDataSubscription: Subscription;

  newsletterContainsPersonalMessagePlaceholder = false;

  @Input() newsletterId: number;

  constructor(
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService,
    private newsletterSendDataService: NewsletterSendDataService,
  ) {}

  ngOnInit() {

    this.newsletter$ = this.newsletterService.getNewsletterById(this.newsletterId);

    this.newsletter$.subscribe(newsletter => {
      if(new TextWithPlaceholders(newsletter.message, ["personalMessage"])
        .isUsingPlaceholder("personalMessage")
      || new TextWithPlaceholders(newsletter.subject, ["personalMessage"])
          .isUsingPlaceholder("personalMessage")) {
        this.newsletterContainsPersonalMessagePlaceholder = true;
      } else {
        this.newsletterContainsPersonalMessagePlaceholder = false;
      }
    });

    this.newsletterSendDataSubscription = this.newsletterSendDataService
      .getNewsletterSendDataByNewsletterId(this.newsletterId)
      .subscribe(newsletterSendData => {
        this.newsletterSendData = newsletterSendData;
      });
  }

  ngOnDestroy(): void {
    if(this.newsletterSendDataSubscription) {
      this.newsletterSendDataSubscription.unsubscribe();
    }
  }

}
