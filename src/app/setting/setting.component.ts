import { Component, OnInit } from '@angular/core';
import { MailService } from "../shared/services/mail.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MailSettingService} from "../shared/services/mail-setting.service";
import {OAuthSettingService} from "../shared/services/o-auth-setting.service";
import {MailSetting} from "../shared/services/mail-setting";
import {OAuthSetting} from "../shared/services/o-auth-setting";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  public form = this.formBuilder.group({
    senderName: [null, Validators.required],
    senderEmail: [null, [Validators.required, Validators.email]],
    user: [null, Validators.required],
    clientId: [null, Validators.required],
    clientSecret: [null, Validators.required],
    refreshToken: [null, Validators.required]
  });

  public log = undefined;

  private mailSettingSubscription: Subscription;
  private oAuthSettingSubscription: Subscription;

  private mailSetting: MailSetting | undefined = undefined;
  private oAuthSetting: OAuthSetting | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private mailSettingService: MailSettingService,
    private oAuthSettingService: OAuthSettingService,
    private mailService: MailService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mailSettingSubscription = this.mailSettingService
      .getMailSetting()
      .subscribe(mailSetting => {
        this.mailSetting = mailSetting;
        if(mailSetting != undefined) {
          this.form.get("senderName").setValue(mailSetting.senderName);
          this.form.get("senderEmail").setValue(mailSetting.senderEmail);
        }
      });
    this.oAuthSettingSubscription = this.oAuthSettingService
      .getOAuthSetting()
      .subscribe(oAuthSetting => {
        this.oAuthSetting = oAuthSetting;
        if(oAuthSetting != undefined) {
          this.form.get("user").setValue(oAuthSetting.user);
          this.form.get("clientId").setValue(oAuthSetting.clientId);
          this.form.get("clientSecret").setValue(oAuthSetting.clientSecret);
          this.form.get("refreshToken").setValue(oAuthSetting.refreshToken);
        }
      });
  }

  ngOnDestroy(): void {
    if(this.mailSettingSubscription) {
      this.mailSettingSubscription.unsubscribe();
    }
    if(this.oAuthSettingSubscription) {
      this.oAuthSettingSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if(this.form.valid) {
      let mailSetting = this.createMailSettingObject();
      let oAuthSetting = this.createOAuthSettingObject();

      this.mailSettingService.setMailSetting(mailSetting);
      this.oAuthSettingService.setOAuthSetting(oAuthSetting);

      this.router.navigate(["/settings"]);
    }
  }

  private createMailSettingObject(): MailSetting
  {
    return  {
      authenticationType: "google-auth",
      senderName: this.form.get("senderName").value,
      senderEmail: this.form.get("senderEmail").value
    } as MailSetting;
  }

  private createOAuthSettingObject(): OAuthSetting
  {
    return  {
      user: this.form.get("user").value,
      clientId: this.form.get("clientId").value,
      clientSecret: this.form.get("clientSecret").value,
      refreshToken: this.form.get("refreshToken").value
    } as OAuthSetting;
  }

  public saveAndSendTestMail() {
    this.form.updateValueAndValidity();
    if(this.form.valid) {
      this.onSubmit();
      this.sendTestMail();
    }
  }

  private sendTestMail() {
    this.log = "";
    this.addToLog('sending mail..');
    this.mailService.sendMail({
      to: this.form.get("senderEmail").value,
      subject: 'This is a test mail',
      text: 'This is the content of the test message!',
      html: '<p>This is the content of the test message!</p>'
    })
      .then(result => {
        this.addToLog('Email sent! Here is the result:');
        this.addToLog(result);
      })
      .catch(error => {
        this.addToLog('An error happened during sending:');
        this.addToLog(error);
      });
  }

  private addToLog(content:any) {
    if(typeof content == "string" || typeof content == "number") {
      this.log += content;
    } else {
      this.log += JSON.stringify(content, null, 4);
    }
    this.log += "\n\n";
  }

}
