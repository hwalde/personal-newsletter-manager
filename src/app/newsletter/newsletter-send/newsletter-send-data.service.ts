import {Injectable} from '@angular/core';
import {Observable, of, ReplaySubject} from "rxjs";
import {NewsletterSendData} from "./newsletter-send-data";
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NewsletterSendDataService {

  private newsletterSendDataListSubject$: ReplaySubject<NewsletterSendData[]> = new ReplaySubject<NewsletterSendData[]>(1);

  private newsletterSendDataListSnapshot: NewsletterSendData[] = [];

  constructor() {}

  public getListSnapshot(): NewsletterSendData[]  {
    return this.newsletterSendDataListSnapshot;
  }

  public getNewsletterSendDataByNewsletterId(newsletterId:number): Observable<NewsletterSendData>
  {
    if(this.newsletterSendDataListSnapshot.find(newsletterSendData => newsletterSendData.newsletterId == newsletterId) === undefined) {
      this.addNewsletterSendData({
        newsletterId: newsletterId,
        recipientDataList: []
      } as NewsletterSendData);
    }
    return this.newsletterSendDataListSubject$.pipe(
      map(newsletterSendDataList => {
        return newsletterSendDataList.find(newsletterSendData => newsletterSendData.newsletterId == newsletterId);
      }),
      filter(newsletterSendData => newsletterSendData != undefined)
    );
  }

  public updateNewsletterSendData(newsletterSendData:NewsletterSendData): void
  {
    const index = this.getSnapshotIndexByNewsletterId(newsletterSendData.newsletterId);

    if(index == -1) {
      throw new Error(
        "Can't update NewsletterSendData, because NewsletterSendData for newsletter id \"" +
        newsletterSendData.newsletterId + "\" does not exist!"
      );
    }

    this.newsletterSendDataListSnapshot[index] = newsletterSendData;
    this.newsletterSendDataListSubject$.next(this.newsletterSendDataListSnapshot);
  }

  private getSnapshotIndexByNewsletterId(newsletterId: number): number
  {
    const index = this.newsletterSendDataListSnapshot
      .findIndex(newsletterSendData => newsletterSendData.newsletterId == newsletterId);

    return index;
  }

  public addNewsletterSendData(newsletterSendData:NewsletterSendData): void
  {
    if(this.getSnapshotIndexByNewsletterId(newsletterSendData.newsletterId) > -1) {
      throw new Error(
        "Can't add NewsletterSendData, because NewsletterSendData for newsletter id \"" +
        newsletterSendData.newsletterId + "\" already exists!"
      );
    }
    this.newsletterSendDataListSnapshot.push(newsletterSendData);
    this.newsletterSendDataListSubject$.next(this.newsletterSendDataListSnapshot);
  }

  public removeNewsletterSendDataByNewsletterId(newsletterId:number): void
  {
    if(this.getSnapshotIndexByNewsletterId(newsletterId) == -1) {
      throw new Error(
        "Can't add NewsletterSendData, NewsletterSendData found for newsletter id \"" +
        newsletterId + "\" does not exist!"
      );
    }

    this.newsletterSendDataListSnapshot = this.newsletterSendDataListSnapshot
      .filter(newsletterSendData => newsletterSendData.newsletterId != newsletterId);

    this.newsletterSendDataListSubject$.next(this.newsletterSendDataListSnapshot);
  }
}
