import {Injectable, isDevMode} from '@angular/core';
import {DatabaseService} from "../shared/services/database.service";
import {Observable, ReplaySubject} from "rxjs";
import {Newsletter} from "./newsletter";
import {filter, map} from "rxjs/operators";
import {ElectronService} from "../core/services";

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private newsletterListSubject$: ReplaySubject<Newsletter[]> = new ReplaySubject<Newsletter[]>(1);

  private newsletterListSnapshot: Newsletter[];

  private readonly collectionName = "newsletter";

  constructor(private databaseService: DatabaseService, private electronService: ElectronService) {
    this.databaseService.waitUntilReady().then(() => {
      if(!this.databaseService.existsCollection(this.collectionName)) {
        this.addInitialData();
      }
      this.loadNewsletterList();
    });
  }

  private addInitialData() {
    this.databaseService.addCollection(this.collectionName);

    if(!this.electronService.isElectron) {
      this.databaseService.insert<Newsletter>({
        id: 0,
        internalTitle: "My first newsletter!",
        subject: "{{callingName}} hello to an all new you",
        message: "{{defaultGreeting}},\n\n is {{firstName}} {{lastName}} your name?\n{{callingName}} what is this \"{{unknwon}}\"? If I know more then I'll going to send you a mal to your mail address ({{emailAddress}} I assume).\n\n Anyway what I wanted to tell you especially is:\n{{personalMessage}}{{defaultSalutation}}",
        creationDate: new Date()
      } as Newsletter, this.collectionName);
    }
  }

  private loadNewsletterList() {
    this.newsletterListSnapshot = this.databaseService.findAll<Newsletter>(this.collectionName);
    this.newsletterListSubject$.next(this.newsletterListSnapshot);
  }

  public getNewsletterList(): Observable<Newsletter[]>
  {
    return this.newsletterListSubject$.asObservable();
  }

  public getNewsletterById(id:number): Observable<Newsletter>
  {
    return this.newsletterListSubject$.pipe(
      map(newsletterList => {
        return newsletterList.find(newsletter => newsletter.id == id);
      }),
      filter(newsletter => newsletter != undefined)
    );
  }

  public updateNewsletter(newsletter:Newsletter): void
  {
    let index = this.newsletterListSnapshot.findIndex(currentNewsletter => currentNewsletter.id == newsletter.id);
    this.newsletterListSnapshot[index] = newsletter;
    this.newsletterListSubject$.next(this.newsletterListSnapshot);
    this.databaseService.updateById(newsletter, newsletter.id, this.collectionName);
  }

  public addNewsletter(newsletter:Newsletter): void
  {
    newsletter.id = this.getHighestId() + 1;
    this.newsletterListSnapshot.push(newsletter);
    this.newsletterListSubject$.next(this.newsletterListSnapshot);
    this.databaseService.insert<Newsletter>(newsletter, this.collectionName);
  }

  private getHighestId(): number
  {
    let highestId = -1;
    this.newsletterListSnapshot.forEach(newsletter => {
      if(newsletter.id > highestId) {
        highestId = newsletter.id;
      }
    });
    return highestId;
  }

  public removeNewsletterById(id:number): void
  {
    this.newsletterListSnapshot = this.newsletterListSnapshot.filter(newsletter => newsletter.id != id);
    this.newsletterListSubject$.next(this.newsletterListSnapshot);
    this.databaseService.removeById(id, this.collectionName);
  }

}
