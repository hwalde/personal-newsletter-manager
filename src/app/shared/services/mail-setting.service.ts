import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {BehaviorSubject, Observable} from "rxjs";
import {MailSetting} from "./mail-setting";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MailSettingService {

  private mailSettingSubject$: BehaviorSubject<MailSetting | undefined> = new BehaviorSubject<MailSetting>(undefined);

  private readonly collectionName = "mail-setting";

  constructor(private databaseService: DatabaseService) {
    this.databaseService.waitUntilReady().then(() => {
      if(!this.databaseService.existsCollection(this.collectionName)) {
        this.addInitialData();
      }
      this.loadMailSetting();
    });
  }

  private addInitialData() {
    this.databaseService.addCollection(this.collectionName);
  }

  private loadMailSetting() {
    this.mailSettingSubject$.next(this.databaseService.findOne<MailSetting>(this.collectionName));
  }

  public existsMailSetting(): Observable<boolean>
  {
    return this.mailSettingSubject$.pipe(
      map(mailSetting => mailSetting !== undefined)
    )
  }

  public getMailSetting(): Observable<MailSetting | undefined>
  {
    return this.mailSettingSubject$;
  }

  public setMailSetting(mailSetting: MailSetting): void
  {
    this.mailSettingSubject$.next(mailSetting);
    this.databaseService.deleteAll(this.collectionName)
    this.databaseService.insert<MailSetting>(mailSetting, this.collectionName);
  }

}
