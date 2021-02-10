import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Newsletter} from "../../newsletter";
import {NewsletterSendData, RecipientData} from "../newsletter-send-data";
import {FormBuilder} from "@angular/forms";
import {NewsletterService} from "../../newsletter.service";
import {NewsletterSendDataService} from "../newsletter-send-data.service";
import {RecipientService} from "../../../recipient/recipient.service";
import {TextWithPlaceholders} from "../../text-with-placeholders";
import {MailData, MailService} from "../../../shared/services/mail.service";
import {Recipient} from "../../../recipient/recipient";
import {Router} from "@angular/router";
import {SendMailService} from "../../send-mail.service";
import {SendMail} from "../../send-mail";

@Component({
  selector: 'app-newsletter-send-step3',
  templateUrl: './newsletter-send-step3.component.html',
  styleUrls: ['./newsletter-send-step3.component.scss']
})
export class NewsletterSendStep3Component implements OnInit, OnDestroy {

  private knownPlaceHolderList = [
    "callingName", "firstName", "lastName", "emailAddress", "defaultGreeting", "defaultSalutation", "personalMessage"
  ];

  newsletter: Newsletter | undefined = undefined;
  private newsletterSubscription: Subscription;

  newsletterSendData: NewsletterSendData | undefined = undefined;
  private newsletterSendDataSubscription: Subscription;

  recipientId2RenderedSubjectMap = new Map<number, string>();
  recipientId2RenderedMessageMap = new Map<number, string>();
  recipientId2RecipientMap = new Map<number, Recipient>();

  @Input() newsletterId: number;

  private recipientSubscription: Subscription;

  sendingMails = false;

  canSendMails$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private newsletterService: NewsletterService,
    private recipientService: RecipientService,
    private sendMailService: SendMailService,
    private newsletterSendDataService: NewsletterSendDataService,
    private mailService: MailService,
    private router: Router,
  ) {}

  ngOnInit() {
    // load newsletter
    this.newsletterSubscription = this.newsletterService
      .getNewsletterById(this.newsletterId)
      .subscribe(newsletter => {
      this.newsletter = newsletter;
      this.updateDataIfPossible();
      });

    // load newsletterSendData
    this.newsletterSendDataSubscription = this.newsletterSendDataService
      .getNewsletterSendDataByNewsletterId(this.newsletterId)
      .subscribe(newsletterSendData => {
        this.newsletterSendData = newsletterSendData;

        if(this.newsletterSendData.recipientDataList.length > 0) {
          console.log("Updated newsletterSendData:");
          console.log(this.newsletterSendData.recipientDataList[0].status);
        }


        this.updateDataIfPossible();
      });

    // can send mails?
    this.canSendMails$ = this.mailService.canSendMails();
  }

  private updateDataIfPossible() {
    if(this.newsletter && this.newsletterSendData) {
      this.updateData();
    }
  }

  private updateData() {
    const subjectTextWithPlaceholders = new TextWithPlaceholders(this.newsletter.subject, this.knownPlaceHolderList);
    const messageTextWithPlaceholders = new TextWithPlaceholders(this.newsletter.message, this.knownPlaceHolderList);

    const recipientIdList = this.newsletterSendData.recipientDataList.map(recipientData => recipientData.recipientId);

    this.recipientSubscription = this.recipientService.getRecipientListByIdList(recipientIdList).subscribe(recipientList => {
      this.newsletterSendData.recipientDataList.forEach(recipientData => {
        const recipient = recipientList.find(recipient => recipient.id == recipientData.recipientId);

        this.recipientId2RecipientMap.set(recipientData.recipientId, recipient);

        const placeHolderReplaceMap = new Map<string, string>();
        placeHolderReplaceMap.set("id", recipient.id.toString());
        placeHolderReplaceMap.set("firstName", recipient.firstName);
        placeHolderReplaceMap.set("lastName", recipient.lastName);
        placeHolderReplaceMap.set("callingName", recipient.callingName);
        placeHolderReplaceMap.set("emailAddress", recipient.emailAddress);
        placeHolderReplaceMap.set("defaultGreeting", recipient.defaultGreeting);
        placeHolderReplaceMap.set("defaultSalutation", recipient.defaultSalutation);

        let personalMessage = recipientData.data["personalMessage"] ?? "";
        // if(personalMessage.trim() == "") {
        //   personalMessage = " ";
        // } else {
        //   personalMessage += "\n";
        // }

        placeHolderReplaceMap.set("personalMessage", personalMessage);

        const renderedSubject = subjectTextWithPlaceholders.compileText(placeHolderReplaceMap);
        const renderedMessage = messageTextWithPlaceholders.compileText(placeHolderReplaceMap);

        this.recipientId2RenderedSubjectMap.set(recipientData.recipientId, renderedSubject);
        this.recipientId2RenderedMessageMap.set(recipientData.recipientId, renderedMessage);
      })
    })
  }

  ngOnDestroy(): void {
    if(this.newsletterSubscription) {
      this.newsletterSubscription.unsubscribe();
    }
    if(this.newsletterSendDataSubscription) {
      this.newsletterSendDataSubscription.unsubscribe();
    }
    if(this.recipientSubscription) {
      this.recipientSubscription.unsubscribe();
    }
  }

  sendNewsletter() {
    this.sendingMails = true;
    this.setStatusOfUnfinishedRecipientsToSending();
    console.log("Before send:");
    console.log(this.newsletterSendData.recipientDataList[0].status + " <-");
    this.sendMails();
    this.endSendingProcessIfAllMailsHaveBeenSendSuccessfully();
    console.log("After send:");
    console.log(this.newsletterSendData.recipientDataList[0].status + " <-");
    this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
    this.sendingMails = false;
  }

  private setStatusOfUnfinishedRecipientsToSending() {
    this.newsletterSendData.recipientDataList = this.newsletterSendData.recipientDataList.map(recipientData => {
      if (recipientData.status != "finished") {
        console.log("set recipient with id " + recipientData.recipientId + " and current status " + recipientData.status + " to status sending");
        recipientData.status = "sending";
      }
      return recipientData;
    });
  }

  private sendMails() {
    this.newsletterSendData.recipientDataList.forEach((recipientData, index) => {
      this.sendMailToRecipient(recipientData, index);
      console.log("new recipientData after sending: ");
      console.log(recipientData);
    });
  }

  sendMailToRecipient(recipientData: RecipientData, index: number) {
    if (recipientData.status != "sending") {
        return; // nothing to do
    }

    recipientData.sendLog = undefined; // reset send log
    recipientData.sendError = undefined; // reset send error

    const mailData = {
      to: this.recipientId2RecipientMap.get(recipientData.recipientId).emailAddress,
      subject: this.recipientId2RenderedSubjectMap.get(recipientData.recipientId),
      text: this.recipientId2RenderedMessageMap.get(recipientData.recipientId)
    } as MailData;

    this.addToRecipientSendLog(recipientData, 'sending mail..');
    this.mailService.sendMail(mailData)
      .then(result => {
        this.addToRecipientSendLog(recipientData, 'E-Mail send successfully. Here is the result:');
        this.addToRecipientSendLog(recipientData, result);

        this.sendMailService.addSendMail({
          sendDate: new Date(),
          recipientId: recipientData.recipientId,
          newsletterId: this.newsletterId,
          subject: mailData.subject,
          message: mailData.text,
          emailAddress: mailData.to
        } as SendMail);

        recipientData.status = "finished";

        this.newsletterSendData.recipientDataList[index] = recipientData;

        console.log("Right after send:");
        console.log(index);
        console.log(this.newsletterSendData.recipientDataList);
        console.log(this.newsletterSendData.recipientDataList[index]);

        this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
      })
      .catch(error => {
        this.addToRecipientSendLog(recipientData, error);
        recipientData.sendError = error;
        this.addToRecipientSendLog(recipientData, 'Email send failed! Here is the error:');
        this.addToRecipientSendLog(recipientData, error);
        recipientData.status = "prepare";

        this.newsletterSendData.recipientDataList[index] = recipientData;
        this.newsletterSendDataService.updateNewsletterSendData(this.newsletterSendData);
      });
  }

  private addToRecipientSendLog(recipientData:RecipientData, contentToAdd:any) {
    if(recipientData.sendLog == undefined) {
      recipientData.sendLog = "";
    }

    if(typeof contentToAdd == "string" || typeof contentToAdd == "number") {
      recipientData.sendLog += contentToAdd;
    } else {
      recipientData.sendLog += JSON.stringify(contentToAdd, null, 4);
    }
    recipientData.sendLog += "\n\n";
  }

  private endSendingProcessIfAllMailsHaveBeenSendSuccessfully() {
    const haveAllMailsBeenSendSuccessfully
      = this.newsletterSendData
      .recipientDataList
      .find(recipientData => recipientData.status != "finished") == undefined;

    console.error("ENDED");

    if(haveAllMailsBeenSendSuccessfully) {
      // this.endSendingProcess();
    }
  }

  public endSendingProcess() {
    this.newsletterSendDataService.removeNewsletterSendDataByNewsletterId(this.newsletterId);
    this.router.navigate(["/newsletter", "view", this.newsletterId]);
  }

}
