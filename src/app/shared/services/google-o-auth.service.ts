import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of} from "rxjs";
import { map } from "rxjs/operators";
import { OAuthSettingService } from "./o-auth-setting.service";
import { OAuthSetting } from "./o-auth-setting";
import * as nodemailer from 'nodemailer';

@Injectable({
  providedIn: 'root'
})
export class GoogleOAuthService {

  private readonly eagerRefreshThresholdMillis = 8000;

  private accessToken:string|undefined = undefined;
  private accessTokenExpireTime:number|undefined = undefined;

  private oAuthSetting: OAuthSetting | undefined;

  constructor(private http: HttpClient, private oAuthSettingService: OAuthSettingService) {
    this.oAuthSettingService.getOAuthSetting().subscribe(oAuthSetting => {
      this.oAuthSetting = oAuthSetting;
    });
  }

  public async getNodemailerTransport(): Promise<nodemailer.Transporter>
  {
    if(this.oAuthSetting === undefined) {
      throw new Error("OAuth setting missing! Please provide valid oauth settings!");
    }

    const accessToken = await this.getAccessToken().toPromise();

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: this.oAuthSetting.user,
        clientId: this.oAuthSetting.clientId,
        clientSecret: this.oAuthSetting.clientSecret,
        refreshToken: this.oAuthSetting.refreshToken,
        accessToken: accessToken//,
        //expires: 1484314697598
      }
    });
  }

  private getAccessToken(): Observable<string> {
    if(this.accessToken === undefined || this.accessTokenExpireTime === undefined || this.isAccessTokenExpired()) {

      return this.updateAccessToken().pipe(
        map(() => this.accessToken)
      );

    }

    return of(this.accessToken);
  }

  private updateAccessToken():Observable<void> {
    console.log("in updateAccessToken()")

    const header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    let body = "refresh_token=" + encodeURIComponent(this.oAuthSetting.refreshToken);
    body += "&client_id=" + encodeURIComponent(this.oAuthSetting.clientId);
    body += "&client_secret=" + encodeURIComponent(this.oAuthSetting.clientSecret);
    //body += "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);
    body += "&grant_type=refresh_token"; //

    return this.http.post("https://www.googleapis.com/oauth2/v4/token", body, {headers: header}).pipe(
      map(data => {
        // update accessTokenExpireTime
        const expiresMilliseconds = data['expires_in'] * 1000;
        this.accessTokenExpireTime = new Date().getTime() + expiresMilliseconds;

        // update accessToken
        this.accessToken = data['access_token'];

        return;
      })
    );
  }

  private isAccessTokenExpired(): boolean {
    if(this.accessTokenExpireTime === undefined) {
      return true;
    }
    return this.accessTokenExpireTime < (new Date().getTime() + this.eagerRefreshThresholdMillis)
  }

}
