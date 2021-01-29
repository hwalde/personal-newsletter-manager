import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {BehaviorSubject, Observable} from "rxjs";
import {OAuthSetting} from "./o-auth-setting";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OAuthSettingService {

  private oAuthSettingSubject$: BehaviorSubject<OAuthSetting | undefined> = new BehaviorSubject<OAuthSetting>(undefined);

  private readonly collectionName = "oauth-setting";

  constructor(private databaseService: DatabaseService) {
    this.databaseService.waitUntilReady().then(() => {
      if(!this.databaseService.existsCollection(this.collectionName)) {
        this.addInitialData();
      }
      this.loadOAuthSetting();
    });
  }

  private addInitialData() {
    this.databaseService.addCollection(this.collectionName);
  }

  private loadOAuthSetting() {
    this.oAuthSettingSubject$.next(this.databaseService.findOne<OAuthSetting>(this.collectionName));
  }

  public existsOAuthSetting(): Observable<boolean>
  {
    return this.oAuthSettingSubject$.pipe(
      map(mailSetting => mailSetting !== undefined)
    )
  }

  public getOAuthSetting(): Observable<OAuthSetting | undefined>
  {
    return this.oAuthSettingSubject$;
  }

  public setOAuthSetting(mailSetting: OAuthSetting): void
  {
    this.oAuthSettingSubject$.next(mailSetting);
    this.databaseService.deleteAll(this.collectionName)
    this.databaseService.insert<OAuthSetting>(mailSetting, this.collectionName);
  }

}
