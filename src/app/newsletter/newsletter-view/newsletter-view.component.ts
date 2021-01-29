import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subscription} from "rxjs";
import {Newsletter} from "../newsletter";
import {ActivatedRoute, Router} from "@angular/router";
import {NewsletterService} from "../newsletter.service";
import {SendMail} from "../send-mail";
import {SendMailService} from "../send-mail.service";
import {Recipient} from "../../recipient/recipient";
import {switchMap} from "rxjs/operators";
import {SendMailRecipientAggregate} from "../send-mail-recipient-aggregate";
import {SendMailRecipientAggregateService} from "../send-mail-recipient-aggregate.service";

@Component({
  selector: 'app-newsletter-view',
  templateUrl: './newsletter-view.component.html',
  styleUrls: ['./newsletter-view.component.scss']
})
export class NewsletterViewComponent implements OnInit, OnDestroy {

  public newsletter: Newsletter | undefined = undefined;
  private newsletterSubscription: Subscription;

  public title = "";

  public sendMailRecipientAggregateList: SendMailRecipientAggregate[] = [];
  private sendMailRecipientAggregateSubscription: Subscription;


  constructor(
    private route: ActivatedRoute,
    private newsletterService: NewsletterService,
    private sendMailRecipientAggregateService: SendMailRecipientAggregateService
  ) { }

  ngOnInit(): void {
    const exists = this.route.snapshot.paramMap.has('id');

    if(exists) {
      const id = +this.route.snapshot.paramMap.get('id');
      this.newsletterSubscription = this.newsletterService
        .getNewsletterById(id)
        .subscribe(newsletter => {
          this.newsletter = newsletter;
          this.title = newsletter.internalTitle;
        });

      this.sendMailRecipientAggregateSubscription = this.sendMailRecipientAggregateService
        .getListByNewsletterId(id)
        .subscribe(sendMailRecipientAggregateList => {
        this.sendMailRecipientAggregateList = sendMailRecipientAggregateList;
      });
    }
  }

  ngOnDestroy(): void {
    if(this.newsletterSubscription) {
      this.newsletterSubscription.unsubscribe();
    }
    if(this.sendMailRecipientAggregateSubscription) {
      this.sendMailRecipientAggregateSubscription.unsubscribe();
    }
  }

}
