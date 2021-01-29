import { Injectable } from '@angular/core';
import { map, switchMap } from "rxjs/operators";
import { Observable } from "rxjs";
import { RecipientService } from "../recipient/recipient.service";
import { SendMailService } from "./send-mail.service";
import { SendMailRecipientAggregate } from "./send-mail-recipient-aggregate";
import { SendMail } from "./send-mail";
import { Recipient } from "../recipient/recipient";

@Injectable({
  providedIn: 'root'
})
export class SendMailRecipientAggregateService {

  constructor(private recipientService: RecipientService,
              private sendMailService: SendMailService) {}

  public getListByNewsletterId(newsletterId:number) : Observable<SendMailRecipientAggregate[]>
  {
    // lets get the sendMailList for the newsletter
    return this.sendMailService
      .getSendMailListByNewsletterId(newsletterId)
      .pipe(
        // use switch map the replace the observable from sendMailService with the one from recipientService
        switchMap(sendMailList => {
          const recipientIdList = sendMailList.map(sendMail => sendMail.recipientId);
          return this.recipientService
            .getRecipientListByIdList(recipientIdList)
            // and use pipe
            .pipe(
              // with map to return the SendMailRecipientAggregate[] instead of Recipient[]
              map(recipientList => {
                return this.createAggregateList(sendMailList, recipientList);
              })
            );
        })
      );
  }

  private createAggregateList(sendMailList: SendMail[], recipientList: Recipient[]) {
    return sendMailList.map(sendMail => {
      return {recipient: recipientList.find(recipient => recipient.id == sendMail.recipientId), sendMail} as SendMailRecipientAggregate;
    })
  }

}
