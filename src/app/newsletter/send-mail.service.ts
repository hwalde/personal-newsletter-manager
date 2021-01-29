import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { DatabaseService } from "../shared/services/database.service";
import { ElectronService } from "../core/services";
import { map } from "rxjs/operators";
import { SendMail } from "./send-mail";

@Injectable({
  providedIn: 'root'
})
export class SendMailService {

  private sendMailListSubject$: ReplaySubject<SendMail[]> = new ReplaySubject<SendMail[]>(1);

  private sendMailListSnapshot: SendMail[];

  private readonly collectionName = "send-mail";

  constructor(private databaseService: DatabaseService, private electronService: ElectronService) {
    this.databaseService.waitUntilReady().then(() => {
      if(!this.databaseService.existsCollection(this.collectionName)) {
        this.addInitialData();
      }
      this.loadSendMailList();
    });
  }

  private addInitialData() {
    this.databaseService.addCollection(this.collectionName);

    if(!this.electronService.isElectron) {
      this.databaseService.insert<SendMail>({
        newsletterId: 0,
        recipientId: 0,
        emailAddress: "max@mustermann.de",
        subject: "Say hello to an all new me",
        message: "This is the email body",
        sendDate: new Date()
      } as SendMail, this.collectionName);
    }
  }

  private loadSendMailList() {
    this.sendMailListSnapshot = this.databaseService.findAll<SendMail>(this.collectionName);
    this.sendMailListSubject$.next(this.sendMailListSnapshot);
  }

  public getSendMailList(): Observable<SendMail[]>
  {
    return this.sendMailListSubject$.asObservable();
  }

  public getSendMailListByNewsletterId(newsletterId:number): Observable<SendMail[]>
  {
    return this.sendMailListSubject$.pipe(
      map(sendMailList => {
        return sendMailList.filter(sendMail => sendMail.newsletterId == newsletterId);
      })
    );
  }

  public getSendMailListByRecipientId(recipientId:number): Observable<SendMail[]>
  {
    return this.sendMailListSubject$.pipe(
      map(sendMailList => {
        return sendMailList.filter(sendMail => sendMail.recipientId == recipientId);
      })
    );
  }

  public addSendMail(sendMail:SendMail): void
  {
    this.sendMailListSnapshot.push(sendMail);
    this.sendMailListSubject$.next(this.sendMailListSnapshot);
    this.databaseService.insert<SendMail>(sendMail, this.collectionName);
  }

  public removeSendMailsByNewsletterId(newsletterId:number): void
  {
    this.sendMailListSnapshot = this.sendMailListSnapshot.filter(sendMail => sendMail.newsletterId != newsletterId);
    this.sendMailListSubject$.next(this.sendMailListSnapshot);
    this.databaseService.removeByQuery<SendMail>(sendMail => sendMail.newsletterId == newsletterId, this.collectionName);
  }

}
