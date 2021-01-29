import {SendMail} from "./send-mail";
import {Recipient} from "../recipient/recipient";

export interface SendMailRecipientAggregate {
  recipient: Recipient;
  sendMail: SendMail;
}
