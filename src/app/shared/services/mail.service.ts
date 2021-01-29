import { Injectable } from '@angular/core';
import {GoogleOAuthService} from "./google-o-auth.service";
import {ElectronService} from "../../core/services";
import {MailSettingService} from "./mail-setting.service";
import {MailSetting} from "./mail-setting";
import {OAuthSettingService} from "./o-auth-setting.service";
import {forkJoin, Observable} from "rxjs";
import {first, map} from "rxjs/operators";

export interface MailData {
  to: string,
  subject: string,
  text: string,
  html?: string
}

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private mailSetting: MailSetting | undefined;

  constructor(
    private oAuthService: GoogleOAuthService,
    private electronService: ElectronService,
    private mailSettingService: MailSettingService,
    private oAuthSettingService: OAuthSettingService
  ) {
    this.mailSettingService.getMailSetting().subscribe(mailSetting => {
      this.mailSetting = mailSetting;
    });
  }

  public canSendMails(): Observable<boolean>
  {
    return forkJoin([this.mailSettingService.getMailSetting().pipe(first()), this.oAuthSettingService.getOAuthSetting().pipe(first())])
      .pipe(
        map((settings) => {
          return settings[0] != undefined && settings[1] != undefined;
        })
      );
  }

  public async sendMail(mailData:MailData):Promise<any> {
    if(this.mailSetting === undefined) {
      throw new Error("Mail setting missing! Please provide valid mail settings!");
    }

    mailData["from"] = this.mailSetting.senderName + '<' + this.mailSetting.senderEmail + '>';

    const result = (await this.oAuthService.getNodemailerTransport()).sendMail(mailData);

    if(!this.electronService.isElectron) {
      // simulate waiting
      await this.delay(2000);
    }

    console.log(result);
    return result;
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
