import {Injectable, isDevMode} from '@angular/core';
import {DatabaseService} from "../shared/services/database.service";
import {Observable, ReplaySubject} from "rxjs";
import {Recipient} from "./recipient";
import {filter, map} from "rxjs/operators";
import {ElectronService} from "../core/services";

@Injectable({
  providedIn: 'root'
})
export class RecipientService {

  private recipientListSubject$: ReplaySubject<Recipient[]> = new ReplaySubject<Recipient[]>(1);

  private recipientListSnapshot: Recipient[];

  private readonly collectionName = "recipient";

  constructor(private databaseService: DatabaseService, private electronService: ElectronService) {
    this.databaseService.waitUntilReady().then(() => {
      if(!this.databaseService.existsCollection(this.collectionName)) {
        this.addInitialData();
      }
      this.loadRecipientList();
    });
  }

  private addInitialData() {
    this.databaseService.addCollection(this.collectionName);

    if(!this.electronService.isElectron) {
      this.databaseService.insert<Recipient>({
        id: 0,
        firstName: "John",
        lastName: "Doe",
        callingName: "Jo",
        emailAddress: "john@doe.com",
        defaultGreeting: "Hello Jo",
        defaultSalutation: "Best Regards,\nYour Email Sender",
        creationDate: new Date()
      } as Recipient, this.collectionName);

      this.databaseService.insert<Recipient>({
        id: 1,
        firstName: "Jane",
        lastName: "Doe",
        callingName: "Jado",
        emailAddress: "jane@doe.com",
        defaultGreeting: "Hello Jado",
        defaultSalutation: "Best Regards,\nYour Email Sender",
        creationDate: new Date()
      } as Recipient, this.collectionName);

      this.databaseService.insert<Recipient>({
        id: 2,
        firstName: "Kid",
        lastName: "Doe",
        callingName: "Ki",
        emailAddress: "kid@doe.com",
        defaultGreeting: "Hello Kid",
        defaultSalutation: "Best Regards,\nYour Email Sender",
        creationDate: new Date()
      } as Recipient, this.collectionName);
    }
    console.log(this.electronService.isElectron);
  }

  private loadRecipientList() {
    this.recipientListSnapshot = this.databaseService.findAll<Recipient>(this.collectionName);
    this.recipientListSubject$.next(this.recipientListSnapshot);
  }

  public getRecipientList(): Observable<Recipient[]>
  {
    return this.recipientListSubject$.asObservable();
  }

  public getRecipientById(id:number): Observable<Recipient>
  {
    return this.recipientListSubject$.pipe(
      map(recipientList => {
        return recipientList.find(recipient => recipient.id == id);
      }),
      filter(recipient => recipient != undefined)
    );
  }

  public getRecipientListByIdList(idList:number[]): Observable<Recipient[]>
  {
    return this.recipientListSubject$.pipe(
      map(recipientList => {
        return idList.map(id => recipientList.find(recipient => recipient.id == id));
      })
    );
  }

  public updateRecipient(recipient:Recipient): void
  {
    let index = this.recipientListSnapshot.findIndex(currentRecipient => currentRecipient.id == recipient.id);
    this.recipientListSnapshot[index] = recipient;
    this.recipientListSubject$.next(this.recipientListSnapshot);
    this.databaseService.updateById(recipient, recipient.id, this.collectionName);
  }

  public addRecipient(recipient:Recipient): void
  {
    recipient.id = this.getHighestId() + 1;
    this.recipientListSnapshot.push(recipient);
    this.recipientListSubject$.next(this.recipientListSnapshot);
    this.databaseService.insert<Recipient>(recipient, this.collectionName);
  }

  private getHighestId(): number
  {
    let highestId = -1;
    this.recipientListSnapshot.forEach(recipient => {
      if(recipient.id > highestId) {
        highestId = recipient.id;
      }
    });
    return highestId;
  }

  public removeRecipientById(id:number): void
  {
    this.recipientListSnapshot = this.recipientListSnapshot.filter(recipient => recipient.id != id);
    this.recipientListSubject$.next(this.recipientListSnapshot);
    this.databaseService.removeById(id, this.collectionName);
  }

}
